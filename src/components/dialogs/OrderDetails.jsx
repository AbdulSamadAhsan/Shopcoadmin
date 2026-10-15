import React from "react";
import { money } from "../../utils/formatters";
export default function OrderDetails({ modal, setModal, setProducts, notify }) {
  return (
    <>
      <span className="eyebrow">ORDER DETAILS</span>
      <h2 id="modal-title">#{modal.order.id}</h2>
      <span className={`status ${modal.order.status.toLowerCase()}`}>
        <i />
        {modal.order.status}
      </span>
      <dl>
        <dt>Customer</dt>
        <dd>{modal.order.name}</dd>
        <dt>Email</dt>
        <dd>{modal.order.email}</dd>
        <dt>Date</dt>
        <dd>{modal.order.date}</dd>
        <dt>Product</dt>
        <dd>{modal.order.product}</dd>
        <dt>Quantity</dt>
        <dd>{modal.order.items}</dd>
        <dt>Total</dt>
        <dd>
          <b>{money(modal.order.amount)}</b>
        </dd>
      </dl>
      <p className="modal-note">
        This is a sample order. No payment or shipping action will be performed.
      </p>
    </>
  );
}
