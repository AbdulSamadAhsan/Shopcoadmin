import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageFromHash, pageHash } from '../src/utils/navigation.js';

test('every dashboard page can be restored from its URL after refresh', () => {
  for (const page of ['Overview', 'Orders', 'Products', 'Coupons', 'Customers', 'Analytics', 'Settings']) {
    const savedUrl = new URL(`https://dashboard.example/${pageHash(page)}`);
    assert.equal(pageFromHash(savedUrl.hash), page);
  }
});
test('empty or unknown routes fall back safely and valid routes ignore casing', () => {
  assert.equal(pageFromHash(''), 'Overview');
  assert.equal(pageFromHash('#/missing'), 'Overview');
  assert.equal(pageFromHash('#/COUPONS'), 'Coupons');
  assert.equal(pageHash('missing'), '#/overview');
});
