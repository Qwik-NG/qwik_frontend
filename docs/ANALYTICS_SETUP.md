# Analytics Setup

This guide configures Google Analytics 4 (GA4) and Microsoft Clarity for the Qwik frontend.

## 1) Create a GA4 Property

1. Sign in to Google Analytics.
2. Go to Admin.
3. Under Account, create/select the account for Qwik.
4. Under Property, create a new GA4 property.
5. Add a Web data stream for your production domain.

## 2) Get the GA4 Measurement ID

1. In GA4, open Admin.
2. Under Property, open Data Streams.
3. Select your Web stream.
4. Copy the Measurement ID (format like G-XXXXXXXXXX).

## 3) Create a Microsoft Clarity Project

1. Sign in to Microsoft Clarity.
2. Create a new project.
3. Add your production domain.

## 4) Get the Clarity Project ID

1. Open your Clarity project settings.
2. Copy the project ID used in the tracking script.

## 5) Set Frontend Environment Variables

Add these values to your frontend environment file used in production:

- VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
- VITE_CLARITY_PROJECT_ID=YOUR_CLARITY_ID

You can also keep these keys in `.env.example` for reference.

## 6) Verify Tracking

1. Deploy frontend with the environment variables set.
2. Open the live site (not localhost).
3. Navigate between pages.
4. Confirm GA4 receives page_view events in Realtime.
5. Confirm Clarity starts recording sessions and heatmaps.
6. Open browser console and ensure there are no analytics-related runtime errors.

## Notes

- Tracking only runs in production mode.
- Tracking does not run on localhost.
- If either ID is missing, that integration is skipped safely.
- Admin Traffic Overview will show "Connect GA4" placeholders when traffic API data is unavailable.
