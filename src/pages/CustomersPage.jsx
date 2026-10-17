import React from "react";
import { ArrowRight } from "lucide-react";
import { money } from "../utils/formatters";
import { formatDate } from "../services/api";
export default function CustomersPage({ query, setModal, customers }) {
  const matching = customers.filter(customer => `${customer.name} ${customer.email}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="card"><div className="table-scroll"><table>
    <thead><tr><th>Customer</th><th>Orders</th><th>Total spent</th><th>First order</th><th /></tr></thead>
    <tbody>{matching.map(customer => <tr key={customer.id}>
      <td><div className="customer"><span className="avatar">{customer.name.split(" ").map(part => part[0]).join("")}</span><div>{customer.name}<small>{customer.email}</small></div></div></td>
      <td>{customer.orders}</td>
      <td>{Object.entries(customer.totalsByCurrency).map(([currency, total]) => money(total, currency)).join(" / ") || money(0)}</td>
      <td className="muted">{formatDate(customer.memberSince)}</td>
      <td><button className="text-button" onClick={() => setModal({ type: "customer", customer })}>View profile <ArrowRight size={14} /></button></td>
    </tr>)}</tbody>
  </table>{!matching.length && <div className="empty">No customers found.</div>}</div></section>;
}
