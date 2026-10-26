import React from "react";

const labels = { active: "Active", deleted: "Deleted", historical: "Historical" };

export default function CustomerAccountStatus({ status }) {
  const known = Object.hasOwn(labels, status);
  return <span className={`customer-account-status ${known ? status : "unknown"}`}>
    {known ? labels[status] : "Unknown"}
  </span>;
}
