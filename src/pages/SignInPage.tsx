import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { FacebookIcon } from "../components/icons/SocialIcons";
import AuthLayout from "../components/layout/AuthLayout";
import { setLoginEmail } from "../services/auth";
import LegalConsentModal, { type LegalDocumentType } from "../components/auth/LegalConsentModal";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalDocumentType | null>(null);
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const canContinue = isEmailValid && acceptedLegal;

  return (
    <AuthLayout
      title="Sign in to your account"
      onLogoClick={() => navigate("/")}
      onCreateAccountClick={() => navigate("/signup")}
      cardClassName="w-[455px] rounded-[22px] px-[22px] pb-[22px] pt-[16px]"
      titleClassName="mb-[12px] text-[30px]"
    >
          <GoogleSignInButton />

          <button
            className="mb-[16px] flex h-[48px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-[10px] bg-[#3f5db2] text-[14px] text-white opacity-55 transition-all duration-200"
            type="button"
            disabled
            aria-disabled="true"
            title="Coming soon"
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

          <label className="mb-[14px] flex items-start gap-2.5 text-[12px] leading-[1.35] text-[#9a99a6]">
            <input
              type="checkbox"
              checked={acceptedLegal}
              onChange={(e) => setAcceptedLegal(e.target.checked)}
              className="mt-[1px] h-[16px] w-[16px] shrink-0 rounded-[4px] border border-[#acabb6] bg-transparent accent-[#ff8f00]"
            />
            <span>
              I confirm &amp; accept the{" "}
              <button type="button" onClick={() => setLegalModal("terms")} className="font-medium text-[#ff8f00] underline-offset-2 hover:underline">
                Terms of Use
              </button>{" "}
              and{" "}
              <button type="button" onClick={() => setLegalModal("privacy")} className="font-medium text-[#ff8f00] underline-offset-2 hover:underline">
                Privacy Policy
              </button>
            </span>
          </label>

          <button
            disabled={!canContinue}
            onClick={() => {
              setLoginEmail(email.trim().toLowerCase());
              navigate(ROUTES.LOGIN_PASSWORD);
            }}
            className={`h-[48px] w-full rounded-[10px] text-[14px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              canContinue ? "bg-[#3f5db2] text-white hover:bg-[#354aa3] active:scale-[0.99]" : "bg-[#d8d8dc] text-[#b5b4be]"
            }`}
            type="button"
          >
            Next
          </button>
          <LegalConsentModal documentType={legalModal} onClose={() => setLegalModal(null)} onAgree={() => setAcceptedLegal(true)} />
    </AuthLayout>
  );
}
