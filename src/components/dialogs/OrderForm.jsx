import React from "react";

const statuses = ["Completed", "Processing", "Pending", "Cancelled"];

export default function OrderForm({ modal, setModal, onSaveOrder, notify }) {
  const order = modal.order;

  function handleSubmit(event) {
    event.preventDefault();
    const status = new FormData(event.currentTarget).get("status");
    if (!statuses.includes(status)) return;
    const updated = { ...order, status };
    onSaveOrder(updated);
    setModal({ type: "order", order: updated });
    notify("Order status updated");
  }

  return (
    <>
      <span className="eyebrow">ORDER #{order.id.slice(4)}</span>
      <h2 id="modal-title">Update order status</h2>
      <p>Select the current status for this order.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Status
          <select name="status" defaultValue={order.status}>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <div className="order-form-actions">
          <button type="button" onClick={() => setModal({ type: "order", order })}>Cancel</button>
          <button className="primary" type="submit">Save status</button>
        </div>
      </form>
    </>
  );
}
