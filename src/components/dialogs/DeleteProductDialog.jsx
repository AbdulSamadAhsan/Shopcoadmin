import React, { useState } from "react";
export default function DeleteProductDialog({ modal, setModal, deleteProduct, notify }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await deleteProduct(modal.product.id);
      setModal(null);
      notify("Product removed");
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  return <>
    <h2 id="modal-title">Delete product?</h2>
    <p>Remove {modal.product.name} from your catalog?</p>
    {error && <p role="alert" className="form-error">{error}</p>}
    <div className="heading-actions">
      <button disabled={busy} onClick={() => setModal(null)}>Cancel</button>
      <button className="danger" disabled={busy} onClick={remove}>{busy ? "Deleting..." : "Delete product"}</button>
    </div>
  </>;
}
