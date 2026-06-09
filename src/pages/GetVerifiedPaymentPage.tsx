import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { ROUTES } from "../constants/routes";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { api } from "../services/api";
import type { VerificationApplication } from "../types";

function ShieldIllustration() {
  return (
    <div className="relative mx-auto flex h-[220px] w-[220px] items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-[#f2f5f4]" />
      <svg viewBox="0 0 220 220" className="relative h-[200px] w-[200px]" aria-hidden="true">
        <defs>
          <linearGradient id="shieldFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1fb36a" />
            <stop offset="100%" stopColor="#0f7a47" />
          </linearGradient>
          <linearGradient id="shieldBorder" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8c9c2" />
            <stop offset="100%" stopColor="#7f9a90" />
          </linearGradient>
        </defs>
        <path
          d="M110 24l60 22v48c0 46-29 78-60 92-31-14-60-46-60-92V46l60-22Z"
          fill="url(#shieldFill)"
          stroke="url(#shieldBorder)"
          strokeWidth="6"
        />
        <path
          d="M82 108l18 18 40-44"
          fill="none"
          stroke="#f4fbf7"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="110" cy="190" rx="70" ry="14" fill="#dfe7e3" />
      </svg>
    </div>
  );
}

function BenefitIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#ffe7d2] text-[#ff7f1f]">
      {children}
    </span>
  );
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.6 12.1 1.7 1.8 3.7-4" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M4 19a5 5 0 0 1 10 0" />
      <circle cx="17" cy="10" r="2" />
      <path d="M14.5 19a4 4 0 0 1 5.5-3.6" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 8h7v7" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 0 1 16 0" />
      <rect x="3" y="11" width="4" height="7" rx="2" />
      <rect x="17" y="11" width="4" height="7" rx="2" />
      <path d="M7 18c0 2.2 1.8 4 4 4h2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.6 12.1 1.7 1.8 3.7-4" />
    </svg>
  );
}

function PaystackIcon() {
  return (
    <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#f2f4fb]">
      <div className="flex flex-col gap-1">
        <span className="h-[6px] w-[18px] rounded-full bg-[#4f9cff]" />
        <span className="h-[6px] w-[18px] rounded-full bg-[#4f9cff]" />
        <span className="h-[6px] w-[18px] rounded-full bg-[#4f9cff]" />
      </div>
    </div>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#1f1d27]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10h18" />
      <path d="M5 10V20" />
      <path d="M9 10V20" />
      <path d="M15 10V20" />
      <path d="M19 10V20" />
      <path d="M3 20h18" />
      <path d="M12 4l8 6H4l8-6Z" />
    </svg>
  );
}

function PaymentLogo({ label }: { label: string }) {
  return (
    <div className="flex h-[42px] items-center justify-center rounded-[10px] bg-white px-4 text-[14px] font-semibold text-[#1f1d27] shadow-sm">
      {label}
    </div>
  );
}

export default function GetVerifiedPaymentPage() {
  const navigate = useNavigate();
  const [verification, setVerification] = useState<VerificationApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadVerification() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.verificationMe();
        if (mounted) setVerification(response.data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load verification");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadVerification();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmitForReview = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);
      if (!verification) {
        setError("Complete your verification details before continuing.");
        return;
      }
      const checkout = await api.checkoutPayment({ purpose: "VERIFICATION", verificationId: verification.id });
      if (checkout.data.checkoutUrl) {
        window.location.href = checkout.data.checkoutUrl;
        return;
      }
      await api.submitVerification(verification.id);
      setMessage("Payment record created. Provider checkout is not configured yet, so your verification was submitted for admin review.");
      navigate(ROUTES.GET_VERIFIED_SUCCESSFUL);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit verification");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "get-verified")}
          />

          <section className="min-w-0">
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "get-verified")} label="Settings" />
            </div>

            <button
              className="mb-3 flex items-center gap-2 text-[14px] text-[#9c98a5]"
              type="button"
              onClick={() => navigate(ROUTES.GET_VERIFIED_REVIEW)}
            >
              <span className="text-[16px]">&lt;</span>
              <span>Back to Verification</span>
            </button>

            <div className="max-w-[720px]">
              <h1 className="text-[30px] font-semibold text-[#1f1d27]">Purchase Verified Seller Badge</h1>
              <p className="mt-1 text-[14px] text-[#8f8b98]">
                Create a provider-ready payment record and submit your verification for admin review.
              </p>
              {loading ? <p className="mt-3 text-[13px] text-[#8f8b98]">Loading verification status...</p> : null}
              {error ? <p className="mt-3 rounded-[10px] bg-[#fff0f0] px-3 py-2 text-[13px] text-[#c24141]">{error}</p> : null}
              {message ? <p className="mt-3 rounded-[10px] bg-[#eefaf2] px-3 py-2 text-[13px] text-[#26734d]">{message}</p> : null}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.15fr]">
              <div className="space-y-5">
                <div className="rounded-card border border-[#e2e1e8] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <ShieldIllustration />

                  <div className="mt-4 text-center">
                    <h2 className="text-[20px] font-semibold text-[#1f1d27]">Verified Seller Badge</h2>
                    <p className="mt-1 text-[14px] text-[#8f8b98]">
                      Show customers you are a trusted and verified seller
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <BenefitIcon><BadgeIcon /></BenefitIcon>
                      <div>
                        <p className="text-[14px] font-semibold text-[#1f1d27]">Verified Badge</p>
                        <p className="text-[13px] text-[#8f8b98]">Display a verified badge on your store and product</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BenefitIcon><PeopleIcon /></BenefitIcon>
                      <div>
                        <p className="text-[14px] font-semibold text-[#1f1d27]">Increased Customer Trust</p>
                        <p className="text-[13px] text-[#8f8b98]">Build trust and confidence with more buyers.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BenefitIcon><TrendIcon /></BenefitIcon>
                      <div>
                        <p className="text-[14px] font-semibold text-[#1f1d27]">Higher Search Ranking</p>
                        <p className="text-[13px] text-[#8f8b98]">Rank higher in search results and get discovered.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BenefitIcon><SupportIcon /></BenefitIcon>
                      <div>
                        <p className="text-[14px] font-semibold text-[#1f1d27]">Priority Support</p>
                        <p className="text-[13px] text-[#8f8b98]">Get faster support and priority assistance.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[14px] bg-[#ffe9d2] p-4">
                    <p className="text-[13px] text-[#1f1d27]">
                      Join hundreds of trusted sellers growing their business with Verified Seller Badge.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[
                          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60",
                          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60",
                          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=60",
                          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=60",
                        ].map((src) => (
                          <img
                            key={src}
                            src={src}
                            alt="avatar"
                            className="h-[30px] w-[30px] rounded-full border-2 border-white object-cover"
                          />
                        ))}
                      </div>
                      <span className="rounded-full bg-[#ff8b2c] px-2 py-1 text-[12px] font-semibold text-white">+1.2k</span>
                      <span className="text-[12px] text-[#8f8b98]">Verified Sellers</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-[14px] bg-white p-4 text-[13px] text-[#8f8b98] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <CheckIcon />
                  <div>
                    <p className="font-medium text-[#1f1d27]">Your payment is secured and encrypted.</p>
                    <p>We do not store your card details.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-card border border-[#e2e1e8] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#1f1d27]">Payment Summary</h2>
                  <div className="mt-4 space-y-4 text-[14px] text-[#1f1d27]">
                    <div className="flex items-center justify-between">
                      <span>Verification Fee</span>
                      <span>₦5,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>VAT</span>
                      <span>₦300.00</span>
                    </div>
                    <div className="h-px w-full bg-[#e5e3ea]" />
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-[#ff7f1f]">₦5,300.00</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#eceaf0] pt-5">
                  <h3 className="text-[16px] font-semibold text-[#1f1d27]">Choose a payment method</h3>
                  <p className="mt-1 text-[13px] text-[#8f8b98]">Provider checkout is prepared but not live until payment keys are configured.</p>

                  <div className="mt-4 rounded-[14px] border border-[#ff8b2c] p-4">
                    <div className="flex items-start gap-4">
                      <span className="mt-1 h-[18px] w-[18px] rounded-full border border-[#ff8b2c] bg-[#ff8b2c]" />
                      <div className="flex flex-1 items-center gap-3">
                        <PaystackIcon />
                        <div>
                          <p className="text-[14px] font-semibold text-[#1f1d27]">Pay with Paystack</p>
                          <p className="text-[12px] text-[#8f8b98]">Cards, Bank Transfer, USSD and more</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-[12px] bg-[#f4f4f7] p-4">
                      <div className="flex flex-wrap gap-3">
                        <PaymentLogo label="VISA" />
                        <PaymentLogo label="G Pay" />
                        <PaymentLogo label="Apple Pay" />
                        <PaymentLogo label="Mastercard" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[14px] border border-[#e0dee6] p-4">
                    <div className="flex items-start gap-4">
                      <span className="mt-1 h-[18px] w-[18px] rounded-full border border-[#c7c5d0]" />
                      <div className="flex flex-1 items-center gap-3">
                        <BankIcon />
                        <div>
                          <p className="text-[14px] font-semibold text-[#1f1d27]">Pay with Bank Transfer</p>
                          <p className="text-[12px] text-[#8f8b98]">Manually transfer to our bank account.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="mt-6 flex h-[48px] w-full items-center justify-center gap-4 rounded-[12px] bg-gradient-to-r from-amber to-orange px-6 text-[15px] font-semibold text-white shadow-glow"
                    type="button"
                    onClick={handleSubmitForReview}
                    disabled={loading || submitting || !verification}
                  >
                    <span>{submitting ? "Submitting..." : "Create Payment Record & Submit"}</span>
                    <span className="text-[18px]">-&gt;</span>
                  </button>

                  <p className="mt-3 text-[12px] text-[#8f8b98]">
                    By proceeding you agree to our <span className="text-[#ff7f1f]">Terms of Service</span> and <span className="text-[#ff7f1f]">Privacy policy</span>.
                  </p>

                  <div className="mt-5 flex items-start gap-3 rounded-[14px] bg-[#f4f4f7] p-4">
                    <CheckIcon />
                    <div>
                      <p className="text-[14px] font-semibold text-[#1f1d27]">Payment provider-ready foundation.</p>
                      <p className="text-[12px] text-[#8f8b98]">No real money movement is claimed until a backend webhook confirms payment.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
