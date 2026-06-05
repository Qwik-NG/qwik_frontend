import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FacebookIcon, GoogleIcon } from "../components/icons/SocialIcons";
import AuthLayout from "../components/layout/AuthLayout";
import { useToast } from "../context/ToastContext";

export default function SignInPage() {
  const navigate = useNavigate();
  const { info } = useToast();
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const canContinue = isEmailValid && acceptedTerms;

  return (
    <AuthLayout
      title="Sign in to your account"
      onLogoClick={() => navigate("/")}
      onCreateAccountClick={() => navigate("/signup")}
      cardClassName="w-[455px] rounded-[22px] px-[22px] pb-[22px] pt-[16px]"
      titleClassName="mb-[12px] text-[30px]"
      headerClassName="px-[68px] pt-[46px]"
    >
          <button
            className="mb-[10px] flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#d9d9dc] text-[14px] text-[#20212a] transition-all duration-200 hover:bg-[#cfcfd3] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => info("Google auth UI clicked")}
            type="button"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <button
            className="mb-[16px] flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#3f5db2] text-[14px] text-white transition-all duration-200 hover:bg-[#354aa3] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => info("Facebook auth UI clicked")}
            type="button"
          >
            <FacebookIcon />
            <span>Continue with Facebook</span>
          </button>

          <div className="mb-[14px] flex items-center gap-3 text-[#7f7e88]">
            <span className="h-px flex-1 bg-[#d1d1d6]" />
            <span className="text-[12px]">or sign in with email</span>
            <span className="h-px flex-1 bg-[#d1d1d6]" />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-[12px] h-[48px] w-full rounded-[10px] border border-[#dedee1] bg-[#ececee] px-3 text-[14px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none"
          />

          <label className="mb-[14px] flex items-center gap-2.5 text-[12px] text-[#9a99a6]">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-[16px] w-[16px] rounded-[4px] border border-[#acabb6] bg-transparent"
            />
            <span>I confirm & accept the Terms of Use</span>
          </label>

          <button
            disabled={!canContinue}
            onClick={() => navigate("/")}
            className={`h-[48px] w-full rounded-[10px] text-[14px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              canContinue ? "bg-[#3f5db2] text-white hover:bg-[#354aa3] active:scale-[0.99]" : "bg-[#d8d8dc] text-[#b5b4be]"
            }`}
            type="button"
          >
            Next
          </button>
    </AuthLayout>
  );
}
