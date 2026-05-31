import { getToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  meta?: { page: number; pageSize: number; total: number };
};

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !body.success) {
    throw new Error(body.message ?? "Request failed");
  }
  return body;
}

export type Ad = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: { id: string; url: string }[];
  category?: { id: string; name: string; slug: string };
  user?: { id: string; fullName: string };
};

export type Category = { id: string; name: string; slug: string };

export const api = {
  register: (payload: { email: string; password: string; fullName: string; phone?: string; location?: string }) =>
    request<{ token: string; user: { id: string; email: string; fullName: string } }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: { id: string; email: string; fullName: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  forgotPassword: (payload: { email: string }) =>
    request<{ resetToken?: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  resetPassword: (payload: { token: string; password: string }) =>
    request<null>("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request<{ id: string; email: string; fullName: string; phone?: string; location?: string; profile?: { bio?: string; avatarUrl?: string } }>("/users/me"),
  updateMe: (payload: { fullName?: string; phone?: string; location?: string; bio?: string; avatarUrl?: string }) =>
    request("/users/me", { method: "PATCH", body: JSON.stringify(payload) }),
  categories: () => request<Category[]>("/categories"),
  ads: (query = "") => request<Ad[]>(`/ads${query}`),
  adById: (id: string) => request<Ad>(`/ads/${id}`),
  savedAds: () => request<Ad[]>("/users/me/saved"),
  saveAd: (id: string) => request(`/ads/${id}/save`, { method: "POST" }),
  unsaveAd: (id: string) => request(`/ads/${id}/save`, { method: "DELETE" }),
  createAd: (payload: { categoryId: string; title: string; description: string; price: number; location: string; imageUrls: string[] }) =>
    request<Ad>("/ads", { method: "POST", body: JSON.stringify(payload) })
};
