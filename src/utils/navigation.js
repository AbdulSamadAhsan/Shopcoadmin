const pages = ['Overview', 'Orders', 'Products', 'Coupons', 'Customers', 'Analytics', 'Settings'];
export function pageFromHash(hash = '') {
  const slug = hash.replace(/^#\/?/, '').toLowerCase();
  return pages.find(page => page.toLowerCase() === slug) || 'Overview';
}
export function pageHash(page) {
  const valid = pages.includes(page) ? page : 'Overview';
  return `#/${valid.toLowerCase()}`;
}
