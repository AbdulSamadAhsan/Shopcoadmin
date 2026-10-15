import React from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { orders, people } from "../../data/mockData";
import { money } from "../../utils/formatters";
export default function OrderTable({
  compact = false,
  filtered,
  pagination,
  setPagination,
  status,
  setStatus,
  navigate,
  setModal,
}) {
  const rows = compact
    ? filtered.slice(0, 5)
    : filtered.slice((pagination - 1) * 8, pagination * 8);
  return (
    <section className="card orders">
      <div className="card-head">
        <div>
          <h2>
            {compact ? "Recent orders" : "All orders"}{" "}
            <span className="count">
              {compact ? orders.length : filtered.length}
            </span>
          </h2>
          {compact && <p>A little overview of your latest activity</p>}
        </div>
        {compact ? (
          <button className="text-button" onClick={() => navigate("Orders")}>
            View all orders <ArrowRight size={15} />
          </button>
        ) : (
          <select
            aria-label="Filter order status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPagination(1);
            }}
          >
            {[
              "All orders",
              "Completed",
              "Processing",
              "Pending",
              "Cancelled",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th className="right">Total</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.id}
                onClick={() => setModal({ type: "order", order: o })}
              >
                <td className="order-id">#{o.id.slice(4)}</td>
                <td>
                  <div className="customer">
                    <span
                      className="avatar"
                      style={{
                        background: [
                          "#e9e3da",
                          "#e4e9df",
                          "#f2e1d5",
                          "#e6e3ef",
                        ][people.indexOf(o.name) % 4],
                      }}
                    >
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
                <td className="muted nowrap">{o.date}</td>
                <td>
                  <span className={`status ${o.status.toLowerCase()}`}>
                    <i />
                    {o.status}
                  </span>
                </td>
                <td className="right">{money(o.amount)}</td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={`View order ${o.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal({ type: "order", order: o });
                    }}
                  >
                    <ArrowUpRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="empty">No orders match your search.</div>
        )}
      </div>
      {!compact && (
        <div className="pagination">
          <span>
            {filtered.length} orders · Page {pagination} of{" "}
            {Math.max(1, Math.ceil(filtered.length / 8))}
          </span>
          <div>
            <button
              disabled={pagination === 1}
              onClick={() => setPagination((p) => p - 1)}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              disabled={pagination * 8 >= filtered.length}
              onClick={() => setPagination((p) => p + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
