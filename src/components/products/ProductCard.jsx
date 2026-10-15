import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import ProductArt from "./ProductArt";
import { money } from "../../utils/formatters";
export default function ProductCard({ product, setModal }) {
  return (
    <article className="card product-card" key={product.id}>
      <div className="product-visual" style={{ background: product.color }}>
        <ProductArt type={product.icon} color={product.color} />
        <span className={`stock-tag ${product.stock < 10 ? "low" : ""}`}>
          {product.stock === 0
            ? "Out of stock"
            : product.stock < 10
              ? "Low stock"
              : "In stock"}
        </span>
      </div>
      <div className="product-info">
        <small>{product.category}</small>
        <h2>{product.name}</h2>
        <div>
          <strong>{money(product.price)}</strong>
          <span>{product.stock} in stock</span>
        </div>
        <div className="product-buttons">
          <button onClick={() => setModal({ type: "product", product })}>
            <Pencil size={14} />
            Edit product
          </button>
          <button
            aria-label={`Delete ${product.name}`}
            onClick={() => setModal({ type: "delete", product })}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
