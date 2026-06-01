# Frontend Integration Readiness

## Existing API Usage

- Auth: register, login, forgot password, reset password
- Profile: me, updateMe
- Services defined in src/services/api.ts and auth helpers in src/services/auth.ts

## Pages Already Connected

- SignUpPage (register)
- LoginPasswordPage (login)
- RecoverPasswordPage (forgot password)
- CreatePasswordPage (reset password)
- ProfileSettingsPage (me + updateMe)

## Pages Still Using Mock Data

- Home, Search Results, Search Results List
- Product Details and Similar Ads
- Saved
- Ads Dashboard
- Messages
- Notifications
- Post flow screens
- Payment screens

## Data Requirements Per Page (Frontend)

- Home: categories, featured ads
- Search Results/List: query filters, results, pagination
- Product Details: ad details, gallery, related ads, save state
- Saved: saved ads list
- Ads Dashboard: user ads by status
- Messages: conversation list, message thread
- Notifications: notification list and unread state
- Post Flow: categories, create-ad payload, upload URLs
- Account/Settings: profile data and preferences

## Loading/Error/Empty State Requirements

- Each data-driven page needs consistent loading and error UI
- Empty states required for notifications, messages, search results, saved, ads

## Frontend Preparation Before Backend Integration

- Define shared TypeScript interfaces for ads, categories, user profile
- Centralize loading/error/empty UI patterns
- Decide URL and query patterns for search and product routes
- Confirm session handling and auth state flows (frontend only)

Note: Backend API design and implementation remain out of scope.
