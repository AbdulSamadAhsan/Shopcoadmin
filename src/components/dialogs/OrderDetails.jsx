import React, { useState } from "react";
import { money } from "../../utils/formatters";
import { orderStatuses } from "../../services/api";
export default function OrderDetails({ modal, setModal, updateStatus, notify }) {
  const order = modal.order;
  const [status, setStatus] = useState(order.apiStatus);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const updated = await updateStatus(order.id, status);
      setModal({ type: "order", order: updated });
      notify("Order status updated");
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  return <>
    <span className="eyebrow">ORDER DETAILS</span>
    <h2 id="modal-title">#{order.orderNumber}</h2>
    <span className={`status ${order.status.toLowerCase()}`}><i />{order.status}</span>
    <dl>
      <dt>Customer</dt><dd>{order.name}</dd>
      <dt>Email</dt><dd>{order.email}</dd>
      <dt>Mobile</dt><dd>{order.customer?.phone || "Not provided"}</dd>
      <dt>Date</dt><dd>{order.date}</dd>
      <dt>Payment</dt><dd>{order.paymentStatus}</dd>
      <dt>Shipping</dt><dd>{Object.values(order.shippingAddress || {}).filter(Boolean).join(", ") || "Not provided"}</dd>
    </dl>
    <h3>Ordered items</h3>
    <div className="table-scroll order-items"><table aria-label="Ordered items">
      <thead><tr><th scope="col">Product</th><th scope="col">Qty</th><th scope="col">Unit price</th><th scope="col">Subtotal</th></tr></thead>
      <tbody>{order.lineItems.map((item, index) => <tr key={index}>
        <td>{item.name}{(item.size || item.color) && <small className="item-variant">{[item.size, item.color].filter(Boolean).join(" / ")}</small>}</td><td>{item.quantity}</td><td>{money(item.unitPrice, order.currency)}</td><td>{money(item.unitPrice * item.quantity, order.currency)}</td>
      </tr>)}</tbody>
    </table></div>
    {order.subtotal !== undefined && <dl>
      <dt>Subtotal</dt><dd>{money(order.subtotal, order.currency)}</dd>
      <dt>Discount</dt><dd>-{money(order.discount, order.currency)}</dd>
      {order.gst !== undefined && <><dt>{order.gstRate ? `GST (${Number((order.gstRate * 100).toFixed(2))}%)` : "GST"}</dt><dd>{money(order.gst, order.currency)}</dd></>}
      <dt>Delivery</dt><dd>{money(order.deliveryFee, order.currency)}</dd>
    </dl>}
    <div className="order-total"><span>Order total</span><strong>{money(order.amount, order.currency)}</strong></div>
    <form onSubmit={save}>
      <label>Status<select value={status} onChange={event => setStatus(event.target.value)}>
        {orderStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select></label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="primary" disabled={busy || status === order.apiStatus}>{busy ? "Saving..." : "Save status"}</button>
    </form>
  </>;
}
