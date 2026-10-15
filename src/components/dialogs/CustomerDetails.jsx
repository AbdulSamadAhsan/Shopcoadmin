import React from "react";
import { money } from "../../utils/formatters";
export default function CustomerDetails({
  modal,
  setModal,
  setProducts,
  notify,
}) {
  return (
    <>
      <h2 id="modal-title">{modal.order.name}</h2>
      <p>{modal.order.email}</p>
      <dl>
        <dt>Customer type</dt>
        <dd>Returning customer</dd>
        <dt>Latest order</dt>
        <dd>{modal.order.id}</dd>
        <dt>Order total</dt>
        <dd>{money(modal.order.amount)}</dd>
      </dl>
    </>
  );
}
