# Frontend Production Fixes Roadmap

Current phase: Phase 5 — Layout & Polish

## Phase 1 — Correctness Fixes

Status: Complete

- Add missing `type="button"` attributes to non-submit buttons
- Apply proper input types for email, password, phone, price/amount, date, and normal text fields
- Wire file upload buttons to hidden file inputs
- Keep upload state in local component state only for now

## Phase 2 — Feedback & Interactivity

Status: Complete

- Add a lightweight toast system
- Add consistent hover, focus, and active states
- Replace `window.alert` usage with non-blocking UI feedback

## Phase 3 — Data Cleanup

Status: Complete

- Reduce hardcoded fake user data
- Prepare mock/static data for future real integration
- Add token expiry readiness in frontend auth handling

## Phase 4 — Code Quality

Status: Complete

- Consolidate duplicate Toggle implementations
- Replace emoji/CDN category icons with local SVG or lucide-style icons
- Replace remote placeholder imagery with local image placeholders where appropriate

## Phase 5 — Layout & Polish

Status: Complete

- Introduce a reusable global `PageLayout` wrapper where safe
- Add CSS-only page transition polish
- Clean up responsive inconsistencies
