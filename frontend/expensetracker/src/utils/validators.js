// Frontend validation gives instant feedback. The backend validates again, so it never trusts this.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAmount(value) {
  const text = String(value).trim();
  if (text === "") return "Amount is required";
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return "Enter a positive amount with up to 2 decimal places";
  if (Number(text) <= 0) return "Amount must be greater than zero";
  if (Number(text) >= 10000000000) return "Amount is too large";
  return "";
}

export function validateDate(value, todayIso) {
  if (!value) return "Date is required";
  if (value > todayIso) return "Date cannot be in the future";
  return "";
}

export function validateRequired(value, label, maxLength) {
  const text = String(value).trim();
  if (text === "") return `${label} is required`;
  if (text.length > maxLength) return `${label} must be at most ${maxLength} characters`;
  return "";
}

export function validateUsername(value) {
  const text = value.trim();
  if (text === "") return "Username is required";
  if (text.length < 3 || text.length > 50) return "Username must be between 3 and 50 characters";
  return "";
}

export function validateEmail(value) {
  const text = value.trim();
  if (text === "") return "Email is required";
  if (!EMAIL_PATTERN.test(text)) return "Enter a valid email address";
  return "";
}

export function validatePassword(value, label = "Password") {
  if (value === "") return `${label} is required`;
  if (value.length < 6 || value.length > 100) return `${label} must be between 6 and 100 characters`;
  return "";
}

// True when no field has an error message.
export function hasErrors(errors) {
  return Object.values(errors).some((message) => message !== "");
}
