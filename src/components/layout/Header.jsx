import React from "react";
import { Bell, X, Menu, ChevronRight } from "lucide-react";
export default function Header({
  page,
  setMobile,
  notifications,
  setNotifications,
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
          <i /> Demo data
        </span>
        <button
          className="icon-button notification-trigger"
          aria-label="Notifications"
          onClick={() => setNotifications(!notifications)}
        >
          <Bell size={19} />
          <i />
        </button>
        <div className="header-avatar">SA</div>
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
          <p>
            <b>New order received</b>
            <small>Olivia placed order #1048 · 5 minutes ago</small>
          </p>
          <p>
            <b>Low stock alert</b>
            <small>Minimal Desk Lamp has 8 units left.</small>
          </p>
          <span className="muted">Sample notifications</span>
        </div>
      )}
    </header>
  );
}
