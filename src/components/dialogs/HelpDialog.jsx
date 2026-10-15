import React from "react";
import { Search } from "lucide-react";
export default function HelpDialog({ modal, setModal, setProducts, notify }) {
  return (
    <>
      <h2 id="modal-title">Welcome to Commerce Studio</h2>
      <p>A React JavaScript dashboard built entirely with dummy data.</p>
      <ul>
        <li>Explore sales and revenue in Overview.</li>
        <li>Search orders and click one to see its details.</li>
        <li>Add, edit, and delete products in your catalog.</li>
        <li>Export orders or products as a CSV file.</li>
      </ul>
      <p className="modal-note">
        This demo uses React state only. Refreshing resets all changes. No API
        integrations or real transactions.
      </p>
    </>
  );
}
