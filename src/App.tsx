import { Navigate, Route, Routes } from "react-router-dom";
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
import MessagesPage from "./pages/MessagesPage";
import NotificationEmptyPage from "./pages/NotificationEmptyPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/singin" element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-password" element={<LoginPasswordPage />} />
      <Route path="/recover-password" element={<RecoverPasswordPage />} />
      <Route path="/create-password" element={<CreatePasswordPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/promote-ad" element={<PromoteAdPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/product-details" element={<ProductDetailsPage />} />
      <Route path="/make-offer" element={<MakeOfferPage />} />
      <Route path="/search-results" element={<SearchResultsPage />} />
      <Route path="/search-results-list" element={<SearchResultsListPage />} />
      <Route path="/profile-settings" element={<ProfileSettingsPage />} />
      <Route path="/chat-settings" element={<ChatSettingsPage />} />
      <Route path="/ads-dashboard" element={<AdsDashboardPage />} />
      <Route path="/notification-settings" element={<NotificationSettingsPage />} />
      <Route path="/notification-settings-email" element={<EmailNotificationSettingsPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/notification-empty" element={<NotificationEmptyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
