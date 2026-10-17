import React from "react";
import { Search } from "lucide-react";
export default function HelpDialog({ modal, setModal, setProducts, notify }) {
  return (
    <>
      <h2 id="modal-title">Welcome to Commerce Studio</h2>
      <p>Manage your store catalog, orders, and customers.</p>
      <ul>
        <li>Explore sales and revenue in Overview.</li>
        <li>Search orders and click one to see its details.</li>
        <li>Add, edit, and delete products in your catalog.</li>
        <li>Export orders or products as a CSV file.</li>
      </ul>
      <p className="modal-note">
        Products, order statuses, and store settings are saved through the API. Customer profiles are based on order history. Revenue includes paid or completed orders; traffic analytics are not connected.
      </p>
    </>
  );
}
