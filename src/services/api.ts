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

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
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

  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !body.success) {
    throw new Error(body.message ?? "Request failed");
  }
  return body;
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
  categories: () => request<Category[]>("/categories"),

  // TODO: getCategory - fetch single category with details
  // getCategory: (slug: string) => request<Category>(`/categories/${slug}`),

  // ===== Ads/Listings Endpoints =====
  ads: (query = "") => request<Ad[]>(`/ads${query}`),

  adById: (id: string) => request<Ad>(`/ads/${id}`),

  // TODO: searchAds - search with filters (already route-ready)
  // searchAds: (filters: SearchFilters) => request<SearchResults>("/ads/search", { method: "POST", body: JSON.stringify(filters) }),

  createAd: (payload: AdCreatePayload) =>
    request<Ad>("/ads", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  // TODO: updateAd - update existing ad
  // updateAd: (id: string, payload: AdUpdatePayload) => request<Ad>(`/ads/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),

  // TODO: deleteAd - delete an ad
  // deleteAd: (id: string) => request<null>(`/ads/${id}`, { method: "DELETE" }),

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

  // TODO: isSaved - check if ad is saved by user
  // isSaved: (id: string) => request<{ saved: boolean }>(`/ads/${id}/saved`),

  // ===== Messaging Endpoints =====
  // TODO: getConversations - fetch user's conversations list
  // getConversations: () => request<Conversation[]>("/conversations"),

  // TODO: getConversation - fetch conversation with message history
  // getConversation: (id: string) => request<Conversation>(`/conversations/${id}`),

  // TODO: createConversation - start new conversation
  // createConversation: (payload: ConversationCreatePayload) => request<Conversation>("/conversations", { method: "POST", body: JSON.stringify(payload) }),

  // TODO: sendMessage - send message in conversation
  // sendMessage: (payload: MessageSendPayload) => request<Message>("/messages", { method: "POST", body: JSON.stringify(payload) }),

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
