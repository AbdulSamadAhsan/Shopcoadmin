import React from "react";
import { Check, Store } from "lucide-react";
export default function SettingsPage({
  storeName,
  setStoreName,
  setSavedName,
  notify,
}) {
  return (
    <section className="card settings">
      <h2>Store details</h2>
      <p>Changes apply to this demo session only.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSavedName(storeName);
          notify("Store settings saved for this session");
        }}
      >
        <label>
          Store name
          <input
            required
            maxLength={35}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </label>
        <label>
          Contact email
          <input
            required
            type="email"
            defaultValue="hello@studiostore.example"
          />
        </label>
        <label>
          Currency
          <select>
            <option>USD — US Dollar</option>
          </select>
        </label>
        <button className="primary" type="submit">
          <Check size={16} />
          Save changes
        </button>
      </form>
    </section>
  );
}
