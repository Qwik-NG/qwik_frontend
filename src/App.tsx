import { Navigate, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/singin" element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
