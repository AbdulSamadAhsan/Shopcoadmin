import React from "react";
import { Package } from "lucide-react";
import { money } from "../../utils/formatters";
export default function Sales({ analytics }) {
  const colors = ["#45694f", "#92a487", "#c8d0b9", "#e8ebdf", "#b1bca1"];
  const total = analytics.categories.reduce((sum, category) => sum + category.amount, 0);
  let offset = 0;
  const segments = analytics.categories.map((category, index) => {
    const start = offset; offset += total ? category.amount / total * 100 : 0;
    return `${colors[index % colors.length]} ${start}% ${offset}%`;
  });
  return <section className="card sales">
    <div className="card-head"><div><h2>Sales by category</h2><p>Paid or completed item sales in USD</p></div><Package size={18} /></div>
    <div className="donut" style={{ background: total ? `conic-gradient(${segments.join(",")})` : "#e8ebdf" }}><div><small>Total item sales</small><strong>{money(total)}</strong></div></div>
    <div className="category-list">{analytics.categories.map((category, index) => <div key={category.name}><i style={{ background: colors[index % colors.length] }} /><span>{category.name}</span><b>{total ? Math.round(category.amount / total * 100) : 0}%</b><small>{money(category.amount)}</small></div>)}{!total && <p className="empty">No sales in this period.</p>}</div>
  </section>;
}
