import React, { useRef, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { validateLogin } from "../../utils/validateLogin";

export default function LoginForm({ onLogin }) {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    setServerError("");
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      (nextErrors.email ? emailRef : passwordRef).current?.focus();
      return;
    }

    setBusy(true);
    try { await onLogin(values.email.trim(), values.password); }
    catch (error) { setServerError(error.message); }
    finally { setBusy(false); }

  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-field">
        <label htmlFor="login-email">Email address</label>
        <div className={`login-input-wrap ${errors.email ? "has-error" : ""}`}>
          <Mail size={19} aria-hidden="true" />
          <input
            ref={emailRef}
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
          />
        </div>
        {errors.email && (
          <p id="login-email-error" className="login-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>
      <div className="login-field">
        <label htmlFor="login-password">Password</label>
        <div
          className={`login-input-wrap ${errors.password ? "has-error" : ""}`}
        >
          <LockKeyhole size={19} aria-hidden="true" />
          <input
            ref={passwordRef}
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            minLength={6}
            required
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password
                ? "login-password-error login-demo-note"
                : "login-demo-note"
            }
          />
          <button
            className="login-password-toggle"
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className="login-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>
      {serverError && <p className="login-error" role="alert">{serverError}</p>}
      <button className="login-submit" type="submit" disabled={busy}>
        {busy ? "Signing in..." : "Sign in to dashboard"} <ArrowRight size={19} />
      </button>
      <p className="login-form-footnote">Your next great day starts here.</p>
    </form>
  );
}
