export function buildShortUrl(code: string, baseUrl: string) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  return `${normalizedBase}/${code}`;
}

export function formatTimestamp(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

