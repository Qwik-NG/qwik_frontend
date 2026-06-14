import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { PromotionPaymentMethods, type PromotionPaymentMethod } from "../components/payments/PromotionPaymentMethods";
import { ROUTES, buildProductDetailsRoute } from "../constants/routes";
import { formatNaira, getPromotionOption, getPromotionOptionFromParams, getPromotionTotal, getPromotionVat } from "../lib/promotionPlans";
import { api } from "../services/api";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.2 12.3 1.8 1.8 3.8-4" />
    </svg>
  );
}

export default function PlanPaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const adId = searchParams.get("adId")?.trim() ?? "";
  const selectedOption = getPromotionOptionFromParams(searchParams) ?? getPromotionOption("top-1-month")!;
  const vat = getPromotionVat(selectedOption.price);
  const total = getPromotionTotal(selectedOption.price);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PromotionPaymentMethod | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(adId ? null : "Choose an existing ad before starting promotion.");

  const handleCheckout = async () => {
    if (!adId) {
      setError("Choose an existing ad before starting promotion.");
      return;
    }
    if (!selectedPaymentMethod) {
      setError("Select a payment method before continuing.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);
      const response = await api.checkoutPayment({
        purpose: "AD_PROMOTION",
        adId,
        plan: selectedOption.backendPlan,
        provider: "paystack",
        paymentMethod: selectedPaymentMethod,
      });
      const checkoutUrl = response.data.checkoutUrl ?? response.data.authorization_url;
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }
      setMessage("Payment checkout could not be opened. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to prepare promotion checkout.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-14 pt-6 sm:px-6 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr]">
          <section>
            <button className="mb-5 text-[16px] text-[#9e9aa7]" onClick={() => navigate(adId ? `${ROUTES.PROMOTE_AD}?adId=${encodeURIComponent(adId)}` : ROUTES.POST)}>
              ‹ Back to Plans
            </button>

            <h1 className="text-[28px] font-semibold leading-tight sm:text-[32px]">{selectedOption.title} Plan</h1>
            <p className="mt-2 text-[16px] text-[#8d8996] sm:text-[18px]">Everything you need to grow and scale your business</p>
            <p className="mt-4 text-[32px] font-semibold leading-none sm:text-[34px]">{formatNaira(selectedOption.price)} <span className="text-[16px] font-medium text-[#1f1d27]">/ {selectedOption.durationLabel}</span></p>
            <p className="mt-2 text-[14px] text-[#ff7f1f]">Selected plan: {selectedOption.title} - {selectedOption.durationLabel}</p>
            <p className="mt-1 break-all text-[13px] text-[#8d8996]">Ad ID: {adId || "Missing ad"}</p>

            <div className="mt-5 rounded-card border border-[#d9d7de] bg-white p-5 sm:p-6">
              <ul className="space-y-4 text-[16px] sm:text-[16px]">
                {[
                  "Unlimited product listings",
                  "Advanced analytics & insights",
                  "Priority customer support",
                  "Featured vendor badge",
                  "Access to exclusive promotions",
                  "Early access to new features",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-card border border-[#d9d7de] bg-white p-5 sm:p-6">
              <div className="space-y-4 text-[16px] sm:text-[16px]">
                <div className="flex items-center justify-between"><span>{selectedOption.title} / {selectedOption.durationLabel}</span><span>{formatNaira(selectedOption.price)}</span></div>
                <div className="flex items-center justify-between"><span>VAT</span><span>{formatNaira(vat)}</span></div>
                <hr className="border-[#d9d7de]" />
                <div className="flex items-center justify-between font-semibold"><span>Total</span><span className="text-[#ff6c1c]">{formatNaira(total)}</span></div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-[#f3f3f6] p-4 text-[14px] text-[#8f8b98] sm:text-[14px]">
              <ShieldIcon />
              <p>Your payment is secure and encrypted. We do not store your card details.</p>
            </div>
          </section>

          <section className="rounded-[22px] border border-[#d9d7de] bg-white p-5 sm:p-6">
            <h2 className="text-[24px] font-semibold leading-tight sm:text-[26px]">Choose a payment method</h2>
            <p className="mt-2 text-[16px] text-[#8f8b98] sm:text-[18px]">Complete your subscription securely</p>

            <PromotionPaymentMethods selectedPaymentMethod={selectedPaymentMethod} onSelect={(method) => { setSelectedPaymentMethod(method); setError(null); }} />

            <button
              type="button"
              onClick={() => void handleCheckout()}
              disabled={!adId || !selectedPaymentMethod || submitting}
              className="mt-5 flex h-[52px] w-full items-center justify-between rounded-[12px] bg-gradient-to-r from-amber to-orange px-5 text-[18px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-[50px] sm:text-[18px]"
            >
              <span>{submitting ? "Preparing..." : "Pay Now"}</span>
              <span>{formatNaira(total)} →</span>
            </button>
            {error ? <p className="mt-3 text-[14px] text-[#d14343]">{error}</p> : null}
            {message ? (
              <div className="mt-3 rounded-[12px] bg-[#fff7ed] p-3 text-[14px] text-[#8f6c42]">
                <p>{message}</p>
                <button type="button" onClick={() => navigate(buildProductDetailsRoute(adId))} className="mt-2 font-semibold text-[#ff6b1b]">
                  View your ad
                </button>
              </div>
            ) : null}

            <p className="mt-3 text-[14px] text-[#8f8b98] sm:text-[14px]">
              By proceeding you agree to our <span className="text-[#ff6b1b]">Terms of Service</span> and <span className="text-[#ff6b1b]">Privacy policy</span>.
            </p>

            <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-[#f3f3f6] p-4 text-[14px] sm:text-[14px]">
              <ShieldIcon />
              <p>
                <span className="font-semibold text-ink">Secure payment powered by Paystack.</span>
                <br />
                <span className="text-[#8f8b98]">Your transaction is protected with industry-standard security.</span>
              </p>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
