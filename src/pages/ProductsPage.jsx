import React from "react";
import ProductCard from "../components/products/ProductCard";
export default function ProductsPage({ products, query, setModal }) {
  const matchingProducts = products.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="product-grid">
      {matchingProducts.map((product) => (
        <ProductCard key={product.id} product={product} setModal={setModal} />
      ))}
      {matchingProducts.length === 0 && (
        <div className="empty">No products found.</div>
      )}
    </div>
  );
}
