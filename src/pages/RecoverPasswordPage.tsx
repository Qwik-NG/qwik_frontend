import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { setResetToken } from "../services/auth";
import FormInput from "../components/ui/FormInput";
import FormButton from "../components/ui/FormButton";

export default function RecoverPasswordPage() {
  const navigate = useNavigate();
  const { error: showError, info } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSend = /\S+@\S+\.\S+/.test(email);

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
          <h2 className="mb-[10px] text-center text-[28px] font-normal leading-[1.05] text-[#22222b]">Recover password</h2>
          <p className="mb-[14px] text-center text-[12px] leading-[1.45] text-[#9a99a6]">
            Enter the email connected to your account, we will send you a link to create a new password
          </p>

          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            containerClassName="mb-[14px]"
          />

          <FormButton
            disabled={!canSend || isSubmitting}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                const res = await api.forgotPassword({ email: email.trim().toLowerCase() });
                if (res.data?.resetToken) {
                  setResetToken(res.data.resetToken);
                }
                info("Reset instructions are ready. Continue to create a new password.");
                navigate("/create-password");
              } catch (error) {
                showError(error instanceof Error ? error.message : "Unable to send reset request");
              } finally {
                setIsSubmitting(false);
              }
            }}
            isLoading={isSubmitting}
            loadingText="Sending..."
          >
            Send
          </FormButton>
        </section>
      </main>
    </div>
  );
}
