import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ChartNoAxesCombined,
  Settings,
  ChevronDown,
  ArrowUpRight,
  X,
  LogOut,
  HelpCircle,
  Store,
} from "lucide-react";
export default function Sidebar({
  mobile,
  setMobile,
  page,
  navigate,
  savedName,
  setModal,
  onLogout,
}) {
  const nav = [
    ["Overview", LayoutDashboard],
    ["Orders", ShoppingBag],
    ["Products", Package],
    ["Customers", Users],
    ["Analytics", ChartNoAxesCombined],
  ];
  return (
    <aside className={mobile ? "sidebar open" : "sidebar"}>
      <a
        className="brand"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate("Overview");
        }}
      >
        <span className="brand-icon">
          <ShoppingBag size={22} />
        </span>
        commerce<span className="brand-dot">.</span>
        <button
          className="mobile-close icon-button"
          aria-label="Close menu"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMobile(false);
          }}
        >
          <X size={18} />
        </button>
      </a>
      <button className="store-switch" onClick={() => navigate("Settings")}>
        <span className="store-icon">
          <Store size={19} />
        </span>
        <span>
          <b>{savedName}</b>
          <small>Store workspace</small>
        </span>
        <ChevronDown size={15} />
      </button>
      <div className="nav-label">WORKSPACE</div>
      <nav>
        {nav.map(([name, Icon]) => (
          <button
            key={name}
            className={page === name ? "selected" : ""}
            onClick={() => navigate(name)}
          >
            <Icon size={19} />
            {name}
            {name === "Orders" && <span className="nav-count">12</span>}
            {page === name && <span className="nav-dot" />}
          </button>
        ))}
      </nav>
      <div className="nav-label tools-label">PREFERENCES</div>
      <nav>
        <button
          className={page === "Settings" ? "selected" : ""}
          onClick={() => navigate("Settings")}
        >
          <Settings size={19} />
          Settings
        </button>
        <button onClick={() => setModal({ type: "help" })}>
          <HelpCircle size={19} />
          Help & resources
          <ArrowUpRight size={14} className="push-right" />
        </button>
      </nav>
      <div className="sidebar-bottom">
        <button className="logout-button" onClick={onLogout}>
          <LogOut size={18} />
          Log out
        </button>
        <div className="demo-note">
          <span className="live-dot" /> Your workspace, at a glance
          <p>All the good things happening in your store, in one place.</p>
          <span className="demo-label">DEMO WORKSPACE</span>
        </div>
        <button className="profile" onClick={() => navigate("Settings")}>
          <span className="avatar profile-avatar">SA</span>
          <span>
            <b>Samad Ahsan</b>
            <small>Store administrator</small>
          </span>
          <Settings size={17} />
        </button>
      </div>
    </aside>
  );
}
