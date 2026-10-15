import React from "react";
import { ArrowUpRight, ShoppingBag, Check } from "lucide-react";

const chartHeights = [27, 39, 34, 52, 43, 65, 54, 73, 67, 88, 76, 98];

export default function LoginBrandPanel() {
  return (
    <aside
      className="login-brand-panel"
      aria-label="Commerce Studio introduction"
    >
      <div className="login-wordmark">
        <ShoppingBag size={25} /> commerce<span>.</span>
      </div>
      <div className="login-brand-copy">
        <span className="login-kicker">
          A LITTLE CLARITY. A LOT OF POSSIBILITY.
        </span>
        <h2>
          Your store.
          <br />
          Your next
          <br />
          <em>big chapter.</em>
        </h2>
        <p>
          Bring your orders, products, and customers together. Make room for
          what comes next.
        </p>
      </div>
      <div className="login-preview" aria-label="Sample revenue preview">
        <div className="login-preview-heading">
          <span>Revenue overview</span>
          <span className="login-sample">Sample data</span>
        </div>
        <div className="login-preview-total">
          $48,295
          <span>
            <ArrowUpRight size={15} />
            12.8%
          </span>
        </div>
        <div className="login-preview-bars" aria-hidden="true">
          {chartHeights.map((height, index) => (
            <i key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="login-preview-footer">
          <span>Good things are growing.</span>
          <Check size={16} />
        </div>
      </div>
      <p className="login-brand-footer">
        Less busywork. More bigger-picture thinking.
      </p>
    </aside>
  );
}
