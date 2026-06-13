import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { AdminRoute } from "./components/auth/AdminRoute";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CareerPage from "./pages/CareerPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import BlogPage from "./pages/BlogPage";
import SupportPage from "./pages/SupportPage";
import FaqsPage from "./pages/FaqsPage";
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
import PublicProfilePage from "./pages/PublicProfilePage";
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
import GetVerifiedPaymentPage from "./pages/GetVerifiedPaymentPage";
import GetVerifiedSuccessfulPage from "./pages/GetVerifiedSuccessfulPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAds from "./pages/AdminAds";
import AdminReports from "./pages/AdminReports";
import AdminVerification from "./pages/AdminVerification";

export default function App() {
  return (
    <Routes>
      {/* Home & Welcome */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CAREER} element={<CareerPage />} />
      <Route path={ROUTES.TERMS} element={<TermsPage />} />
      <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
      <Route path={ROUTES.BLOG} element={<BlogPage />} />
      <Route path={ROUTES.SUPPORT} element={<SupportPage />} />
      <Route path={ROUTES.FAQS} element={<FaqsPage />} />
      <Route path={ROUTES.WELCOME} element={<WelcomePage />} />

      {/* Authentication & Access Control */}
      <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.LOGIN_PASSWORD} element={<LoginPasswordPage />} />
      <Route path={ROUTES.RECOVER_PASSWORD} element={<RecoverPasswordPage />} />
      <Route path={ROUTES.CREATE_PASSWORD} element={<CreatePasswordPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Products & Listings */}
      <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetailsPage />} />
      <Route path={ROUTES.PRODUCT_DETAILS_WITH_ID} element={<ProductDetailsPage />} />
      <Route path={ROUTES.PRODUCTS_WITH_ID} element={<ProductDetailsPage />} />
      <Route path={ROUTES.PUBLIC_USER_PROFILE} element={<PublicProfilePage />} />
      <Route path="/profile/:id" element={<PublicProfilePage />} />
      <Route path={ROUTES.POST} element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
      <Route path={ROUTES.POST_DETAILS} element={<ProtectedRoute><PostDetailsPage /></ProtectedRoute>} />
      <Route path={ROUTES.NEW_ADVERT_DETAILS} element={<ProtectedRoute><NewAdvertDetailsPage /></ProtectedRoute>} />
      <Route path={ROUTES.PROMOTE_AD} element={<ProtectedRoute><PromoteAdPage /></ProtectedRoute>} />
      <Route path={ROUTES.MAKE_OFFER} element={<MakeOfferPage />} />

      {/* Search & Discovery */}
      <Route path={ROUTES.SEARCH} element={<SearchResultsListPage />} />
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
      <Route path={ROUTES.GET_VERIFIED_PAYMENT} element={<ProtectedRoute><GetVerifiedPaymentPage /></ProtectedRoute>} />
      <Route path={ROUTES.GET_VERIFIED_SUCCESSFUL} element={<ProtectedRoute><GetVerifiedSuccessfulPage /></ProtectedRoute>} />

      {/* Messages & Communication */}
      <Route path={ROUTES.MESSAGES} element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

      {/* Collections & Saved Items */}
      <Route path={ROUTES.SAVED} element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />

      {/* Payment & Subscriptions */}
      <Route path={ROUTES.PLAN_PAYMENT} element={<ProtectedRoute><PlanPaymentPage /></ProtectedRoute>} />
      <Route path={ROUTES.PREMIUM_PLAN_PAYMENT} element={<ProtectedRoute><PremiumPlanPaymentPage /></ProtectedRoute>} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/ads" element={<AdminRoute><AdminAds /></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
      <Route path={ROUTES.ADMIN_VERIFICATION} element={<AdminRoute><AdminVerification /></AdminRoute>} />

      {/* Error Pages */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
