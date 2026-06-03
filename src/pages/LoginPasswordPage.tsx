import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { getLoginEmail, setToken } from "../services/auth";
import FormInput from "../components/ui/FormInput";
import FormCheckbox from "../components/ui/FormCheckbox";
import FormButton from "../components/ui/FormButton";

export default function LoginPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canLogin = password.length >= 6;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="flex items-center justify-between px-[60px] pt-[48px]">
        <button onClick={() => navigate("/")} className="text-[36px] font-normal leading-none text-[#ff8300] sm:text-[40px]">
          qwik
        </button>
        <p className="text-[16px] text-[#9a99a6]">
          New here?{" "}
          <button className="text-[#ff8f00]" onClick={() => navigate("/signup")}>
            Create an account
          </button>
        </p>
      </header>

      <main className="mx-auto flex h-[calc(100vh-120px)] w-full max-w-[1728px] items-center justify-center px-4 pb-8">
        <section className="mx-auto w-[430px] rounded-[24px] bg-white px-[22px] pb-[24px] pt-[18px]">
          <h2 className="mb-[14px] whitespace-nowrap text-center text-[28px] font-normal leading-[1.05] text-[#22222b]">Log in to your account</h2>

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
            <button onClick={() => navigate("/recover-password")} className="text-[12px] text-[#9a99a6]">
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
                  window.alert("Please enter your email first.");
                  navigate("/login");
                  return;
                }
                const res = await api.login({ email, password });
                setToken(res.data.token);
                navigate("/welcome");
              } catch (error) {
                window.alert(error instanceof Error ? error.message : "Login failed");
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
