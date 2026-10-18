const API_BASE = (import.meta.env?.VITE_API_URL || (import.meta.env?.PROD ? "https://react-admin-api-two.vercel.app/api" : "http://localhost:4000/api")).replace(/\/$/, "");
const API_ORIGIN = new URL(API_BASE, globalThis.location?.origin || "http://localhost").origin;

let accessToken = null;
let expiryTimer;
const SESSION_KEY = "commerce-admin-session";
function saveSession(session) {
  try { globalThis.sessionStorage?.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
}
export function restoreSession() {
  try {
    const session = JSON.parse(globalThis.sessionStorage?.getItem(SESSION_KEY) || "null");
    if (!session || typeof session.token !== "string" || !session.token || !session.admin || !Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) {
      clearSession();
      return null;
    }
    accessToken = session.token;
    clearTimeout(expiryTimer);
    expiryTimer = setTimeout(expiredSession, session.expiresAt - Date.now());
    return session.admin;
  } catch {
    clearSession();
    return null;
  }
}
export function clearSession() {
  accessToken = null;
  clearTimeout(expiryTimer);
  try { globalThis.sessionStorage?.removeItem(SESSION_KEY); } catch {}
}
function expiredSession() {
  clearSession();
  if (typeof window !== "undefined") window.dispatchEvent(new Event("admin-session-expired"));
}
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...options.headers },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Cannot reach the API. Check that the API server is running and the dashboard API URL is correct.");
  }
  if (response.status === 401 && accessToken) expiredSession();
  const body = await response.json().catch(() => null);
  if (!response.ok || !body || body.success === false) throw new Error(body?.message || `API request failed (${response.status})`);
  return body;
}

export const orderStatuses = [
  ["awaiting_payment", "Awaiting payment"], ["pending", "Pending"], ["processing", "Processing"], ["shipped", "Shipped"],
  ["delivered", "Completed"], ["cancelled", "Cancelled"],
];
export const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-";
export function toProduct(product) {
  const image = product.image ? new URL(product.image, API_ORIGIN).href : "";
  return { ...product, id: product._id, sold: product.sales || 0, image, icon: "bag", color: /^#[0-9a-f]{3,8}$/i.test(product.color || "") ? product.color : "#e0e7db" };
}
export function toOrder(order) {
  return {
    ...order, id: order._id, orderNumber: order.orderNumber || order._id,
    name: order.customer.name, email: order.customer.email,
    date: formatDate(order.createdAt), amount: order.total,
    apiStatus: order.status,
    status: orderStatuses.find(([value]) => value === order.status)?.[1] || order.status,
    product: order.items.map(item => item.name).join(", "),
    lineItems: order.items.map(item => ({ ...item, productId: item.product, unitPrice: item.price })),
    items: order.items.reduce((count, item) => count + item.quantity, 0),
  };
}
export const api = {
  async updateAccount(data) {
    return request("/admin/me", { method: "PATCH", body: JSON.stringify(data) });
  },
  async login(email, password) {
    clearSession();
    const session = await request("/admin/login", { method: "POST", body: JSON.stringify({ email, password }) });
    accessToken = session.token;
    const expiresAt = Date.now() + session.expiresIn * 1000;
    saveSession({ token: session.token, admin: session.admin, expiresAt });
    expiryTimer = setTimeout(expiredSession, expiresAt - Date.now());
    return session.admin;
  },
  async products(signal) { return (await request("/products", { signal })).products.map(toProduct); },
  async coupons(page, search, signal) { return request(`/coupons?${new URLSearchParams({ page, search })}`, { signal }); },
  async saveCoupon(id, data) { return request(id ? `/coupons/${id}` : '/coupons', { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) }); },
  async deleteCoupon(id) { return request(`/coupons/${id}`, { method: 'DELETE' }); },
  async productReviews(id, page, signal) { return request(`/products/${id}/reviews?page=${page}`, { signal }); },
  async orders(signal) {
    const orders = [];
    let page = 1;
    let pages;
    do {
      const response = await request(`/orders?page=${page}&limit=100`, { signal });
      orders.push(...response.orders.map(toOrder));
      pages = response.pagination.pages;
      page++;
    } while (page <= pages);
    return orders;
  },
  async customers(signal) { return (await request("/customers", { signal })).customers; },
  async settings(signal) { return (await request("/settings", { signal })).settings; },
  async saveProduct(id, data) { return toProduct((await request(id ? `/products/${id}` : "/products", { method: id ? "PUT" : "POST", body: data })).product); },
  async deleteProduct(id) { return request(`/products/${id}`, { method: "DELETE" }); },
  async updateStatus(id, status) { return toOrder((await request(`/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) })).order); },
  async saveSettings(settings) { return (await request("/settings", { method: "PUT", body: JSON.stringify(settings) })).settings; },
};
