import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { getResetToken } from "../services/auth";
import FormInput from "../components/ui/FormInput";
import FormButton from "../components/ui/FormButton";

export default function CreatePasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSend = useMemo(() => {
    return newPassword.length >= 6 && confirmPassword.length >= 6 && newPassword === confirmPassword;
  }, [newPassword, confirmPassword]);

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
          <h2 className="mb-[14px] text-center text-[28px] font-normal leading-[1.05] text-[#22222b]">Create new password</h2>

          <FormInput
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <FormInput
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            containerClassName="mb-[16px]"
          />

          <FormButton
            disabled={!canSend || isSubmitting}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                const token = getResetToken();
                if (!token) {
                  window.alert("Reset session not found. Please request password reset again.");
                  navigate("/recover-password");
                  return;
                }
                await api.resetPassword({ token, password: newPassword });
                navigate("/signin");
              } catch (error) {
                window.alert(error instanceof Error ? error.message : "Failed to reset password");
              } finally {
                setIsSubmitting(false);
              }
            }}
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Send
          </FormButton>
        </section>
      </main>
    </div>
  );
}
