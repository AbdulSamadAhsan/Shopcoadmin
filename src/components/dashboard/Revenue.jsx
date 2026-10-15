import React from "react";
import { money } from "../../utils/formatters";
export default function Revenue({ chart, setChart, period }) {
  const heights =
    chart === "Revenue"
      ? [
          33, 47, 38, 59, 44, 65, 52, 48, 72, 61, 53, 83, 71, 60, 78, 68, 88,
          77, 63, 85, 72, 92, 78, 66, 82, 73, 95, 85,
        ]
      : [
          29, 40, 28, 51, 38, 52, 41, 67, 51, 76, 52, 67, 80, 64, 56, 74, 61,
          85, 68, 75, 89, 76, 64, 79, 85, 74, 90, 81,
        ];
  return (
    <section className="card revenue">
      <div className="card-head">
        <div>
          <h2>Revenue overview</h2>
          <p>Your store’s performance over time</p>
        </div>
        <div className="segmented">
          {["Revenue", "Orders"].map((t) => (
            <button
              key={t}
              className={chart === t ? "active" : ""}
              onClick={() => setChart(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-summary">
        <strong>
          {chart === "Revenue"
            ? money(
                period === "This week"
                  ? 11590.99
                  : period === "Last month"
                    ? 42500.3
                    : 48295.8,
              )
            : period === "This week"
              ? "300"
              : period === "Last month"
                ? "1,098"
                : "1,248"}
        </strong>
        <span className="badge positive">↗ 12.8%</span>
        <div className="legend">
          <i /> {period}
          <i className="pale" /> Previous period
        </div>
      </div>
      <div className="chart">
        <div className="axis">
          {(chart === "Revenue"
            ? ["$12k", "$9k", "$6k", "$3k", "$0"]
            : ["400", "300", "200", "100", "0"]
          ).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="plot">
          <div className="gridlines">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} />
            ))}
          </div>
          <div className="bars">
            {heights.map((h, i) => (
              <div
                className="bar-pair"
                key={i}
                title={`${period}, day ${i + 1}: ${chart === "Revenue" ? money(h * 23) : h} (dummy data)`}
              >
                <div
                  className="bar previous"
                  style={{ height: `${h * 0.69}%` }}
                />
                <div className="bar current" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          <div className="x-axis">
            {["01", "05", "10", "15", "20", "25", "30"].map((x) => (
              <span key={x}>
                {x} {period === "Last month" ? "Sep" : "Oct"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
