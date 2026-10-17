import React, { useState } from "react";
import { Check } from "lucide-react";

export default function ProductForm({ modal, setModal, saveProduct, notify }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const name = data.get("name").trim();
    if (!name) { setError("Enter a product name."); return; }
    data.set("name", name);
    const file = data.get("image");
    if (file?.size > 3 * 1024 * 1024) { setError("Choose an image smaller than 3 MB."); return; }
    if (!file?.size) data.delete("image");
    setBusy(true);
    setError("");
    try {
      await saveProduct(modal.product?.id, data);
      setModal(null);
      notify(modal.product ? "Product updated" : "Product added to your catalog");
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  const categories = [...new Set([modal.product?.category, "Electronics", "Fashion", "Home & Living", "Accessories"].filter(Boolean))];
  return (
    <>
      <h2 id="modal-title">{modal.product ? "Edit product" : "Add a new product"}</h2>
      <p>Changes are saved to your catalog.</p>
      <form onSubmit={handleSubmit}>
        <label>Product name<input name="name" required maxLength={200} defaultValue={modal.product?.name} /></label>
        <label>Category<select name="category" defaultValue={modal.product ? modal.product.category || "" : "Electronics"}>
          <option value="">Uncategorized</option>
          {categories.map(category => <option key={category}>{category}</option>)}
        </select></label>
        <div className="form-row">
          <label>Price (USD)<input name="price" type="number" required min="0" step="0.01" defaultValue={modal.product?.price} /></label>
          <label>Stock<input name="stock" type="number" required min="0" step="1" defaultValue={modal.product?.stock || 0} /></label>
        </div>
        {modal.product?.image && <img className="product-preview" src={modal.product.image} alt={modal.product.name} />}
        <label>{modal.product ? "Replace image (optional)" : "Product image"}<input name="image" type="file" accept="image/png,image/jpeg,image/webp" required={!modal.product} /></label>
        <small>JPEG, PNG, or WebP. Maximum 3 MB.</small>
        {error && <p role="alert" className="form-error">{error}</p>}
        <button className="primary" type="submit" disabled={busy}><Check size={16} />{busy ? "Saving..." : "Save product"}</button>
      </form>
    </>
  );
}
