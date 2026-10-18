import React from "react";
import { money } from "../../utils/formatters";
export default function Revenue({ chart, setChart, period, analytics }) {
  const revenue = chart === "Revenue";
  const values = analytics.daily.map(day => revenue ? day.revenue : day.orders);
  const previous = analytics.daily.map(day => revenue ? day.previousRevenue : day.previousOrders);
  const max = Math.max(1, ...values, ...previous);
  return <section className="card revenue">
    <div className="card-head"><div><h2>Revenue overview</h2><p>{revenue ? "Delivered orders in USD" : "Orders received in the selected period"}</p></div><div className="segmented">{["Revenue", "Orders"].map(tab => <button key={tab} className={chart === tab ? "active" : ""} onClick={() => setChart(tab)}>{tab}</button>)}</div></div>
    <div className="chart-summary"><strong>{revenue ? money(analytics.revenue) : analytics.orderCount.toLocaleString()}</strong><div className="legend"><i />{period}<i className="pale" />Previous period</div></div>
    <div className="chart"><div className="axis">{[1, .75, .5, .25, 0].map(factor => <span key={factor}>{revenue ? money(max * factor) : Math.round(max * factor)}</span>)}</div>
      <div className="plot"><div className="gridlines">{[0, 1, 2, 3, 4].map(value => <div key={value} />)}</div>
        <div className="bars">{analytics.daily.map((day, index) => <div className="bar-pair" key={index} title={`${day.date.toLocaleDateString()}: ${revenue ? money(values[index]) : values[index]}`}><div className="bar previous" style={{ height: `${previous[index] / max * 100}%` }} /><div className="bar current" style={{ height: `${values[index] / max * 100}%` }} /></div>)}</div>
        <div className="x-axis">{analytics.daily.filter((day, index, days) => index % Math.ceil(days.length / 6) === 0).map(day => <span key={day.date.toISOString()}>{day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>)}</div>
      </div>
    </div>
    {analytics.excludesOtherCurrencies && <p className="muted">Revenue charts show USD orders only.</p>}
  </section>;
}
