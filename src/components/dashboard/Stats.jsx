import React from "react";
import { ShoppingBag, Users, ArrowUpRight, ArrowDownRight, Wallet, Package } from "lucide-react";
import { money } from "../../utils/formatters";
export default function Stats({ analytics }) {
  return <div className="stats">{[
    ["Total revenue (USD)", money(analytics.revenue), analytics.revenueGrowth, Wallet],
    ["Total orders", analytics.orderCount.toLocaleString(), analytics.orderGrowth, ShoppingBag],
    ["Ordering customers", analytics.customers.toLocaleString(), analytics.customerGrowth, Users],
    ["Average order (USD)", money(analytics.revenueOrderCount ? analytics.revenue / analytics.revenueOrderCount : 0), null, Package],
  ].map(([label, value, gain, Icon]) => <article className="stat" key={label}>
    <div className="stat-top"><span>{label}</span><Icon size={17} /></div>
    <div className="stat-value">{value}</div>
    <div className="stat-bottom"><div>{gain === null ? <small>No comparison available</small> : <><span className={gain < 0 ? "negative" : "positive"}>{gain < 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{Math.abs(gain).toFixed(1)}%</span><small>vs. previous period</small></>}</div></div>
  </article>)}</div>;
}
