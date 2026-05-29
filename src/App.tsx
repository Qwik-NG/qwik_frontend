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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
