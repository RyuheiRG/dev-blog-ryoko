const longDate = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const monthYear = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return longDate.format(new Date(iso)).replace(/\./g, "");
}

export function formatMonthYear(iso: string): string {
  return monthYear.format(new Date(iso));
}

export function formatNumericDate(iso: string): string {
  const date = new Date(iso);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function isoDate(iso: string): string {
  return new Date(iso).toISOString();
}
