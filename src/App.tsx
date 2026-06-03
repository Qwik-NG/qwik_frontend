import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import LoginPasswordPage from "./pages/LoginPasswordPage";
import RecoverPasswordPage from "./pages/RecoverPasswordPage";
import CreatePasswordPage from "./pages/CreatePasswordPage";
import PromoteAdPage from "./pages/PromoteAdPage";
import NotificationPage from "./pages/NotificationPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import MakeOfferPage from "./pages/MakeOfferPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import SearchResultsListPage from "./pages/SearchResultsListPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import ChatSettingsPage from "./pages/ChatSettingsPage";
import AdsDashboardPage from "./pages/AdsDashboardPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import EmailNotificationSettingsPage from "./pages/EmailNotificationSettingsPage";
import NotificationEmptyPage from "./pages/NotificationEmptyPage";
import AccountPage from "./pages/AccountPage";
import MessagesPage from "./pages/MessagesPage";
import PostPage from "./pages/PostPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import SavedPage from "./pages/SavedPage";
import NewAdvertDetailsPage from "./pages/NewAdvertDetailsPage";
import PlanPaymentPage from "./pages/PlanPaymentPage";
import PremiumPlanPaymentPage from "./pages/PremiumPlanPaymentPage";
import NotFoundPage from "./pages/NotFoundPage";
import GetVerifiedPage from "./pages/GetVerifiedPage";
import GetVerifiedBusinessInfoPage from "./pages/GetVerifiedBusinessInfoPage";
import GetVerifiedDocumentUploadPage from "./pages/GetVerifiedDocumentUploadPage";
import GetVerifiedReviewPage from "./pages/GetVerifiedReviewPage";

export default function App() {
  return (
    <Routes>
      {/* Home & Welcome */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.WELCOME} element={<WelcomePage />} />

      {/* Authentication & Access Control */}
      <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.LOGIN_PASSWORD} element={<LoginPasswordPage />} />
      <Route path={ROUTES.RECOVER_PASSWORD} element={<RecoverPasswordPage />} />
      <Route path={ROUTES.CREATE_PASSWORD} element={<CreatePasswordPage />} />

      {/* Products & Listings */}
      <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetailsPage />} />
      <Route path={ROUTES.PRODUCT_DETAILS_WITH_ID} element={<ProductDetailsPage />} />
      <Route path={ROUTES.PRODUCTS_WITH_ID} element={<ProductDetailsPage />} />
      <Route path={ROUTES.POST} element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
      <Route path={ROUTES.POST_DETAILS} element={<ProtectedRoute><PostDetailsPage /></ProtectedRoute>} />
      <Route path={ROUTES.NEW_ADVERT_DETAILS} element={<ProtectedRoute><NewAdvertDetailsPage /></ProtectedRoute>} />
      <Route path={ROUTES.PROMOTE_AD} element={<PromoteAdPage />} />
      <Route path={ROUTES.MAKE_OFFER} element={<MakeOfferPage />} />

      {/* Search & Discovery */}
      <Route path={ROUTES.SEARCH_RESULTS} element={<SearchResultsPage />} />
      <Route path={ROUTES.SEARCH_RESULTS_LIST} element={<SearchResultsListPage />} />

      {/* Dashboard & Ads Management */}
      <Route path={ROUTES.ADS_DASHBOARD} element={<ProtectedRoute><AdsDashboardPage /></ProtectedRoute>} />

      {/* Notifications */}
      <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
      <Route path={ROUTES.NOTIFICATION_EMPTY} element={<ProtectedRoute><NotificationEmptyPage /></ProtectedRoute>} />
      <Route path={ROUTES.NOTIFICATION_SETTINGS} element={<ProtectedRoute><NotificationSettingsPage /></ProtectedRoute>} />
      <Route path={ROUTES.NOTIFICATION_SETTINGS_EMAIL} element={<ProtectedRoute><EmailNotificationSettingsPage /></ProtectedRoute>} />

      {/* Settings & Account Management */}
      <Route path={ROUTES.PROFILE_SETTINGS} element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
      <Route path={ROUTES.CHAT_SETTINGS} element={<ProtectedRoute><ChatSettingsPage /></ProtectedRoute>} />
      <Route path={ROUTES.ACCOUNT} element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      <Route path={ROUTES.GET_VERIFIED} element={<ProtectedRoute><GetVerifiedPage /></ProtectedRoute>} />
      <Route path={ROUTES.GET_VERIFIED_BUSINESS_INFO} element={<ProtectedRoute><GetVerifiedBusinessInfoPage /></ProtectedRoute>} />
      <Route path={ROUTES.GET_VERIFIED_DOCUMENT_UPLOAD} element={<ProtectedRoute><GetVerifiedDocumentUploadPage /></ProtectedRoute>} />
      <Route path={ROUTES.GET_VERIFIED_REVIEW} element={<ProtectedRoute><GetVerifiedReviewPage /></ProtectedRoute>} />

      {/* Messages & Communication */}
      <Route path={ROUTES.MESSAGES} element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

      {/* Collections & Saved Items */}
      <Route path={ROUTES.SAVED} element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />

      {/* Payment & Subscriptions */}
      <Route path={ROUTES.PLAN_PAYMENT} element={<PlanPaymentPage />} />
      <Route path={ROUTES.PREMIUM_PLAN_PAYMENT} element={<PremiumPlanPaymentPage />} />

      {/* Error Pages */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
