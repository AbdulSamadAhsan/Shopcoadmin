import React from "react";
export default function TrafficSources() {
  return (
    <div className="card traffic">
      <h2>Traffic sources</h2>
      {[
        ["Direct", 42],
        ["Organic search", 31],
        ["Social media", 18],
        ["Referral", 9],
      ].map(([name, value]) => (
        <div className="traffic-row" key={name}>
          <span>{name}</span>
          <div>
            <i style={{ width: value * 2 + "%" }} />
          </div>
          <b>{value}%</b>
        </div>
      ))}
    </div>
  );
}
