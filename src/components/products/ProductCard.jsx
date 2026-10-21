import React from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import ProductArt from "./ProductArt";
import { money } from "../../utils/formatters";
export default function ProductCard({ product, setModal }) {
  return (
    <article className="card product-card" key={product.id}>
      <div className="product-visual" style={{ background: product.color }}>
        {product.image ? <img className="product-image" src={product.image} alt={product.name} /> : <ProductArt type={product.icon} color={product.color} />}
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
        <p className={`product-visibility ${product.active === false ? "inactive" : "active"}`}>
          {product.active === false ? "Inactive · Hidden from shop" : "Active · Visible in shop"}
        </p>
        <h2>{product.name}</h2>
        <button className="product-review-trigger" onClick={() => setModal({ type: "reviews", product })} aria-label={`View ratings and reviews for ${product.name}`}><Star size={14} fill="currentColor" />{product.rating ?? 5}/5 · Ratings & reviews</button>
        <div>
          <strong>{money(product.price)}</strong>
          <span>{product.stock} in stock</span>
        </div>
        <p className="product-units-sold"><strong>{(product.sold || 0).toLocaleString()}</strong> units sold <small>Delivered orders · All time</small></p>
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
