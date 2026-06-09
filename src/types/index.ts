/**
 * Shared TypeScript interfaces for Qwik frontend
 * These types define the shape of data expected from the API and used throughout the application
 */

/**
 * User & Authentication Types
 */
export interface User {
  id: string;
  email?: string;
  fullName: string;
  phone?: string;
  location?: string;
  role?: "USER" | "ADMIN";
  profile?: UserProfile;
  verification?: VerificationSummary;
  verificationApplications?: VerificationSummary[];
  createdAt?: string;
  updatedAt?: string;
}

export type VerificationStatus = "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";
export type VerificationPaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED";

export interface VerificationSummary {
  id: string | null;
  status: VerificationStatus | null;
  paymentStatus: VerificationPaymentStatus | null;
  approved?: boolean;
}

export interface VerificationDocument {
  id?: string;
  url: string;
  name?: string;
  type?: string;
  size?: number;
  purpose: string;
  createdAt?: string;
}

export interface VerificationApplication {
  id: string;
  userId: string;
  type: "BUSINESS";
  status: VerificationStatus;
  businessInfo?: Record<string, string> | null;
  documents: VerificationDocument[];
  paymentStatus: VerificationPaymentStatus;
  rejectionReason?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentCheckoutResponse {
  paymentId: string;
  checkoutUrl: string | null;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  providerReady?: boolean;
}

export interface UserProfile {
  bio?: string;
  avatarUrl?: string;
  verified?: boolean;
  verificationStatus?: "pending" | "verified" | "rejected";
  rating?: number;
  reviewCount?: number;
}

export interface AuthResponse {
  token: string;
  user: User & { role: 'USER' | 'ADMIN' };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  location?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

/**
 * Category Types
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  parentId?: string;
}

/**
 * Ad/Listing Types
 */
export interface AdImage {
  id: string;
  url: string;
  order?: number;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  userId?: string;
  categoryId?: string;
  brand?: string;
  model?: string;
  condition?: string;
  specifications?: Record<string, unknown>;
  category: Category;
  user: User;
  images: AdImage[];
  status?: "ACTIVE" | "SOLD" | "DRAFT" | "ARCHIVED";
  isPromoted?: boolean;
  featured?: boolean;
  viewCount?: number;
  savedCount?: number;
  createdAt?: string;
  updatedAt?: string;
  isSaved?: boolean;
}

export interface AdCreatePayload {
  categoryId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrls: string[];
  brand?: string;
  model?: string;
  condition?: string;
  specifications?: Record<string, unknown>;
}

export interface AdUpdatePayload extends Partial<AdCreatePayload> {
  status?: "ACTIVE" | "SOLD" | "DRAFT" | "ARCHIVED";
}

/**
 * Saved Ads Types
 */
export interface SavedAd {
  id: string;
  adId: string;
  ad: Ad;
  userId: string;
  savedAt: string;
}

/**
 * Message & Conversation Types
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  text: string;
  read?: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  ad?: {
    id: string;
    title: string;
    images: Array<{ id?: string; url: string }>;
  };
  participants: User[];
  lastMessage?: Message;
  lastMessageAt?: string;
  unreadCount?: number;
  messages?: Message[];
}

export interface ConversationCreatePayload {
  recipientId: string;
  message: string;
  adId?: string;
}

export interface MessageSendPayload {
  conversationId: string;
  text: string;
}

/**
 * Notification Types
 */
export interface Notification {
  id: string;
  userId: string;
  type: "message" | "offer" | "system" | "ad_sold" | "price_drop";
  title: string;
  body: string;
  read: boolean;
  actionUrl?: string;
  data?: Record<string, any>;
  createdAt: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  offerNotifications: boolean;
  systemNotifications: boolean;
}

/**
 * Request State Types
 */
export interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

/**
 * Search & Filter Types
 */
export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  pageSize?: number;
  sortBy?: "recent" | "price_asc" | "price_desc" | "featured";
}

export interface SearchResults {
  ads: Ad[];
  total: number;
  page: number;
  pageSize: number;
  filters: SearchFilters;
}

/**
 * Upload Types
 */
export interface UploadAsset {
  url: string;
  id: string;
  name?: string;
  size: number;
  type: string;
}

export interface UploadResponse {
  urls: string[];
  assets: UploadAsset[];
}

/**
 * Offer Types (for future use)
 */
export interface Offer {
  id: string;
  adId: string;
  buyerId: string;
  buyer?: User;
  amount: number;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  createdAt: string;
  updatedAt?: string;
}

export interface OfferCreatePayload {
  adId: string;
  amount: number;
  message?: string;
}
