import React, { useState } from "react";
import { api } from "../../services/api";

export default function AccountSettings({ admin, onUpdated }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = values.get("email").trim();
    const password = values.get("newPassword");
    if (password !== values.get("confirmPassword")) { setError("New passwords do not match."); return; }
    if (email === admin.email && !password) { setError("Change your email or enter a new password."); return; }
    const data = { currentPassword: values.get("currentPassword") };
    if (email !== admin.email) data.email = email;
    if (password) data.newPassword = password;
    setBusy(true); setError("");
    try { await api.updateAccount(data); form.reset(); onUpdated(); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  return <section className="card settings account-settings">
    <h2>Admin account</h2>
    <p>Update your sign-in details. Confirm your current password to save. You will need to sign in again on all devices.</p>
    <form onSubmit={save}>
      <label>Admin email<input name="email" type="email" autoComplete="username" required maxLength={254} defaultValue={admin.email} /></label>
      <label>Current password<input name="currentPassword" type="password" autoComplete="current-password" required /></label>
      <label>New password<input name="newPassword" type="password" autoComplete="new-password" minLength={15} aria-describedby="new-password-help" /></label>
      <small id="new-password-help">Leave blank to keep your password. Use a memorable passphrase of at least 15 characters.</small>
      <label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={15} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary" disabled={busy} type="submit">{busy ? "Updating account..." : "Update account"}</button>
    </form>
  </section>;
}
