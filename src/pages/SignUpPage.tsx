import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { setRole, setToken } from "../services/auth";
import FormInput from "../components/ui/FormInput";
import FormButton from "../components/ui/FormButton";
import LegalConsentModal, { type LegalDocumentType } from "../components/auth/LegalConsentModal";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import { FacebookIcon } from "../components/icons/SocialIcons";

const LEGAL_CONSENT_VERSION = "2026-06-09";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { error: showError, success } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalDocumentType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPhoneValid = useMemo(() => /^\+?\d{10,15}$/.test(phone.replace(/\s/g, "")), [phone]);
  const canCreate = fullName.trim().length >= 2 && /\S+@\S+\.\S+/.test(email) && isPhoneValid && password.length >= 8 && acceptedLegal;

  return (
    <div className="min-h-screen bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="flex items-start justify-between gap-4 px-4 pt-5 sm:px-8 sm:pt-7 lg:px-[68px] lg:pt-[46px]">
        <button onClick={() => navigate("/")} className="shrink-0 text-[34px] font-normal leading-none text-[#ff8300] transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f3f5] sm:text-[40px]" type="button">
          qwik
        </button>
        <p className="max-w-[210px] text-right text-[13px] leading-[1.35] text-[#9a99a6] sm:max-w-none sm:text-[15px]">
          Already have an account?{" "}
          <button className="text-[#ff8f00] transition-colors duration-200 hover:text-[#e67f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f3f5]" onClick={() => navigate(ROUTES.LOGIN)} type="button">
            Log in
          </button>
        </p>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-84px)] w-full max-w-[1728px] items-center justify-center px-4 py-8 sm:min-h-[calc(100dvh-100px)]">
        <section className="mx-auto w-full max-w-[540px] rounded-[24px] bg-white px-[22px] pb-[26px] pt-[18px] sm:px-[26px]">
          <h2 className="mb-[14px] text-center text-[24px] font-normal leading-[1.1] text-[#22222b]">
            Create a fresh account
          </h2>

          <GoogleSignInButton />

          <button
            className="mb-[14px] flex h-[48px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-[10px] bg-[#3f5db2] text-[14px] text-white opacity-55 transition-all duration-200"
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
            <span className="text-[12px]">or sign up with email</span>
            <span className="h-px flex-1 bg-[#d1d1d6]" />
          </div>

          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <FormInput
            type="tel"
            placeholder="Phone no."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <FormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            disabled={!canCreate || isSubmitting}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                const res = await api.register({
                  email: email.trim().toLowerCase(),
                  password,
                  fullName: fullName.trim(),
                  phone: phone.trim(),
                  termsAccepted: true,
                  privacyAccepted: true,
                  termsVersion: LEGAL_CONSENT_VERSION,
                  privacyVersion: LEGAL_CONSENT_VERSION,
                });
                setToken(res.data.token);
                setRole(res.data.user.role);
                success("Account created successfully");
                navigate("/welcome");
              } catch (error) {
                showError(error instanceof Error ? error.message : "Sign up failed");
              } finally {
                setIsSubmitting(false);
              }
            }}
            isLoading={isSubmitting}
            loadingText="Creating..."
          >
            Create Account
          </FormButton>
          <LegalConsentModal documentType={legalModal} onClose={() => setLegalModal(null)} onAgree={() => setAcceptedLegal(true)} />
        </section>
      </main>
    </div>
  );
}
