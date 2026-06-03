/**
 * Route constants for the Qwik frontend application
 * Centralized route definitions for consistency and maintainability
 */

// Authentication routes
export const ROUTES = {
  // Home
  HOME: "/",
  
  // Authentication
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  LOGIN: "/login",
  LOGIN_PASSWORD: "/login-password",
  RECOVER_PASSWORD: "/recover-password",
  CREATE_PASSWORD: "/create-password",
  
  // Onboarding
  WELCOME: "/welcome",
  
  // Products & Listings
  PRODUCT_DETAILS: "/product-details",
  PRODUCT_DETAILS_WITH_ID: "/product-details/:id",
  PRODUCTS_WITH_ID: "/products/:id",
  POST: "/post",
  POST_DETAILS: "/post-details",
  NEW_ADVERT_DETAILS: "/new-advert-details",
  PROMOTE_AD: "/promote-ad",
  MAKE_OFFER: "/make-offer",
  
  // Search
  SEARCH_RESULTS: "/search-results",
  SEARCH_RESULTS_LIST: "/search-results-list",
  
  // Dashboard & Ads
  ADS_DASHBOARD: "/ads-dashboard",
  
  // Notifications
  NOTIFICATIONS: "/notifications",
  NOTIFICATION_EMPTY: "/notification-empty",
  NOTIFICATION_SETTINGS: "/notification-settings",
  NOTIFICATION_SETTINGS_EMAIL: "/notification-settings-email",
  
  // Settings & Account
  PROFILE_SETTINGS: "/profile-settings",
  CHAT_SETTINGS: "/chat-settings",
  ACCOUNT: "/account",
  GET_VERIFIED: "/get-verified",
  GET_VERIFIED_BUSINESS_INFO: "/get-verified/business-info",
  GET_VERIFIED_DOCUMENT_UPLOAD: "/get-verified/document-upload",
  GET_VERIFIED_REVIEW: "/get-verified/review",
  
  // Messages & Social
  MESSAGES: "/messages",
  
  // User Collections
  SAVED: "/saved",
  
  // Payment
  PLAN_PAYMENT: "/plan-payment",
  PREMIUM_PLAN_PAYMENT: "/premium-plan-payment",
  
  // Error pages
  NOT_FOUND: "/not-found",
};

/**
 * Helper function to build dynamic product routes with ID
 */
export const buildProductDetailsRoute = (id: string | number) => {
  return `/product-details/${id}`;
};

/**
 * Helper function to build dynamic product routes with ID (alternative path)
 */
export const buildProductRoute = (id: string | number) => {
  return `/products/${id}`;
};

/**
 * Helper function to build search results route with query params
 */
export const buildSearchResultsRoute = (query?: string) => {
  if (!query) return ROUTES.SEARCH_RESULTS;
  return `${ROUTES.SEARCH_RESULTS}?q=${encodeURIComponent(query)}`;
};

/**
 * Helper function to build search results list route with query params
 */
export const buildSearchResultsListRoute = (query?: string) => {
  if (!query) return ROUTES.SEARCH_RESULTS_LIST;
  return `${ROUTES.SEARCH_RESULTS_LIST}?q=${encodeURIComponent(query)}`;
};
