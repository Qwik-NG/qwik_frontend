import { clearAllAuthData, getToken, isTokenExpired } from "./auth";
import type {
  User,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  Category,
  Ad,
  AdCreatePayload,
  AdUpdatePayload,
  SavedAd,
  Message,
  Conversation,
  ConversationCreatePayload,
  MessageSendPayload,
  Notification,
  NotificationSettings,
  PaginatedResponse,
  UploadResponse,
  SearchFilters,
  SearchResults,
  Offer,
  OfferCreatePayload
} from "../types/index";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  meta?: { page: number; pageSize: number; total: number };
};

type ApiRequestInit = RequestInit & {
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
};

type CachedResponse = {
  staleAt: number;
  expiresAt: number;
  response: ApiResponse<unknown>;
};

const GET_CACHE = new Map<string, CachedResponse>();
const ADS_STALE_TIME = 30_000;
const AD_DETAILS_STALE_TIME = 60_000;
const CATEGORIES_STALE_TIME = 5 * 60_000;

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function friendlyRequestError(status: number, message?: string) {
  if (status === 503) return "Database unavailable. Please try again in a moment.";
  if (status >= 500) return "The server is having trouble. Please try again in a moment.";
  return message ?? "Request failed";
}

async function request<T>(path: string, init?: ApiRequestInit): Promise<ApiResponse<T>> {
  const { staleTime = 0, cacheTime = 0, retry = 0, ...fetchInit } = init ?? {};
  const method = (fetchInit.method ?? "GET").toUpperCase();
  const cacheKey = method === "GET" && cacheTime > 0 ? path : "";
  const now = Date.now();
  const cached = cacheKey ? GET_CACHE.get(cacheKey) : undefined;

  if (cached && cached.staleAt > now) {
    return cached.response as ApiResponse<T>;
  }

  const token = getToken();
  const authToken = token && !isTokenExpired(token) ? token : null;

  if (token && !authToken) {
    clearAllAuthData();
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
  };

  let lastError: unknown;
  for (let attempt = 0; attempt <= retry; attempt += 1) {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, { ...fetchInit, headers });
      const body = (await res.json().catch(() => ({}))) as ApiResponse<T>;
      if (!res.ok || !body.success) {
        const error = new Error(friendlyRequestError(res.status, body.message));
        if (attempt < retry && res.status >= 500) {
          lastError = error;
          await sleep(350 * (attempt + 1));
          continue;
        }
        throw error;
      }

      if (cacheKey) {
        GET_CACHE.set(cacheKey, {
          staleAt: now + staleTime,
          expiresAt: now + cacheTime,
          response: body as ApiResponse<unknown>,
        });
        window.setTimeout(() => {
          const entry = GET_CACHE.get(cacheKey);
          if (entry && entry.expiresAt <= Date.now()) GET_CACHE.delete(cacheKey);
        }, cacheTime);
      }

      return body;
    } catch (err) {
      lastError = err;
      if (attempt < retry) {
        await sleep(350 * (attempt + 1));
        continue;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

export { type ApiResponse };

export const api = {
  // ===== Authentication Endpoints =====
  register: (payload: RegisterPayload) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  login: (payload: LoginPayload) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    request<{ resetToken?: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  resetPassword: (payload: ResetPasswordPayload) =>
    request<null>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  // TODO: logout endpoint if needed (frontend only clears token)
  // logout: () => request<null>("/auth/logout", { method: "POST" }),

  // ===== User & Profile Endpoints =====
  me: () => request<User>("/users/me"),

  updateMe: (payload: Partial<User> & { bio?: string; avatarUrl?: string }) =>
    request<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),

  // TODO: getUser - fetch public user profile by ID
  // getUser: (id: string) => request<User>(`/users/${id}`),

  // TODO: updateProfile - update user profile (bio, avatar, etc.)
  // updateProfile: (payload: UserProfile) => request<User>("/users/me/profile", { method: "PATCH", body: JSON.stringify(payload) }),

  // ===== Category Endpoints =====
  categories: () =>
    request<Category[]>("/categories", {
      staleTime: CATEGORIES_STALE_TIME,
      cacheTime: CATEGORIES_STALE_TIME * 2,
      retry: 1,
    }),

  // TODO: getCategory - fetch single category with details
  // getCategory: (slug: string) => request<Category>(`/categories/${slug}`),

  // ===== Ads/Listings Endpoints =====
  ads: (query = "") =>
    request<Ad[]>(`/ads${query}`, {
      staleTime: ADS_STALE_TIME,
      cacheTime: ADS_STALE_TIME * 2,
      retry: 1,
    }),

  adById: (id: string) =>
    request<Ad>(`/ads/${id}`, {
      staleTime: AD_DETAILS_STALE_TIME,
      cacheTime: AD_DETAILS_STALE_TIME * 2,
      retry: 1,
    }),

  // TODO: searchAds - search with filters (already route-ready)
  // searchAds: (filters: SearchFilters) => request<SearchResults>("/ads/search", { method: "POST", body: JSON.stringify(filters) }),

  createAd: (payload: AdCreatePayload) =>
    request<Ad>("/ads", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  updateAd: (id: string, payload: AdUpdatePayload) =>
    request<Ad>(`/ads/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),

  deleteAd: (id: string) => request<null>(`/ads/${id}`, { method: "DELETE" }),

  markAdUnavailable: (id: string) =>
    request<Ad>(`/ads/${id}/mark-unavailable`, { method: "PATCH" }),

  getUserAds: (status?: string) => request<Ad[]>(`/users/me/ads${status ? `?status=${status}` : ""}`),

  // ===== Saved Ads Endpoints =====
  savedAds: () => request<Ad[]>("/users/me/saved"),

  saveAd: (id: string) =>
    request<null>(`/ads/${id}/save`, {
      method: "POST"
    }),

  unsaveAd: (id: string) =>
    request<null>(`/ads/${id}/save`, {
      method: "DELETE"
    }),

  isSaved: (id: string) => request<{ saved: boolean }>(`/ads/${id}/saved`),

  getReviews: (id: string) => request<any[]>(`/ads/${id}/reviews`, { retry: 1 }),

  postReview: (id: string, payload: { rating: number; text: string }) =>
    request<any>(`/ads/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  reportAd: (id: string, payload: { reason: string }) =>
    request<any>(`/ads/${id}/report`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  // ===== Messaging Endpoints =====
  getConversations: () => request<Conversation[]>("/conversations"),

  getConversation: (id: string) => request<Conversation>(`/conversations/${id}`),

  createConversation: (payload: ConversationCreatePayload) =>
    request<Conversation>("/conversations", { method: "POST", body: JSON.stringify(payload) }),

  sendMessage: (payload: MessageSendPayload) =>
    request<Message>("/messages", { method: "POST", body: JSON.stringify(payload) }),

  // ===== Notification Endpoints =====
  // TODO: getNotifications - fetch user's notifications
  // getNotifications: (unreadOnly?: boolean) => request<Notification[]>(`/notifications${unreadOnly ? "?unread=true" : ""}`),

  // TODO: markNotificationAsRead - mark notification as read
  // markNotificationAsRead: (id: string) => request<null>(`/notifications/${id}/read`, { method: "PATCH" }),

  // TODO: getNotificationSettings - fetch user's notification preferences
  // getNotificationSettings: () => request<NotificationSettings>("/users/me/notification-settings"),

  // TODO: updateNotificationSettings - update notification preferences
  // updateNotificationSettings: (payload: NotificationSettings) => request<NotificationSettings>("/users/me/notification-settings", { method: "PATCH", body: JSON.stringify(payload) }),

  // ===== Upload Endpoints =====
  // TODO: uploadImage - upload image and return URL
  // uploadImage: (file: File) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   return request<UploadResponse>("/uploads/images", { method: "POST", body: formData });
  // },

  // ===== Offer Endpoints (Future) =====
  // TODO: createOffer - make offer on ad
  // createOffer: (payload: OfferCreatePayload) => request<Offer>("/offers", { method: "POST", body: JSON.stringify(payload) }),

  // TODO: getOffers - get offers for user's ads or user's offers
  // getOffers: (filter?: "received" | "sent") => request<Offer[]>(`/offers${filter ? `?filter=${filter}` : ""}`),

  // TODO: updateOfferStatus - accept/reject offer
  // updateOfferStatus: (id: string, status: "accepted" | "rejected") => request<Offer>(`/offers/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
};
