# Frontend Component Audit

## Existing Reusable Components

- App shell layout: SiteHeader, SiteFooter (src/components/AppShell.tsx)
- Shared auth layout: AuthLayout (src/components/layout/AuthLayout.tsx)
- Settings UI: SettingsSidebar, MobileSettingsMenu (src/components/settings/SettingsSidebar.tsx)
- Icons: SocialIcons, SettingsIcons (src/components/icons)
- UI: Toggle (src/components/ui/Toggle.tsx)

## Duplicated UI Patterns

- Listing/product cards across Home/Search/Product Details/Saved/Ads Dashboard
- Settings tabs and toggle rows across settings pages
- Auth form fields and buttons across auth screens
- Location pin and other simple icons across many pages

## Components That Should Be Extracted

- ListingCard and ProductCard
- Auth form primitives: FormInput, Textarea, Button
- FilterCard for search filters
- Empty state component for notifications and other empty pages
- Icon set for location pin and common glyphs

## Recommended Extraction Order

1. ListingCard/ProductCard
2. Auth form primitives (Input, Textarea, Button)
3. FilterCard and EmptyState
4. Common icons (LocationPin, etc.)

## Estimated Impact

- High: reduces repeated JSX and styling drift
- Medium: enables consistent responsive behavior
- Medium: simplifies future integration and testing
