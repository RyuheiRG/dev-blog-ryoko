export function absoluteUrl(path: string, base: string | URL): string {
  return new URL(path, base).toString();
}

export function pageTitle(title: string | null | undefined, siteName = "Ryoko"): string {
  if (!title) return `${siteName} — Ricardo Reyes Gómez | Full Stack + Security`;
  return `${title} — ${siteName}`;
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
