# Frontend Architecture Analysis

## Current Architecture

- React + Vite SPA with React Router v6
- Route table in src/App.tsx; app bootstrapped in src/main.tsx
- Shared shell header/footer in src/components/AppShell.tsx
- Pages live under src/pages; most logic and UI are page-local
- Services in src/services/api.ts and src/services/auth.ts

## Folder Structure

- src/
  - components/ (shared shell + shared UI primitives added recently)
  - pages/ (route screens)
  - services/ (API + auth helpers)
  - index.css (Tailwind base + overrides)
  - styles.css (legacy stylesheet, appears unused)

## Routing Structure

- Static routes only; no URL params for entities (e.g., product details)
- 404 behavior redirects to home
- No protected-route or auth guard layer

## Shared Layout Strategy

- SiteHeader and SiteFooter from AppShell used on most screens
- Some pages still have local variants of headers/footers

## Service Layer Structure

- api.ts: centralized fetch helper, token injection, typed responses
- auth.ts: localStorage token/email/reset token helpers

## Styling Strategy

- Tailwind CSS utilities + small theme extension in tailwind.config.js
- Frequent raw hex usage and arbitrary sizes in JSX
- index.css includes global mobile overrides to patch inconsistent sizing

## Existing Page Inventory

- Home, Search Results (grid/list), Product Details, Saved
- Auth: SignIn, Login, Login Password, SignUp, Recover Password, Create Password, Welcome
- Account/Settings: Account, Profile Settings, Chat Settings, Notification Settings, Email Notification Settings
- Ads: Ads Dashboard, Promote Ad, Post, New Advert Details, Post Details
- Messages, Notifications, Notification Empty
- Payments: Plan Payment, Premium Plan Payment
- Make Offer

## Strengths

- Clear SPA structure and routing entrypoint
- Central API layer with typed responses
- Shared shell provides consistent top-level UI
- Solid visual design direction for key screens

## Weaknesses

- Heavy duplication across listing cards, settings sidebar, icons, and auth layouts
- Large parts of app are mock-data driven
- No dynamic routing strategy
- Styling consistency depends on ad-hoc utilities and overrides

## Production Risks

- Routing not ready for real entity URLs or search state
- Mock data hides integration gaps
- Inconsistent styles and large type scales can create UX issues
- No auth gating for account and user-specific pages
