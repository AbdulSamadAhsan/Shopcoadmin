export function validateLogin({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!password.trim()) {
    errors.password = "Enter your password.";
  } else if (password.length < 6) {
    errors.password = "Use at least 6 characters.";
  }

  return errors;
}
