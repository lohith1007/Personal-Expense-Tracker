// Change this one value to show another currency (for example "USD").
const CURRENCY_CODE = "INR";
const LOCALE = "en-IN";

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY_CODE,
});

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

// "2026-10-07" -> "07 Oct 2026". Built from the parts so time zones cannot shift the day.
export function formatDate(isoDate) {
  if (!isoDate) {
    return "";
  }
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Today's date in the user's own time zone, as yyyy-MM-dd (what <input type="date"> uses).
export function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
