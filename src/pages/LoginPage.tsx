import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FacebookIcon } from "../components/icons/SocialIcons";
import AuthLayout from "../components/layout/AuthLayout";
import FormInput from "../components/ui/FormInput";
import FormButton from "../components/ui/FormButton";
import { setLoginEmail } from "../services/auth";
import LegalConsentModal, { type LegalDocumentType } from "../components/auth/LegalConsentModal";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalDocumentType | null>(null);
  const canContinue = /\S+@\S+\.\S+/.test(email) && acceptedLegal;

  return (
    <AuthLayout
      title="Log in to your account"
      onLogoClick={() => navigate("/")}
      onCreateAccountClick={() => navigate("/signup")}
      cardClassName="w-[430px]"
      titleClassName="whitespace-nowrap"
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

          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            containerClassName="mb-[12px]"
          />

          <label className="mb-[16px] flex items-start gap-2.5 text-[12px] leading-[1.35] text-[#7f7e88]">
            <input
              type="checkbox"
              checked={acceptedLegal}
              onChange={(e) => setAcceptedLegal(e.target.checked)}
              className="mt-[1px] h-[16px] w-[16px] shrink-0 rounded-[4px] border border-[#acabb6] bg-transparent accent-[#ff8f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            />
            <span>
              I confirm &amp; accept the{" "}
              <button
                type="button"
                onClick={() => setLegalModal("terms")}
                className="font-medium text-[#ff8f00] underline-offset-2 transition-colors hover:text-[#e67f00] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Terms of Use
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => setLegalModal("privacy")}
                className="font-medium text-[#ff8f00] underline-offset-2 transition-colors hover:text-[#e67f00] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Privacy Policy
              </button>
            </span>
          </label>

          <FormButton
            disabled={!canContinue}
            onClick={() => {
              setLoginEmail(email.trim().toLowerCase());
              navigate("/login-password");
            }}
          >
            Next
          </FormButton>
          <LegalConsentModal documentType={legalModal} onClose={() => setLegalModal(null)} onAgree={() => setAcceptedLegal(true)} />
    </AuthLayout>
  );
}
