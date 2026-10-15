import React from "react";
import { Check } from "lucide-react";
export default function ProductForm({ modal, setModal, setProducts, notify }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const product = {
      ...modal.product,
      id: modal.product?.id || Date.now(),
      name: formData.get("name").trim(),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      sold: modal.product?.sold || 0,
      icon: modal.product?.icon || "bag",
      color: modal.product?.color || "#e0e7db",
    };
    if (!product.name) return;
    setProducts((old) =>
      modal.product
        ? old.map((v) => (v.id === product.id ? product : v))
        : [...old, product],
    );
    setModal(null);
    notify(modal.product ? "Product updated" : "Product added to your catalog");
  }
  return (
    <>
      <h2 id="modal-title">
        {modal.product ? "Edit product" : "Add a new product"}
      </h2>
      <p>Keep your catalog looking its best.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Product name
          <input
            name="name"
            required
            maxLength={70}
            defaultValue={modal.product?.name}
          />
        </label>
        <label>
          Category
          <select
            name="category"
            defaultValue={modal.product?.category || "Electronics"}
          >
            {["Electronics", "Fashion", "Home & Living", "Accessories"].map(
              (c) => (
                <option key={c}>{c}</option>
              ),
            )}
          </select>
        </label>
        <div className="form-row">
          <label>
            Price (USD)
            <input
              name="price"
              type="number"
              required
              min="0"
              step="0.01"
              defaultValue={modal.product?.price}
            />
          </label>
          <label>
            Stock
            <input
              name="stock"
              type="number"
              required
              min="0"
              step="1"
              defaultValue={modal.product?.stock || 0}
            />
          </label>
        </div>
        <button className="primary" type="submit">
          <Check size={16} />
          Save product
        </button>
      </form>
    </>
  );
}
