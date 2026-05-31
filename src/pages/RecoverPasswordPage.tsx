import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { setResetToken } from "../services/auth";

export default function RecoverPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSend = /\S+@\S+\.\S+/.test(email);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="flex items-center justify-between px-[60px] pt-[48px]">
        <button onClick={() => navigate("/")} className="text-[56px] font-normal leading-none text-[#ff8300]">
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
          <h2 className="mb-[10px] text-center text-[28px] font-normal leading-[1.05] text-[#22222b]">Recover password</h2>
          <p className="mb-[14px] text-center text-[12px] leading-[1.45] text-[#9a99a6]">
            Enter the email connected to your account, we will send you a link to create a new password
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-[14px] h-[48px] w-full rounded-[10px] border border-[#dedee1] bg-[#ececee] px-3 text-[14px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none"
          />

          <button
            disabled={!canSend || isSubmitting}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                const res = await api.forgotPassword({ email: email.trim().toLowerCase() });
                if (res.data?.resetToken) {
                  setResetToken(res.data.resetToken);
                }
                navigate("/create-password");
              } catch (error) {
                window.alert(error instanceof Error ? error.message : "Unable to send reset request");
              } finally {
                setIsSubmitting(false);
              }
            }}
            className={`h-[48px] w-full rounded-[10px] text-[14px] ${
              canSend && !isSubmitting ? "bg-[#3f5db2] text-white" : "bg-[#d8d8dc] text-[#b5b4be]"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </section>
      </main>
    </div>
  );
}
