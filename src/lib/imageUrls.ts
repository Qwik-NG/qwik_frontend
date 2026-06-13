const API_BASE_URL = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

function backendOrigin() {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "";
  }
}

export function normalizeImageUrl(src?: string | null) {
  const value = src?.trim();
  if (!value) return "";

  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  if (value.startsWith("/uploads/")) {
    const origin = backendOrigin();
    return origin ? `${origin}${value}` : value;
  }

  return value;
}

export function normalizeImageUrls(urls: string[]) {
  return urls.map(normalizeImageUrl).filter(Boolean);
}