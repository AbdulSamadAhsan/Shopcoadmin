import React from "react";
import {
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  MousePointer2,
} from "lucide-react";
import Spark from "./Spark";
import { money } from "../../utils/formatters";
export default function Stats({ period }) {
  const factor =
    period === "Last month" ? 0.88 : period === "This week" ? 0.24 : 1;
  return (
    <div className="stats">
      {[
        ["Total revenue", money(48295.8 * factor), 12.8, Wallet],
        [
          "Total orders",
          Math.round(1248 * factor).toLocaleString(),
          8.2,
          ShoppingBag,
        ],
        [
          "Total customers",
          Math.round(842 * factor).toLocaleString(),
          6.4,
          Users,
        ],
        ["Conversion rate", "3.62%", -0.4, MousePointer2],
      ].map(([label, value, gain, Icon]) => (
        <article className="stat" key={label}>
          <div className="stat-top">
            <span>{label}</span>
            <Icon size={17} />
          </div>
          <div className="stat-value">{value}</div>
          <div className="stat-bottom">
            <div>
              <span className={gain < 0 ? "negative" : "positive"}>
                {gain < 0 ? (
                  <ArrowDownRight size={13} />
                ) : (
                  <ArrowUpRight size={13} />
                )}{" "}
                {Math.abs(gain)}%
              </span>
              <small>vs. previous period</small>
            </div>
            <Spark down={gain < 0} />
          </div>
        </article>
      ))}
    </div>
  );
}
