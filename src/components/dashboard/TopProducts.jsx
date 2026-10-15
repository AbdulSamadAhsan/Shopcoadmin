import React from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import ProductArt from "../products/ProductArt";
import { money } from "../../utils/formatters";
export default function TopProducts({ products, navigate }) {
  return (
    <section className="card top-products">
      <div className="card-head">
        <div>
          <h2>Top products</h2>
          <p>Your customers’ current favorites</p>
        </div>
        <button
          className="icon-button"
          aria-label="View all products"
          onClick={() => navigate("Products")}
        >
          <ArrowUpRight size={18} />
        </button>
      </div>
      {products.slice(0, 4).map((p, i) => (
        <div className="top-product" key={p.id}>
          <span className="rank">0{i + 1}</span>
          <ProductArt type={p.icon} color={p.color} />
          <div className="product-name">
            <b>{p.name}</b>
            <small>{p.sold} units sold</small>
          </div>
          <strong>{money(p.price * p.sold)}</strong>
        </div>
      ))}
      <button className="view-products" onClick={() => navigate("Products")}>
        View all products <ArrowRight size={15} />
      </button>
    </section>
  );
}
