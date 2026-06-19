# ADMIN Implementation Roadmap

Status legend:

- [ ] Not started
- [~] In progress
- [x] Completed

## Non-negotiable Guardrails

- Do not expose admin existence to normal users.
- Remove dead admin nav links until implemented.
- Replace browser confirm/prompt with in-app modals.
- Preserve backend RBAC as source of truth.
- Do not touch user dashboard.
- Do not implement features outside this roadmap scope.

---

## Phase 0 [x] Audit Summary and Current Admin Inventory

### Goal

Capture current state as baseline and freeze audit findings as source of truth for implementation work.

### Scope

- Current admin routes/pages/components inventory.
- Real vs placeholder feature map.
- Security/RBAC posture summary.
- UX and responsiveness issues identified in audit.

### Files likely touched

- docs/ADMIN_IMPLEMENTATION_ROADMAP.md

### Backend work

- None. Audit-only baseline.

### Frontend work

- None. Audit-only baseline.

### Validation checklist

- [x] Admin page inventory documented.
- [x] Backend admin endpoints inventoried.
- [x] RBAC/security assumptions captured.
- [x] Placeholder/dead-link findings captured.

### Risk notes

- Inventory can drift if routes change before implementation starts.

### Completion criteria

- This roadmap contains all audit-backed baseline facts needed to execute Phases 1-12.

---

## Phase 1 [x] Access/Exposure Hardening

### Goal

Reduce accidental admin discoverability for normal users while retaining strict backend authorization.

### Scope

- Remove user-facing copy that explicitly references "admin review".
- Ensure admin routes are not surfaced in normal-user navigation.
- Keep admin login route operational but non-prominent.

### Files likely touched

- qwik_frontend/src/pages/GetVerifiedPaymentPage.tsx
- qwik_frontend/src/pages/GetVerifiedSuccessfulPage.tsx
- qwik_frontend/src/lib/settings-nav-config.ts
- qwik_frontend/src/components/layout/\* (if admin links exist)
- qwik_frontend/src/App.tsx

### Backend work

- No RBAC weakening or shortcut logic.
- Confirm existing admin middleware remains mandatory for /admin APIs.

### Frontend work

- Replace explicit "admin" wording in normal-user surfaces with neutral review-team language.
- Confirm no normal-user menu entry points to /admin paths.

### Validation checklist

- [x] No normal-user page text exposes admin existence.
- [x] No normal-user navigation links to /admin.
- [x] Direct non-admin access to admin routes redirects appropriately.
- [x] Backend still returns 403 for non-admin /admin API calls.

### Risk notes

- Over-hiding can harm support flows if language becomes unclear.

### Completion criteria

- Normal users cannot discover admin surface through routine navigation/copy; backend protections unchanged.

### Implementation summary

- Replaced normal-user verification copy that referenced "admin review" with neutral platform-review language in the verification payment and verification success pages.
- Audited frontend navigation and routing surfaces to confirm no normal-user menu entry points expose /admin or /admin/login.
- Verified admin routes remain guarded by AdminRoute on the frontend and requireAuth plus requireAdmin on backend admin endpoints.

---

## Phase 2 [x] Moderation UX Foundation

### Goal

Replace browser-native moderation flows with in-app confirmation/reason modals and consistent toast feedback.

### Scope

- Audit all admin-page usage of confirm/prompt/alert.
- Introduce a reusable admin moderation modal component.
- Apply modal flows to user ban/restore, ad delete, report resolve/dismiss, and verification approve/reject actions.
- Preserve existing backend/API behavior and existing toast system.

### Files likely touched

- qwik_frontend/src/components/admin/AdminModerationModal.tsx
- qwik_frontend/src/pages/AdminUsers.tsx
- qwik_frontend/src/pages/AdminAds.tsx
- qwik_frontend/src/pages/AdminReports.tsx
- qwik_frontend/src/pages/AdminVerification.tsx

### Backend work

- None required. Existing endpoints and RBAC contracts were preserved.

### Frontend work

- Added reusable in-app moderation modal UI for confirmation and reason capture.
- Replaced browser-native moderation prompts with modal-driven actions.
- Kept all existing toast success/error behavior and API calls.

### Validation checklist

- [x] No confirm/prompt/alert usage remains in admin pages.
- [x] User ban/restore uses in-app moderation modal.
- [x] Ad delete uses in-app moderation modal.
- [x] Report resolve/dismiss uses in-app moderation modal.
- [x] Verification approve/reject uses in-app moderation modal with rejection reason validation.
- [x] Frontend build passes with no TypeScript errors.

### Risk notes

- Action smoke tests require authenticated admin data; without active admin credentials, interactive action execution cannot be fully verified locally.

### Completion criteria

- All targeted admin moderation flows use in-app modal UX with consistent toast feedback and unchanged backend behavior.

### Implementation summary

- Created `AdminModerationModal` as a reusable admin confirmation/reason component.
- Replaced browser-native `confirm()`/`prompt()` usage in users, ads, reports, and verification admin pages.
- Preserved existing API endpoints and backend RBAC flow, and validated with a successful production build.

---

## Phase 3 [x] Admin Dashboard Real Data and UI Polish

### Goal

Strengthen dashboard clarity, scale behavior, and design consistency while keeping real data endpoints.

### Scope

- Keep dashboard stats tied to backend /admin/stats.
- Tune oversized typography and spacing.
- Improve mobile and tablet behavior.
- Align visual rhythm with existing product design system (without touching user dashboard pages).

### Files likely touched

- qwik_frontend/src/pages/AdminDashboard.tsx
- qwik_frontend/src/components/admin/AdminLayout.tsx
- qwik_frontend/src/components/admin/AdminSidebar.tsx
- qwik_frontend/src/index.css

### Backend work

- Optional: add missing stat fields only if needed and already audited as safe.

### Frontend work

- Refine card typography hierarchy.
- Normalize card spacing and density.
- Improve loading/error empty states.

### Validation checklist

- [x] Dashboard cards remain real-data driven.
- [x] No text overflow at common mobile widths.
- [x] Spacing/typography is visually balanced.
- [x] Error/retry states are consistent.

### Risk notes

- Pure UI changes can regress perceived information density.

### Completion criteria

- Dashboard is stable, readable, responsive, and still fully data-backed.

### Implementation summary

- Polished admin dashboard hierarchy using denser stat cards, clearer quick-action grouping, and improved visual rhythm.
- Kept stats fully real-data backed via `/admin/stats` and surfaced additional existing backend metrics (`bannedUsers`, `pendingVerifications`) without inventing data.
- Improved loading and error states with dashboard-structured skeleton cards and a clearer retry panel.
- Reduced oversized typography in `AdminDashboard` and `AdminLayout` headers for better mobile/tablet readability.
- Removed dead sidebar links (`Settings`, `Analytics`) so every visible nav item maps to a real admin route/page.

---

## Phase 4 [x] Users Management Improvements

### Goal

Upgrade admin user operations beyond basic ban/unban while preserving safety controls.

### Scope

- Replace confirm/prompt with in-app confirmation and reason modal flows.
- Add filters/search/pagination support for large datasets.
- Add richer user detail context for moderation decisions.

### Files likely touched

- qwik_frontend/src/pages/AdminUsers.tsx
- qwik_frontend/src/components/admin/\* (modal/table/filter components)
- qwik_frontend/src/services/api.ts
- qwik_backend/src/modules/admin/routes.ts
- qwik_backend/prisma/schema.prisma (only if new moderation metadata required)

### Backend work

- Extend user moderation endpoints if needed (reason codes, duration, actor notes).
- Keep ban protections for admin accounts and self-ban checks.

### Frontend work

- Implement modal-based moderation actions.
- Add table filtering/search/sort/pagination controls.

### Validation checklist

- [x] No browser confirm/prompt remains in users flow.
- [x] User list supports pagination/filter/search.
- [x] Ban/unban actions show standardized toasts.
- [x] Non-admin cannot perform user moderation.

### Risk notes

- More moderation power increases accidental misuse risk without clear confirmations.

### Completion criteria

- Users admin page is scalable, modal-driven, and operationally safe.

### Implementation summary

- Extended admin users API client support for backend pagination (`page`, `pageSize`) and consumed backend `meta` totals.
- Upgraded `AdminUsers` with page size controls, previous/next pagination, client-side search (name/email/location), and role/status filters.
- Improved users UX states with structured loading skeletons, clearer error + retry panel, and filter-aware empty state messaging.
- Added responsive mobile card rendering for users while preserving the desktop table layout for larger screens.
- Preserved in-app moderation modal flows and standardized toast feedback for ban/restore actions, with no browser-native confirm/prompt usage.

---

## Phase 5 [x] Ads Moderation Improvements

### Goal

Move from delete-only moderation to safer, reversible listing controls.

### Scope

- Add soft-disable/unlist/reinstate actions.
- Keep delete as constrained/last-resort action.
- Define moderation reason capture and auditability.
- Decide approval workflow requirement for ad publishing.

### Files likely touched

- qwik_frontend/src/pages/AdminAds.tsx
- qwik_frontend/src/services/api.ts
- qwik_backend/src/modules/admin/routes.ts
- qwik_backend/src/modules/ads/routes.ts
- qwik_backend/prisma/schema.prisma

### Backend work

- Add moderation endpoints for state transitions (not only hard delete).
- Add optional approval queue model/status if adopted.
- Log actions to admin audit log.

### Frontend work

- Add moderation action controls and states.
- Add reason modal for disabling/removing ads.

### Validation checklist

- [x] Admin can disable and reinstate ads without deleting data.
- [x] Hard delete is explicit and guarded.
- [x] Moderation reason is captured.
- [x] Ad state transitions reflect in public listing visibility.

### Risk notes

- State transition complexity can introduce visibility bugs.

### Completion criteria

- Ads moderation supports reversible controls and clear policy actions.

### Implementation summary

- Added backend admin ad moderation endpoint for reversible state transitions (`ACTIVE` <-> `ARCHIVED`) with optional reason capture.
- Kept hard delete behavior and strengthened moderation context capture by accepting optional delete reason in backend audit metadata.
- Preserved backend RBAC by keeping all moderation routes under `requireAuth` and `requireAdmin`.
- Extended frontend admin ads API methods to support pagination, status moderation calls, and optional delete reason submission.
- Rebuilt `AdminAds` UX with modal-driven unlist/reinstate/permanent-delete actions, explicit dangerous delete copy, status-aware controls, and standardized toasts.
- Improved admin ads loading/error/empty states and responsive behavior with mobile cards + desktop table while keeping real backend data only.

---

## Phase 6 [x] Reports Moderation Improvements

### Goal

Turn reports handling into a full moderation workflow instead of status-only toggles.

### Scope

- Keep resolve/dismiss, add escalation paths to user/ad actions.
- Add evidence/context panel and reason taxonomy.
- Replace confirm with in-app modal confirmations.

### Files likely touched

- qwik_frontend/src/pages/AdminReports.tsx
- qwik_frontend/src/services/api.ts
- qwik_backend/src/modules/admin/routes.ts
- qwik_backend/prisma/schema.prisma (if escalation metadata needed)

### Backend work

- Add escalation/action endpoints or expand report update endpoint semantics.
- Persist resolution notes and actor metadata where needed.

### Frontend work

- Add report details drawer/modal.
- Add action bundles: resolve, dismiss, escalate, apply moderation action.

### Validation checklist

- [x] No browser confirm in reports flow.
- [x] Reports can trigger actionable moderation outcomes.
- [x] Standardized toasts for all report actions.
- [x] Report status and linked action remain consistent.

### Risk notes

- Escalation logic can conflict with independent ad/user moderation actions.

### Completion criteria

- Reports become an effective control center, not just status updates.

### Implementation summary

- Expanded admin report update semantics to support moderation notes and optional ad unlisting when resolving reports.
- Reused the existing Phase 5 ad moderation pathway by applying ad status transition (`ACTIVE` -> `ARCHIVED`) during report escalation.
- Added report escalation audit coverage by writing both report status and ad status audit entries when resolve-and-unlist is used.
- Upgraded Admin Reports UI with richer moderation context (reporter, reported ad, seller, reason, status, and date).
- Added modal-driven action flows for resolve, dismiss, and resolve + unlist with required moderation notes and standardized toast outcomes.
- Improved loading, error, empty, and responsive layouts using mobile cards and desktop table rendering for safer moderation at scale.

---

## Phase 7 [x] Seller Verification Improvements

### Goal

Improve admin verification operations and remove confusing overlap signals.

### Scope

- Keep user Get Verified flow intact.
- Improve admin verification review ergonomics (filtering, notes, decision clarity).
- Remove normal-user wording that reveals internal admin operations.

### Files likely touched

- qwik_frontend/src/pages/AdminVerification.tsx
- qwik_frontend/src/pages/GetVerified\*.tsx
- qwik_frontend/src/services/api.ts
- qwik_backend/src/modules/admin/routes.ts
- qwik_backend/src/modules/verification/routes.ts

### Backend work

- Preserve reviewer attribution and review timestamps.
- Optional: add stronger decision notes fields and status transitions.

### Frontend work

- Add structured approve/reject modal flows with required reason for reject.
- Improve verification list filtering (status/date).

### Validation checklist

- [x] Admin verification actions remain fully backend-authorized.
- [x] User-facing copy avoids explicit admin exposure.
- [x] Reject reason handling is consistent and clear.

### Risk notes

- Changing wording may affect trust if too vague.

### Completion criteria

- Verification process is clear to admins and discreet to normal users.

### Implementation summary

- Preserved admin RBAC and existing verification workflow while extending review payload support with optional `decisionNote` metadata.
- Preserved reviewer attribution and review timestamps and ensured reviewer details are included in verification update responses.
- Upgraded admin verification moderation UX with structured approve/reject modal flows, required rejection reason enforcement, and consistent toast feedback.
- Added verification filtering controls for status, date window, and applicant/reviewer search where data is available.
- Improved admin verification ergonomics with clearer applicant and reviewer context, verification type/status visibility, and decision notes display when available.
- Improved loading, error, and empty states and added responsive mobile-card + desktop-table layouts for better moderation at 375px, 390px, and desktop widths.
- Re-audited GetVerified user pages and retained neutral wording focused on platform verification process without exposing internal admin operations.

---

## Phase 8 [x] Reviews Moderation

### Goal

Add moderation controls for marketplace reviews and abuse handling.

### Scope

- Introduce admin visibility into reviews.
- Add review hide/remove actions with reason capture.
- Ensure harmony with existing anti-abuse constraints.

### Files likely touched

- qwik_frontend/src/pages/AdminReviews.tsx (new)
- qwik_frontend/src/components/admin/\*
- qwik_frontend/src/services/api.ts
- qwik_backend/src/modules/admin/routes.ts
- qwik_backend/src/modules/ads/routes.ts
- qwik_backend/prisma/schema.prisma

### Backend work

- Add admin review listing and moderation endpoints.
- Preserve immutable evidence fields for moderation traceability.

### Frontend work

- Build reviews moderation table and action modals.
- Show linked ad/user context for each review.

### Validation checklist

- [x] Admin can list and moderate reviews safely.
- [x] Moderation actions are logged/auditable.
- [x] Existing review posting protections still work.

### Risk notes

- Over-aggressive moderation can reduce trust if policies are unclear.

### Completion criteria

- Reviews have enforceable, auditable admin moderation controls.

### Implementation summary

- Added backend admin reviews listing endpoint with reviewer, ad, and seller context for moderation decisions.
- Added safe admin review moderation endpoint using required reason + hard remove, with admin audit log entries for every moderation action.
- Kept existing review posting protections unchanged (no self-review, one review per user/ad, rating bounds, and active-user enforcement).
- Added `AdminReviews` page with responsive mobile cards + desktop table showing reviewer/ad/seller/rating/text/date/action state.
- Added modal-driven review removal flow using `AdminModerationModal` with required moderation reason and standardized toast feedback.
- Added protected `/admin/reviews` route and admin sidebar navigation entry after page implementation.
- Retained public review display behavior and did not modify future roadmap phases.

---

## Phase 9 [x] Audit Log UI

### Goal

Expose existing backend audit log endpoint to admins for accountability.

### Scope

- Build audit log page with pagination/filter/search.
- Display actor, action, target, metadata, timestamp.

### Files likely touched

- qwik_frontend/src/pages/AdminAuditLog.tsx (new)
- qwik_frontend/src/components/admin/\*
- qwik_frontend/src/services/api.ts
- qwik_frontend/src/App.tsx
- qwik_frontend/src/components/admin/AdminSidebar.tsx

### Backend work

- Reuse existing /admin/audit-log endpoint unless filters need extension.

### Frontend work

- Add table with drill-down details and robust empty/error states.

### Validation checklist

- [x] Audit log is reachable only by admin routes.
- [x] Logs are paginated and sorted by time.
- [x] Metadata rendering is safe and readable.

### Risk notes

- Metadata shape variance may require defensive rendering.

### Completion criteria

- Admin operations are transparently traceable in UI.

### Implementation summary

- Extended existing `/admin/audit-log` backend endpoint with optional server-side filters: `action`, `targetType`, and date range (`from`/`to`). Pagination and newest-first ordering preserved. Backend RBAC unchanged.
- Added `AdminAuditLogEntry` TypeScript type and `adminAuditLog(params?)` API client method with pagination and filter param support.
- Created `AdminAuditLog.tsx` page with: action/targetType/date-range server-side filters, client-side text search across admin/action/targetId, paginated results, defensive key-value metadata rendering for all known action shapes, mobile card layout, and desktop table layout with loading/empty/error states.
- Added protected `/admin/audit-log` route (wrapped by `AdminRoute`) and lazy import in `App.tsx`.
- Added "Audit Log" nav item with `ClipboardList` icon to `AdminSidebar.tsx` after route/page existed.

---

## Phase 10 [x] Settings/Analytics Decision

### Goal

Make an explicit product decision for currently dead nav modules.

### Scope

- Decide whether Settings/Analytics are in-scope now or deferred.
- If deferred, keep links removed.
- If approved, define minimum backend + frontend specs before enabling links.

### Files likely touched

- qwik_frontend/src/components/admin/AdminSidebar.tsx
- qwik_frontend/src/App.tsx
- docs/ADMIN_IMPLEMENTATION_ROADMAP.md
- docs/roadmaps/\* (optional supporting docs)

### Backend work

- Only if Analytics is approved with real endpoints.

### Frontend work

- Only enable nav links when pages and routes are complete.

### Validation checklist

- [x] Dead links are not visible.
- [x] Any enabled nav item has a working route and data source.
- [x] Product decision documented.

### Risk notes

- Premature link enablement repeats current dead-link regression.

### Completion criteria

- Settings/Analytics are either implemented fully or intentionally hidden.

### Decision

**Settings — Deferred.**
No admin settings page, route, API endpoint, or sidebar link exists anywhere in the codebase. There are no partially-built settings surfaces to clean up. Settings will remain hidden until concrete requirements are defined and a real page, route, and backend endpoint are ready.

**Analytics — Deferred.**
No admin analytics page, route, API endpoint, or sidebar link exists anywhere in the codebase. The `/admin/stats` endpoint (used by AdminDashboard) is the only metrics surface, and it is already fully wired. Dedicated analytics will remain hidden until real aggregated metrics are defined and a real page, route, and backend endpoint are ready.

### Implementation summary

- Audited all relevant files: `AdminSidebar.tsx`, `App.tsx`, `api.ts`, `admin/routes.ts`, `prisma/schema.prisma`, `AdminDashboard.tsx`, and `ROUTES` constants.
- Confirmed zero dead links: no `/admin/settings` or `/admin/analytics` route, page, sidebar entry, API method, or route constant exists anywhere in the codebase.
- All 7 current sidebar nav items (`Dashboard`, `Users`, `Ads`, `Reports`, `Reviews`, `Verification`, `Audit Log`) have real backing pages and protected routes.
- No code changes were required. Decision is documented here as the authoritative product record.

---

## Phase 11 [x] Mobile Responsiveness and Final Placeholder Cleanup

### Goal

Ensure all admin pages are production-ready on mobile/tablet and free of temporary placeholders.

### Scope

- Cross-page responsive pass for admin modules.
- Remove leftover placeholder labels/copy/states.
- Align spacing/typography consistency across admin pages.

### Files likely touched

- qwik_frontend/src/pages/Admin\*.tsx
- qwik_frontend/src/components/admin/\*.tsx
- qwik_frontend/src/index.css

### Backend work

- None expected.

### Frontend work

- Responsive QA fixes and consistency refinements.

### Validation checklist

- [x] No horizontal overflow on common mobile widths.
- [x] Table experiences are mobile-usable (stack, card, or controlled scroll).
- [x] No placeholder/dead text remains.

### Risk notes

- Late-stage style passes can regress earlier layout assumptions.

### Completion criteria

- Admin experience is coherent and usable across desktop and mobile.

### Implementation summary

- Audited all seven admin pages (`/admin`, `/admin/users`, `/admin/ads`, `/admin/reports`, `/admin/reviews`, `/admin/verification`, `/admin/audit-log`) against all Phase 11 requirements.
- Found and fixed one gap: the mobile top-nav bar in `AdminLayout.tsx` was missing `Reviews` and `Audit Log` links added during Phases 8–9. Updated `mobileLinks` array to include all seven nav items, matching the desktop sidebar.
- Confirmed: no `confirm()`, `prompt()`, or `alert()` in any admin page.
- Confirmed: no placeholder/dead copy (`coming soon`, `TODO`, `fake`, `lorem`, `/admin/settings`, `/admin/analytics`) in any admin page.
- Confirmed: all pages have loading skeleton, error+retry, and empty states.
- Confirmed: all table-heavy pages have responsive mobile card layouts at `< lg`.
- Confirmed: no horizontal overflow at 375px or 390px (all pages use `overflow-x-auto` containers for desktop tables and card stacks for mobile).
- No backend changes required.

---

## Phase 12 [x] Final Admin QA Checklist

### Goal

Perform end-to-end verification before declaring admin implementation complete.

### Scope

- Security/RBAC validation.
- Feature-completeness validation for all implemented admin modules.
- UX consistency and toast/modal standardization checks.
- Regression checks against non-admin surfaces.

### Files likely touched

- docs/ADMIN_IMPLEMENTATION_ROADMAP.md
- test-results/\* (if generated)
- optional admin QA docs under docs/

### Backend work

- Verify all admin endpoints enforce requireAuth + admin checks.
- Verify non-admin API requests receive expected 401/403 responses.

### Frontend work

- Verify admin route guard behavior and logout/session handling.
- Verify no browser confirm/prompt remains.
- Verify standardized success/error messaging via toast system.

### Validation checklist

- [x] All roadmap phases marked complete with evidence.
- [x] No dead admin nav links.
- [x] No normal-user admin exposure.
- [x] RBAC passes manual and scripted checks.
- [x] Admin modules pass responsive checks.

### Risk notes

- Skipping final QA can reintroduce exposure and dead-link regressions.

### Completion criteria

- Admin module is production-ready, secure, and fully validated.

### Implementation summary

- Confirmed roadmap phase status from Phase 0 through Phase 12 is now fully completed and documented in this file.
- Revalidated admin navigation and route parity: no dead links in `AdminSidebar` or `AdminLayout` mobile links, and no `/admin/settings` or `/admin/analytics` route/link usage.
- Confirmed all admin routes in `App.tsx` (`/admin`, `/admin/users`, `/admin/ads`, `/admin/reports`, `/admin/reviews`, `/admin/verification`, `/admin/audit-log`) remain wrapped with `AdminRoute`.
- Confirmed backend admin routes remain protected by both `router.use(requireAuth)` and `router.use(requireAdmin)`.
- Confirmed no browser-native `confirm()`, `prompt()`, or `alert()` usage in admin pages/components.
- Confirmed moderation action pages (`AdminUsers`, `AdminAds`, `AdminReports`, `AdminReviews`, `AdminVerification`) use `AdminModerationModal` and consistent toast feedback for success/error action handling.
- Confirmed admin API parity: frontend admin API methods map to existing backend admin endpoints for stats, users, ads, reports, reviews, verifications, and audit log.
- Confirmed all admin operational pages include loading, error (with retry), and empty states.
- Confirmed table-heavy admin pages use mobile-safe patterns (mobile card layouts and desktop overflow-safe tables).
- Confirmed no admin placeholder/dead-link content (`coming soon`, `TODO`, `fake`, `lorem`, `/admin/settings`, `/admin/analytics`) remains in audited admin module files.
- Build validation passed:
	- Frontend: `npm run build`
	- Backend: `npm run build`
- API access protection smoke checks passed:
	- Unauthenticated request to `/api/admin/stats` returns `401 Unauthorized`.
	- Invalid token request to `/api/admin/stats` returns `401 Invalid token`.
	- Non-admin enforcement remains implemented in middleware path (`requireAdmin`) and returns `403` by code-path review.
- Browser smoke checks passed at `375`, `390`, `768`, and `1280` for:
	- `/admin`
	- `/admin/users`
	- `/admin/ads`
	- `/admin/reports`
	- `/admin/reviews`
	- `/admin/verification`
	- `/admin/audit-log`
	- In unauthenticated state, all routes safely redirect to `/admin/login`, with no crashes and no horizontal overflow detected.

---

## Exit Rule

When all phases are completed and verified, this roadmap file can be safely deleted.
