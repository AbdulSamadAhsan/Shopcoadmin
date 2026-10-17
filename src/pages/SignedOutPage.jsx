import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
export default function SignedOutPage({ onReturn }) {
  return (
    <div className="signed-out">
      <section className="card signed-out-card">
        <span className="brand-icon">
          <ShoppingBag size={24} />
        </span>
        <span className="eyebrow">COMMERCE STUDIO</span>
        <h1>You’re signed out.</h1>
        <p>
          You’ve left the demo dashboard. No real account or authentication
          service is connected.
        </p>
        <button className="primary" onClick={onReturn}>
          Return to demo <ArrowRight size={17} />
        </button>
      </section>
    </div>
  );
}
