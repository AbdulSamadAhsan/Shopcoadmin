import { test } from 'node:test';
import assert from 'node:assert/strict';
import { api, toOrder, clearSession } from '../src/services/api.js';
import { getAnalytics } from '../src/utils/analytics.js';

test('API adapter paginates, preserves item snapshots, and sends only status updates', async () => {
  const original = globalThis.fetch;
  const calls = [];
  const raw = { _id: 'abc', customer: { name: 'Buyer', email: 'buyer@example.com' }, orderNumber: 'ORD-1', status: 'delivered', paymentStatus: 'paid', currency: 'USD', total: 25, createdAt: '2026-10-14T12:00:00Z', items: [{ product: 'product-id', name: 'Product', quantity: 2, price: 12.5 }] };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => options.method === 'PUT' ? { success: true, order: { ...raw, status: 'shipped' } } : { success: true, orders: [raw], pagination: { pages: 2 } } };
  };
  try {
    const orders = await api.orders();
    assert.equal(orders.length, 2);
    assert.match(calls[1].url, /page=2/);
    assert.equal(orders[0].status, 'Completed');
    assert.equal(orders[0].items, 2);
    assert.equal(orders[0].lineItems[0].unitPrice, 12.5);
    const updated = await api.updateStatus('abc', 'shipped');
    assert.equal(updated.status, 'Shipped');
    assert.deepEqual(JSON.parse(calls[2].options.body), { status: 'shipped' });
    assert.equal(calls[2].options.headers.Authorization, undefined);
    globalThis.fetch = async () => ({ ok: false, status: 503, json: async () => ({ success: false, message: 'Database unavailable' }) });
    await assert.rejects(api.products(), /Database unavailable/);
    globalThis.fetch = async () => { throw new TypeError('offline'); };
    await assert.rejects(api.products(), /Cannot reach the API/);
    const data = getAnalytics([toOrder(raw), toOrder({ ...raw, _id: 'cancelled', status: 'cancelled' }), toOrder({ ...raw, _id: 'eur', currency: 'EUR' })], [{ id: 'product-id', category: 'Fashion' }], 'This month', new Date('2026-10-17T12:00:00Z'));
    assert.equal(data.revenue, 25);
    assert.equal(data.orderCount, 3);
    assert.equal(data.categories[0].amount, 25);
    assert.equal(data.excludesOtherCurrencies, true);
  } finally { globalThis.fetch = original; }
});

test('real login attaches token, clears it on expiry, and never sends it after logout', async () => {
  const original = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push(options);
    return { ok: true, status: 200, json: async () => url.endsWith('/admin/login') ? { success: true, token: 'test-token', expiresIn: 3600, admin: { email: 'admin@example.com' } } : { success: true, products: [] } };
  };
  try {
    await api.login('admin@example.com', 'test-passphrase');
    await api.products();
    assert.equal(requests[1].headers.Authorization, 'Bearer test-token');
    clearSession();
    await api.products();
    assert.equal(requests[2].headers.Authorization, undefined);
    await api.login('admin@example.com', 'test-passphrase');
    globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({ success: false, message: 'Expired token' }) });
    await assert.rejects(api.products(), /Expired token/);
    globalThis.fetch = async (url, options) => { assert.equal(options.headers.Authorization, undefined); return { ok: true, status: 200, json: async () => ({ success: true, products: [] }) }; };
    await api.products();
  } finally { clearSession(); globalThis.fetch = original; }
});

test('refresh restores the saved session without extending expiry and logout removes it', async () => {
  const originalFetch = globalThis.fetch;
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  const storage = new Map();
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  } });
  let refreshed;
  const admin = { email: 'admin@example.com' };
  globalThis.fetch = async (url, options) => {
    if (url.endsWith('/admin/login')) return { ok: true, status: 200, json: async () => ({ success: true, token: 'refresh-token', expiresIn: 3600, admin }) };
    assert.equal(options.headers.Authorization, 'Bearer refresh-token');
    return { ok: true, status: 200, json: async () => ({ success: true, products: [] }) };
  };
  try {
    await api.login(admin.email, 'test-passphrase');
    const saved = storage.get('commerce-admin-session');
    refreshed = await import('../src/services/api.js?refresh-test');
    assert.deepEqual(refreshed.restoreSession(), admin);
    await refreshed.api.products();
    assert.equal(storage.get('commerce-admin-session'), saved);
    refreshed.clearSession();
    assert.equal(storage.size, 0);
    assert.equal(refreshed.restoreSession(), null);
    storage.set('commerce-admin-session', JSON.stringify({ token: 'expired', admin, expiresAt: Date.now() - 1 }));
    assert.equal(refreshed.restoreSession(), null);
    assert.equal(storage.size, 0);
    storage.set('commerce-admin-session', '{invalid');
    assert.equal(refreshed.restoreSession(), null);
    assert.equal(storage.size, 0);
  } finally {
    clearSession();
    refreshed?.clearSession();
    globalThis.fetch = originalFetch;
    if (originalStorage) Object.defineProperty(globalThis, 'sessionStorage', originalStorage);
    else delete globalThis.sessionStorage;
  }
});

test('product edits use multipart PUT and preserve image and unedited product fields', async () => {
  const original = globalThis.fetch;
  const existing = { _id: 'abc123', name: 'Original', price: 25, stock: 4, image: 'https://example.com/product.jpg', slug: 'original', sales: 8, sizes: ['M'], active: true };
  const changes = new FormData();
  changes.set('name', 'Updated product');
  changes.set('price', '30');
  changes.set('stock', '5');
  changes.set('description', 'Updated description');
  changes.set('brand', 'Shopco');
  globalThis.fetch = async (url, options) => {
    assert.match(url, /\/products\/abc123$/);
    assert.equal(options.method, 'PUT');
    assert.equal(options.body, changes);
    assert.equal(options.headers['Content-Type'], undefined);
    assert.equal(options.body.has('image'), false);
    assert.equal(options.body.has('sales'), false);
    return { ok: true, status: 200, json: async () => ({ success: true, product: { ...existing, ...Object.fromEntries(changes), price: 30, stock: 5 } }) };
  };
  try {
    const updated = await api.saveProduct(existing._id, changes);
    assert.equal(updated.name, 'Updated product');
    assert.equal(updated.description, 'Updated description');
    assert.equal(updated.image, existing.image);
    assert.equal(updated.slug, existing.slug);
    assert.equal(updated.sold, 8);
    assert.deepEqual(updated.sizes, ['M']);
    assert.equal(updated.active, true);
  } finally { globalThis.fetch = original; }
});
