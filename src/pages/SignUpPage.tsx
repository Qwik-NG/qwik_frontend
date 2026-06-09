import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { setRole, setToken } from "../services/auth";
import FormInput from "../components/ui/FormInput";
import FormButton from "../components/ui/FormButton";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { error: showError, success } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPhoneValid = useMemo(() => /^\+?\d{10,15}$/.test(phone.replace(/\s/g, "")), [phone]);
  const canCreate = fullName.trim().length >= 2 && /\S+@\S+\.\S+/.test(email) && isPhoneValid && password.length >= 6 && acceptedLegal;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="flex items-center justify-between px-[68px] pt-[46px]">
        <button onClick={() => navigate("/")} className="text-[36px] font-normal leading-none text-[#ff8300] transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f3f5] sm:text-[40px]" type="button">
          qwik
        </button>
        <p className="text-[15px] text-[#9a99a6]">
          New here?{" "}
          <button className="text-[#ff8f00] transition-colors duration-200 hover:text-[#e67f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f3f5]" onClick={() => navigate("/signup")} type="button">
            Create an account
          </button>
        </p>
      </header>

      <main className="mx-auto flex h-[calc(100vh-124px)] w-full max-w-[1728px] items-center justify-center px-4 pb-8">
        <section className="mx-auto w-[540px] rounded-[24px] bg-white px-[26px] pb-[26px] pt-[18px]">
          <h2 className="mb-[14px] text-center text-[24px] font-normal leading-[1.1] text-[#22222b] whitespace-nowrap">
            Create a fresh account
          </h2>

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
              <Link
                to={ROUTES.TERMS}
                className="font-medium text-[#ff8f00] underline-offset-2 transition-colors hover:text-[#e67f00] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link
                to={ROUTES.PRIVACY_POLICY}
                className="font-medium text-[#ff8f00] underline-offset-2 transition-colors hover:text-[#e67f00] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          <FormButton
            disabled={!canCreate || isSubmitting}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                // TODO: send termsAcceptedAt/privacyAcceptedAt when backend supports legal consent persistence.
                const res = await api.register({ email: email.trim().toLowerCase(), password, fullName: fullName.trim(), phone: phone.trim() });
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
        </section>
      </main>
    </div>
  );
}
