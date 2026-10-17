import React from "react";
import { money } from "../../utils/formatters";
import { formatDate } from "../../services/api";
export default function CustomerDetails({ modal }) {
  const customer = modal.customer;
  return <>
    <h2 id="modal-title">{customer.name}</h2><p>{customer.email}</p>
    <dl>
      <dt>Customer type</dt><dd>{customer.orders > 1 ? "Returning customer" : "New customer"}</dd>
      <dt>Orders</dt><dd>{customer.orders}</dd>
      <dt>Total spent</dt><dd>{Object.entries(customer.totalsByCurrency).map(([currency, total]) => money(total, currency)).join(" / ") || money(0)}</dd>
      <dt>First order</dt><dd>{formatDate(customer.memberSince)}</dd>
      <dt>Latest order</dt><dd>{customer.latestOrder.orderNumber || customer.latestOrder._id}</dd>
    </dl>
  </>;
}
