import React from "react";
import { Search, X } from "lucide-react";
export default function SearchToolbar({
  page,
  query,
  setQuery,
  setPagination,
  count,
}) {
  return (
    <div className="toolbar">
      <label className="search">
        <Search size={18} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPagination(1);
          }}
          placeholder={`Search ${page.toLowerCase()}\u2026`}
        />
        {query && (
          <button
            className="icon-button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <X size={15} />
          </button>
        )}
      </label>
      <span className="muted">
        {count} {page.toLowerCase()}
      </span>
    </div>
  );
}
