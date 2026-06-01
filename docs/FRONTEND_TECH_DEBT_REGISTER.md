# Frontend Tech Debt Register

## High Priority

- Duplicate listing/product card UI
  - Impact: inconsistent UI and higher maintenance
  - Resolution: extract shared card components
- Mock data usage across core marketplace pages
  - Impact: integration risk and inaccurate UX validation
  - Resolution: migrate to API data incrementally
- Static routing for entity pages
  - Impact: product details and search cannot be deep-linked
  - Resolution: introduce dynamic routes and query strategy

## Medium Priority

- Inconsistent typography scale
  - Impact: uneven visual hierarchy across pages
  - Resolution: normalize type scale and reuse tokens
- Global mobile overrides in index.css
  - Impact: brittle responsive behavior
  - Resolution: push responsive logic into components
- Fragmented auth entry flows
  - Impact: user confusion and inconsistent UX
  - Resolution: consolidate auth flow hierarchy

## Low Priority

- Legacy styles.css file appears unused
  - Impact: minor confusion
  - Resolution: remove or document usage
- Flat page organization in src/pages
  - Impact: harder long-term navigation
  - Resolution: group by domain when refactoring
