import React from "react";
import { ArrowRight } from "lucide-react";
import { orders } from "../data/mockData";
import { money } from "../utils/formatters";
export default function CustomersPage({ query, setModal }) {
  return (
    <section className="card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Orders</th>
              <th>Total spent</th>
              <th>Member since</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((o) =>
                `${o.name} ${o.email}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((o, i) => (
                <tr key={o.id}>
                  <td>
                    <div className="customer">
                      <span className="avatar">
                        {o.name
                          .split(" ")
                          .map((x) => x[0])
                          .join("")}
                      </span>
                      <div>
                        {o.name}
                        <small>{o.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>{i + 1}</td>
                  <td>{money(o.amount * (i + 1))}</td>
                  <td className="muted">Sep {i + 1}, 2026</td>
                  <td>
                    <button
                      className="text-button"
                      onClick={() => setModal({ type: "customer", order: o })}
                    >
                      View profile <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!orders.some((o) =>
          `${o.name} ${o.email}`.toLowerCase().includes(query.toLowerCase()),
        ) && <div className="empty">No customers found.</div>}
      </div>
    </section>
  );
}
