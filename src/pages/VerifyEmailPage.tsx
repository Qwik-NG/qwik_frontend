import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { buildLoginRoute, isAlreadyVerifiedError, resolveSafeNextPath } from "../lib/emailVerification";
import { clearUserCache } from "../hooks/useUserCache";
import { api, isUnauthorizedError } from "../services/api";
import { useToast } from "../context/ToastContext";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { error: showError, success, info } = useToast();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const redirectTarget = resolveSafeNextPath(new URLSearchParams(location.search).get("next"), ROUTES.HOME);

  const resolveRetrySeconds = (message: string) => {
    const match = message.match(/(\d+)\s*seconds?/i);
    if (match) return parseInt(match[1], 10);
    if (message.toLowerCase().includes("wait") || message.toLowerCase().includes("too many")) return 60;
    return 0;
  };

  // Initialize by sending OTP on page load
  useEffect(() => {
    const sendInitialOtp = async () => {
      try {
        setIsInitializing(true);

        const me = await api.me();
        if (me.data.emailVerifiedAt) {
          info("Your email is already verified.");
          navigate(redirectTarget, { replace: true });
          return;
        }

        await api.sendVerificationOtp();
        success("Verification code sent to your email");
      } catch (error) {
        if (isUnauthorizedError(error)) {
          showError("Your session has expired. Please log in again.");
          navigate(buildLoginRoute(redirectTarget), { replace: true });
          return;
        }

        if (isAlreadyVerifiedError(error)) {
          info("Your email is already verified.");
          navigate(redirectTarget, { replace: true });
          return;
        }

        if (error instanceof Error) {
          const seconds = resolveRetrySeconds(error.message);
          if (seconds > 0) {
            setResendCooldown(seconds);
          } else {
            showError(error.message);
          }
        }
      } finally {
        setIsInitializing(false);
      }
    };

    void sendInitialOtp();
  }, [info, navigate, redirectTarget, success, showError]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      showError("Please enter a 6-digit code");
      return;
    }

    try {
      setIsVerifying(true);
      await api.verifyEmailOtp(otp);
      clearUserCache(); // Clear cache to refresh emailVerifiedAt status
      success("Email verified successfully!");
      navigate(redirectTarget || ROUTES.WELCOME, { replace: true });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        showError("Your session has expired. Please log in again.");
        navigate(buildLoginRoute(redirectTarget), { replace: true });
        return;
      }

      if (error instanceof Error) {
        const message = error.message;
        // Check if it's a lockout error (429)
        if (message.includes("too many failed attempts")) {
          showError("Too many failed attempts. Please try again in 15 minutes.");
        } else {
          showError(message);
        }
      }
      // Clear OTP on error for security
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      setIsSending(true);
      await api.resendVerificationOtp();
      success("Verification code resent to your email");
      setResendCooldown(60);
      setOtp("");
    } catch (error) {
      if (isUnauthorizedError(error)) {
        showError("Your session has expired. Please log in again.");
        navigate(buildLoginRoute(redirectTarget), { replace: true });
        return;
      }

      if (isAlreadyVerifiedError(error)) {
        info("Your email is already verified.");
        navigate(redirectTarget, { replace: true });
        return;
      }

      if (error instanceof Error) {
        const message = error.message;
        const seconds = resolveRetrySeconds(message);
        if (seconds > 0) {
          setResendCooldown(seconds);
          showError(`Please wait ${seconds} seconds before requesting a new code`);
        } else {
          showError(message);
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="min-h-screen bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="flex items-center justify-between gap-4 px-4 pt-5 sm:px-8 sm:pt-7 lg:px-[68px] lg:pt-[46px]">
        <button
          onClick={() => navigate("/")}
          className="shrink-0 text-[34px] font-normal leading-none text-[#ff8300] transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f3f5] sm:text-[40px]"
          type="button"
        >
          qwik
        </button>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-84px)] w-full max-w-[1728px] items-center justify-center px-4 py-8 sm:min-h-[calc(100dvh-100px)]">
        <section className="mx-auto w-full max-w-[540px] rounded-[24px] bg-white px-[22px] pb-[26px] pt-[18px] sm:px-[26px]">
          <h2 className="mb-[8px] text-center text-[24px] font-normal leading-[1.1] text-[#22222b]">
            Verify your email
          </h2>
          <p className="mb-[24px] text-center text-[14px] leading-[1.5] text-[#7f7e88]">
            We've sent a 6-digit code to your email address. Enter it below to verify your account.
          </p>

          {/* OTP Input */}
          <div className="mb-[16px]">
            <label className="mb-[8px] block text-[13px] font-medium text-[#4a4a52]">
              Verification Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              disabled={isVerifying || isInitializing}
              className="w-full rounded-[10px] border border-[#d1d1d6] bg-white px-[14px] py-[12px] text-center text-[20px] font-normal tracking-[0.2em] text-[#1f1f29] outline-none transition-all duration-200 placeholder:text-[#d1d1d6] disabled:bg-[#f3f3f5] disabled:text-[#9a99a6] focus:border-[#ff8f00] focus:ring-2 focus:ring-[#ffb357] focus:ring-offset-2"
              aria-label="6-digit OTP code"
              autoComplete="one-time-code"
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={otp.length !== 6 || isVerifying || isInitializing}
            className="mb-[16px] flex h-[48px] w-full items-center justify-center rounded-[10px] bg-[#ff8f00] text-[14px] font-medium text-white transition-all duration-200 disabled:bg-[#d1d1d6] disabled:text-[#9a99a6] hover:enabled:bg-[#e67f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2"
            type="button"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </button>

          {/* Resend Code Button with Cooldown */}
          <div className="mb-[16px] text-center">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isSending || isInitializing}
              className="text-[14px] font-medium text-[#ff8f00] transition-colors duration-200 hover:enabled:text-[#e67f00] disabled:text-[#d1d1d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2"
              type="button"
            >
              {isSending ? "Sending..." : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't get a code? Resend"}
            </button>
          </div>

          {/* Continue Browsing Link */}
          <p className="text-center text-[13px] text-[#7f7e88]">
            You can continue browsing while we send your code.{" "}
            <button
              onClick={() => navigate("/")}
              className="font-medium text-[#ff8f00] transition-colors hover:text-[#e67f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2"
              type="button"
            >
              Go to home
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
