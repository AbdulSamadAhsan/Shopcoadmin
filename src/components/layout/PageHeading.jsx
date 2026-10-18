import React from "react";
import { Settings, Download, Plus, Calendar } from "lucide-react";
export default function PageHeading({
  page,
  setModal,
  exportData,
  period,
  setPeriod,
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">YOUR STORE, AT A GLANCE</div>
        <h1>
          {page === "Overview" ? "Good morning, Samad" : page}
          <span className="heading-dot">.</span>
        </h1>
        <p>
          {
            {
              Overview:
                "Here\u2019s what\u2019s happening with your store today.",
              Orders: "Keep every order moving, from checkout to doorstep.",
              Products: "A home for everything you sell.",
              Coupons: "Create and manage discounts for your customers.",
              Customers: "Get to know the people behind your orders.",
              Analytics:
                "Turn your store\u2019s numbers into a clearer picture.",
              Settings: "Make this workspace feel like yours.",
            }[page]
          }
        </p>
      </div>
      <div className="heading-actions">
        {page === "Products" ? (
          <button
            className="primary"
            onClick={() => setModal({ type: "product" })}
          >
            <Plus size={17} />
            Add product
          </button>
        ) : (
          !["Settings", "Coupons"].includes(page) && (
            <>
              <button onClick={exportData}>
                <Download size={16} />
                Export
              </button>
              <label className="date-select">
                <Calendar size={16} />
                <select
                  aria-label="Date range"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  {["This month", "This week", "Last month"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
            </>
          )
        )}
      </div>
    </div>
  );
}
