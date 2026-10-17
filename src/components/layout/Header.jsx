import React from "react";
import { Bell, X, Menu, ChevronRight } from "lucide-react";
export default function Header({
  page,
  admin,
  setMobile,
  notifications,
  setNotifications,
  orders,
  products,
}) {
  return (
    <header>
      <div className="breadcrumb">
        <button
          className="icon-button mobile-toggle"
          aria-label="Open menu"
          onClick={() => setMobile(true)}
        >
          <Menu size={21} />
        </button>
        <span>Workspace</span>
        <ChevronRight size={14} />
        <b>{page}</b>
      </div>
      <div className="header-actions">
        <span className="demo-chip">
          <i /> Store data
        </span>
        <button
          className="icon-button notification-trigger"
          aria-label="Notifications"
          onClick={() => setNotifications(!notifications)}
        >
          <Bell size={19} />
          <i />
        </button>
        <div className="header-avatar">{admin.name.split(" ").map(part => part[0]).join("").slice(0, 2)}</div>
      </div>
      {notifications && (
        <div className="notification-panel">
          <h3>
            Notifications{" "}
            <button
              className="icon-button"
              aria-label="Close notifications"
              onClick={() => setNotifications(false)}
            >
              <X size={16} />
            </button>
          </h3>
          {orders[0] && <p><b>Latest order</b><small>{orders[0].name} placed #{orders[0].orderNumber}</small></p>}
          {products.filter(product => product.stock < 10).map(product => <p key={product.id}><b>Low stock alert</b><small>{product.name} has {product.stock} units left.</small></p>)}
          {!orders.length && !products.some(product => product.stock < 10) && <p>No notifications.</p>}
        </div>
      )}
    </header>
  );
}
