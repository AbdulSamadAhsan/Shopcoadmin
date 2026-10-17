import React, { useEffect, useState } from "react";
import AccountSettings from "../components/auth/AccountSettings";
import { Check } from "lucide-react";
export default function SettingsPage({ settings, saveSettings, notify, admin, onAccountUpdated }) {
  const [name, setName] = useState(settings?.storeName || "");
  const [email, setEmail] = useState(settings?.contactEmail || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setName(settings?.storeName || ""); setEmail(settings?.contactEmail || ""); }, [settings]);
  async function save(event) {
    event.preventDefault();
    if (busy) return;
    if (!name.trim()) { setError("Enter a store name."); return; }
    setBusy(true); setError("");
    try { await saveSettings({ storeName: name.trim(), contactEmail: email.trim(), currency: "USD" }); notify("Store settings saved"); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  return <><section className="card settings">
    <h2>Store details</h2><p>Changes are saved to your store.</p>
    <form onSubmit={save}>
      <label>Store name<input required maxLength={35} value={name} onChange={event => setName(event.target.value)} /></label>
      <label>Contact email<input required type="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} /></label>
      <label>Currency<select value="USD" disabled><option value="USD">USD - US Dollar</option></select></label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="primary" disabled={busy || !settings}><Check size={16} />{busy ? "Saving..." : "Save changes"}</button>
    </form>
  </section><AccountSettings admin={admin} onUpdated={onAccountUpdated} /></>;
}
