import React, { useEffect, useState } from "react";
import AccountSettings from "../components/auth/AccountSettings";
import { Check } from "lucide-react";
export default function SettingsPage({ settings, saveSettings, notify, admin, onAccountUpdated }) {
  const [name, setName] = useState(settings?.storeName || "");
  const [email, setEmail] = useState(settings?.contactEmail || "");
  const [currency, setCurrency] = useState(settings?.currency || 'USD');
  const [rate, setRate] = useState(settings?.exchangeRate ?? 1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setName(settings?.storeName || ""); setEmail(settings?.contactEmail || ""); setCurrency(settings?.currency || 'USD'); setRate(settings?.exchangeRate ?? 1); }, [settings]);
  async function save(event) {
    event.preventDefault();
    if (busy) return;
    if (!name.trim()) { setError("Enter a store name."); return; }
    if (!Number.isFinite(Number(rate)) || Number(rate) < 0.000001 || Number(rate) > 1000000) { setError('Enter a positive exchange rate.'); return; }
    setBusy(true); setError("");
    try { await saveSettings({ storeName: name.trim(), contactEmail: email.trim(), currency, exchangeRate: currency === 'USD' ? 1 : Number(rate) }); notify("Store settings saved"); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  return <><section className="card settings">
    <h2>Store details</h2><p>Changes are saved to your store.</p>
    <form onSubmit={save}>
      <label>Store name<input required maxLength={35} value={name} onChange={event => setName(event.target.value)} /></label>
      <label>Contact email<input required type="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} /></label>
      <label>Website currency<select value={currency} disabled={busy} onChange={event => { setCurrency(event.target.value); setRate(event.target.value === 'USD' ? 1 : ''); }}>
        {Object.entries({ USD: 'US Dollar', PKR: 'Pakistani Rupee' }).map(([code, label]) => <option key={code} value={code}>{code} - {label}</option>)}
      </select></label>
      <label>Exchange rate: 1 USD =<input required type="number" min="0.000001" max="1000000" step="0.000001" disabled={busy || currency === 'USD'} value={rate} onChange={event => setRate(event.target.value)} /><span>{currency}</span></label>
      <p>Product and coupon amounts are entered in USD. Website prices, delivery, tax and new orders convert using this rate. Update it manually when needed; existing orders keep their original currency.</p>
      {rate !== '' && Number(rate) > 0 && <p>Example: USD 80.00 → {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(80 * Number(rate))}</p>}
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="primary" disabled={busy || !settings}><Check size={16} />{busy ? "Saving..." : "Save changes"}</button>
    </form>
  </section><AccountSettings admin={admin} onUpdated={onAccountUpdated} /></>;
}
