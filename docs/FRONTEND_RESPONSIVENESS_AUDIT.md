# Frontend Responsiveness Audit

## Mobile Issues

- Fixed-width elements (e.g., 420px/430px) used across settings and auth screens
- Overly large typography on settings and promotion screens (partially reduced recently)
- Some layouts rely on global overrides in index.css to downscale text
- Sidebar navigation needed a mobile drawer (now present for settings)

## Tablet Issues

- Settings layouts can feel wide and text-heavy
- Two-column layouts have limited mid-breakpoint tuning

## Desktop Issues

- Some settings and promotion screens feel oversized compared to rest of app
- Inconsistent typographic scale between pages

## Fixed-Width Risks

- Hard widths can cause overflow or cramped UI on smaller screens
- Several buttons use fixed widths, risking text clipping in localization

## Typography Inconsistencies

- Multiple ad-hoc text sizes (e.g., text-[35px], text-[42px])
- Large headings used outside hero contexts

## Responsive Priorities

1. Remove remaining fixed-width controls in settings and auth flows
2. Normalize type scale across settings, promotion, and payments
3. Reduce reliance on global overrides in index.css
4. Validate tablet breakpoints for settings and search pages
