import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { ROUTES, buildProductDetailsRoute } from "../constants/routes";
import { api } from "../services/api";
import type { PaymentCheckoutResponse } from "../types";

type CallbackState = "verifying" | "success" | "pending" | "failed";

function redirectTarget(payment: PaymentCheckoutResponse) {
  if (payment.status === "PAID" && payment.purpose === "AD_PROMOTION" && payment.adId) {
    return buildProductDetailsRoute(payment.adId);
  }
  if (payment.purpose === "VERIFICATION") {
    return payment.status === "PAID" ? ROUTES.GET_VERIFIED_SUCCESSFUL : ROUTES.GET_VERIFIED_PAYMENT;
  }
  return ROUTES.ADS_DASHBOARD;
}

export default function PaymentCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = useMemo(() => searchParams.get("reference")?.trim() ?? searchParams.get("trxref")?.trim() ?? "", [searchParams]);
  const [state, setState] = useState<CallbackState>("verifying");
  const [payment, setPayment] = useState<PaymentCheckoutResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function verifyPayment() {
      if (!reference) {
        setState("failed");
        setError("Missing payment reference.");
        return;
      }

      try {
        const response = await api.verifyPayment(reference);
        if (!mounted) return;
        setPayment(response.data);
        if (response.data.status === "PAID") {
          setState("success");
          window.setTimeout(() => navigate(redirectTarget(response.data), { replace: true }), 1800);
          return;
        }
        setState(response.data.status === "FAILED" || response.data.status === "CANCELLED" ? "failed" : "pending");
      } catch (err) {
        if (!mounted) return;
        setState("failed");
        setError(err instanceof Error ? err.message : "Unable to verify payment.");
      }
    }
    void verifyPayment();
    return () => {
      mounted = false;
    };
  }, [navigate, reference]);

  const title = state === "verifying" ? "Verifying payment" : state === "success" ? "Payment successful" : state === "pending" ? "Payment pending" : "Payment not completed";
  const description = state === "verifying"
    ? "Please wait while we confirm your Paystack transaction."
    : state === "success"
      ? "Your payment has been confirmed. Redirecting you now."
      : state === "pending"
        ? "Paystack has not confirmed this payment yet. You can retry verification shortly."
        : error ?? "The transaction was not successful or was cancelled.";

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />
      <main className="mx-auto flex min-h-[62vh] w-full max-w-[720px] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-full rounded-[18px] border border-[#e2e1e8] bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:p-8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff7f1f]">Paystack</p>
          <h1 className="mt-3 text-[28px] font-semibold text-[#1f1d27] sm:text-[34px]">{title}</h1>
          <p className="mt-3 text-[15px] text-[#77727f]">{description}</p>
          <p className="mt-4 break-all rounded-[12px] bg-[#f7f6fa] px-3 py-2 text-[12px] text-[#77727f]">Reference: {reference || "Unavailable"}</p>
          {payment ? <p className="mt-3 text-[13px] text-[#77727f]">Status: {payment.status}</p> : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {state === "pending" ? (
              <button type="button" onClick={() => window.location.reload()} className="rounded-[12px] bg-[#ff7f1f] px-5 py-3 text-[14px] font-semibold text-white">Retry verification</button>
            ) : null}
            {payment ? (
              <button type="button" onClick={() => navigate(redirectTarget(payment))} className="rounded-[12px] border border-[#d9d7de] px-5 py-3 text-[14px] font-semibold text-[#1f1d27]">Continue</button>
            ) : (
              <button type="button" onClick={() => navigate(ROUTES.ADS_DASHBOARD)} className="rounded-[12px] border border-[#d9d7de] px-5 py-3 text-[14px] font-semibold text-[#1f1d27]">Go to dashboard</button>
            )}
          </div>
        </div>
      </main>
      <SiteFooter navigate={navigate} />
    </div>
  );
}
