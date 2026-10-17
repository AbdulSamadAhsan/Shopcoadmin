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
