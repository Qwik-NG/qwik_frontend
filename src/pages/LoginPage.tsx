import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FacebookIcon, GoogleIcon } from "../components/icons/SocialIcons";
import AuthLayout from "../components/layout/AuthLayout";
import FormInput from "../components/ui/FormInput";
import FormButton from "../components/ui/FormButton";
import { setLoginEmail } from "../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const canContinue = /\S+@\S+\.\S+/.test(email);

  return (
    <AuthLayout
      title="Log in to your account"
      onLogoClick={() => navigate("/")}
      onCreateAccountClick={() => navigate("/signup")}
      cardClassName="w-[430px]"
      titleClassName="whitespace-nowrap"
    >
          <button
            className="mb-[10px] flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#d9d9dc] text-[14px] text-[#20212a]"
            onClick={() => window.alert("Google login clicked")}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <button
            className="mb-[16px] flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#3f5db2] text-[14px] text-white"
            onClick={() => window.alert("Facebook login clicked")}
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
            containerClassName="mb-[16px]"
          />

          <FormButton
            disabled={!canContinue}
            onClick={() => {
              setLoginEmail(email.trim().toLowerCase());
              navigate("/login-password");
            }}
          >
            Next
          </FormButton>
    </AuthLayout>
  );
}
