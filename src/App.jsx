import React, { useState } from "react";
import Dashboard from "./Dashboard";
import LoginPage from "./pages/LoginPage";

// Demo navigation only: every fresh load starts on login.
// No credentials, tokens, or session flags are persisted.
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
}
