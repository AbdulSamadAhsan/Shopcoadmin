import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getAnalytics, getSoldQuantities } from '../src/utils/analytics.js';

test('revenue, chart, category totals and growth count only delivered USD orders', () => {
  const make = (apiStatus, paymentStatus, amount, createdAt, currency = 'USD') => ({ apiStatus, paymentStatus, amount, createdAt, currency, email: 'buyer@example.com', lineItems: [{ productId: 'p1', unitPrice: amount, quantity: 1 }] });
  const orders = [
    make('delivered', 'unpaid', 100, new Date(2026, 9, 10)),
    make('processing', 'paid', 500, new Date(2026, 9, 10)),
    make('shipped', 'paid', 200, new Date(2026, 9, 10)),
    make('pending', 'paid', 50, new Date(2026, 9, 10)),
    make('cancelled', 'paid', 75, new Date(2026, 9, 10)),
    make('delivered', 'paid', 1000, new Date(2026, 9, 10), 'PKR'),
    make('delivered', 'paid', 50, new Date(2026, 8, 10)),
    make('processing', 'paid', 400, new Date(2026, 8, 10)),
  ];
  const result = getAnalytics(orders, [{ id: 'p1', category: 'Fashion' }], 'This month', new Date(2026, 9, 18));
  assert.equal(result.revenue, 100);
  assert.equal(result.revenueOrderCount, 1);
  assert.equal(result.revenueGrowth, 100);
  assert.equal(result.daily.reduce((sum, day) => sum + day.revenue, 0), 100);
  assert.equal(result.daily.reduce((sum, day) => sum + day.previousRevenue, 0), 50);
  assert.deepEqual(result.categories, [{ name: 'Fashion', amount: 100 }]);
  assert.equal(result.orderCount, 6);
});
test('units sold sum delivered item quantities across orders and variants only', () => {
  const result = getSoldQuantities([
    { apiStatus: 'delivered', lineItems: [{ productId: 'a', quantity: 2 }, { productId: 'a', quantity: 3 }, { productId: 'b', quantity: 1 }] },
    { apiStatus: 'delivered', lineItems: [{ productId: 'a', quantity: 4 }] },
    ...['pending', 'processing', 'shipped', 'cancelled'].map(apiStatus => ({ apiStatus, lineItems: [{ productId: 'a', quantity: 100 }] })),
    { apiStatus: 'delivered', lineItems: [{ productId: 'a', quantity: -3 }, { quantity: 2 }] },
  ]);
  assert.equal(result.get('a'), 9);
  assert.equal(result.get('b'), 1);
  assert.equal(result.get('unsold'), undefined);
});
