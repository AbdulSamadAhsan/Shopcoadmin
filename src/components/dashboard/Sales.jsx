import React from "react";
import { Package } from "lucide-react";
export default function Sales() {
  return (
    <section className="card sales">
      <div className="card-head">
        <div>
          <h2>Sales by category</h2>
          <p>Where your revenue comes from</p>
        </div>
        <Package size={18} />
      </div>
      <div className="donut">
        <div>
          <small>Total sales</small>
          <strong>$48,295</strong>
          <span className="positive">↗ 12.8%</span>
        </div>
      </div>
      <div className="category-list">
        {[
          ["Electronics", "42%", "$20,284", "#45694f"],
          ["Fashion", "28%", "$13,523", "#92a487"],
          ["Home & Living", "18%", "$8,693", "#c8d0b9"],
          ["Accessories", "12%", "$5,795", "#e8ebdf"],
        ].map(([name, share, total, color]) => (
          <div key={name}>
            <i style={{ background: color }} />
            <span>{name}</span>
            <b>{share}</b>
            <small>{total}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
