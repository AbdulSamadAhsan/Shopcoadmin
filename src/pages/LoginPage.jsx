import React from "react";
import { ShoppingBag, Sparkles } from "lucide-react";
import LoginBrandPanel from "../components/auth/LoginBrandPanel";
import LoginForm from "../components/auth/LoginForm";
import "../styles/login.css";

export default function LoginPage({ onLogin }) {
  return (
    <div className="login-page">
      <LoginBrandPanel />
      <div className="login-main">
        <div className="login-topline">
          <span>COMMERCE STUDIO</span>
          <span className="login-demo-badge">
            <i /> Demo sign-in
          </span>
        </div>
        <main className="login-content">
          <div className="login-form-heading">
            <span className="login-symbol">
              <ShoppingBag size={27} />
            </span>
            <span className="login-kicker">LET’S GET YOU SETTLED IN</span>
            <h1>
              Welcome back<span>.</span>
            </h1>
            <p>
              A fresh look at your business is waiting.
              <br />
              Sign in to your store workspace.
            </p>
          </div>
          <div className="login-demo-note" id="login-demo-note">
            <Sparkles size={19} aria-hidden="true" />
            <p>
              <strong>Take a look around.</strong> Use any valid email and a
              made-up password of 6+ characters. Credentials are not checked or
              saved. Please do not use a real password.
            </p>
          </div>
          <LoginForm onLogin={onLogin} />
        </main>
        <div className="login-bottomline">
          <span>© 2026 Commerce Studio</span>
          <span>Made for better business.</span>
        </div>
      </div>
    </div>
  );
}
