import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { getLoginEmail, setRole, setToken } from "../services/auth";
import FormInput from "../components/ui/FormInput";
import FormCheckbox from "../components/ui/FormCheckbox";
import FormButton from "../components/ui/FormButton";

export default function LoginPasswordPage() {
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canLogin = password.length >= 6;

  return (
    <div className="min-h-screen bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="flex items-start justify-between gap-4 px-4 pt-5 sm:px-8 sm:pt-7 lg:px-[60px] lg:pt-[48px]">
        <button onClick={() => navigate("/")} className="shrink-0 text-[34px] font-normal leading-none text-[#ff8300] transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f3f5] sm:text-[40px]" type="button">
          qwik
        </button>
        <p className="max-w-[210px] text-right text-[13px] leading-[1.35] text-[#9a99a6] sm:max-w-none sm:text-[16px]">
          New here?{" "}
          <button className="text-[#ff8f00] transition-colors duration-200 hover:text-[#e67f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f3f5]" onClick={() => navigate("/signup")} type="button">
            Create an account
          </button>
        </p>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-84px)] w-full max-w-[1728px] items-center justify-center px-4 py-8 sm:min-h-[calc(100dvh-100px)]">
        <section className="mx-auto w-full max-w-[430px] rounded-[24px] bg-white px-[22px] pb-[24px] pt-[18px]">
          <h2 className="mb-[14px] text-center text-[26px] font-normal leading-[1.05] text-[#22222b] sm:text-[28px]">Log in to your account</h2>

          <FormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            containerClassName="mb-[14px]"
          />

          <div className="mb-[16px] flex items-center justify-between">
            <FormCheckbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              label="Remember me"
              containerClassName="text-[12px]"
            />
            <button onClick={() => navigate("/recover-password")} className="text-[12px] text-[#9a99a6] transition-colors duration-200 hover:text-[#6f6d78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white" type="button">
              Forgot Password?
            </button>
          </div>

          <FormButton
            disabled={!canLogin || isSubmitting}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                const email = getLoginEmail();
                if (!email) {
                  showError("Please enter your email first.");
                  navigate("/login");
                  return;
                }
                const res = await api.login({ email, password });
                setToken(res.data.token);
                setRole(res.data.user.role);
                
                // Redirect based on user role and email verification status
                if (res.data.user.role === 'ADMIN') {
                  navigate("/admin");
                } else {
                  // Redirect to email verification if email not verified, otherwise to welcome
                  const isEmailVerified = res.data.user.emailVerifiedAt !== null && res.data.user.emailVerifiedAt !== undefined;
                  navigate(isEmailVerified ? "/welcome" : "/verify-email");
                }
              } catch (error) {
                showError(error instanceof Error ? error.message : "Login failed");
              } finally {
                setIsSubmitting(false);
              }
            }}
            isLoading={isSubmitting}
            loadingText="Logging in..."
          >
            Login
          </FormButton>
        </section>
      </main>
    </div>
  );
}
