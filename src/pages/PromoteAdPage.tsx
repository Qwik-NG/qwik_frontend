import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { ROUTES, buildProductDetailsRoute } from "../constants/routes";
import { api } from "../services/api";
import type { Ad } from "../types";

type PromotionPlan = "top-7" | "premium-30";

const PROMOTION_PLANS: Array<{
  id: PromotionPlan;
  title: string;
  label: string;
  duration: string;
  price: string;
  helper: string;
}> = [
  {
    id: "top-7",
    title: "TOP",
    label: "Promote this ad with TOP",
    duration: "7 Days",
    price: "₦1,500",
    helper: "A simple boost for fresh visibility.",
  },
  {
    id: "premium-30",
    title: "Premium",
    label: "Promote this ad with Premium",
    duration: "30 Days",
    price: "₦4,000",
    helper: "Longer placement for higher repeat exposure.",
  },
];

function DayPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`rounded-[10px] px-3 py-1 text-[15px] ${
        active ? "bg-[#ff9a12] text-white" : "bg-badge-bg text-[#ff9715]"
      }`}
    >
      {label}
    </span>
  );
}

function LoadingState() {
  return (
    <section className="animate-pulse rounded-[24px] bg-white p-5" aria-label="Loading created advert">
      <div className="h-5 w-2/3 rounded bg-[#eeeeF2]" />
      <div className="mt-3 h-4 w-full rounded bg-[#eeeeF2]" />
      <div className="mt-2 h-4 w-4/5 rounded bg-[#eeeeF2]" />
      <div className="mt-6 h-[50px] w-full rounded-[10px] bg-[#eeeeF2]" />
      <div className="mt-5 h-[76px] w-full rounded-[10px] bg-[#eeeeF2]" />
    </section>
  );
}

export default function PromoteAdPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const adId = searchParams.get("adId")?.trim() ?? "";
  const [selectedPlan, setSelectedPlan] = useState<PromotionPlan | null>(null);
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(Boolean(adId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!adId) {
      setLoading(false);
      setError("Create an ad before choosing a promotion.");
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    api.adById(adId)
      .then((response) => {
        if (active) setAd(response.data);
      })
      .catch((err) => {
        if (active) {
          setAd(null);
          setError(err instanceof Error ? err.message : "We could not find this ad.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [adId]);

  const viewAd = () => {
    if (adId) navigate(buildProductDetailsRoute(adId));
  };

  const openPayment = (path: string) => {
    if (!adId || !ad) {
      setError("Create an ad before choosing a promotion.");
      return;
    }
    navigate(`${path}?adId=${encodeURIComponent(adId)}&plan=${encodeURIComponent(selectedPlan ?? "")}`);
  };

  const handleContinue = () => {
    if (!selectedPlan) {
      setError("Select a promotion plan to continue to payment.");
      return;
    }

    setError(null);
    openPayment(selectedPlan === "premium-30" ? ROUTES.PREMIUM_PLAN_PAYMENT : ROUTES.PLAN_PAYMENT);
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-24 pt-8 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-[430px]">
          <div className="mb-4 flex min-h-[44px] items-center rounded-card bg-white px-4 sm:px-6">
            <button
              type="button"
              onClick={() => (adId ? viewAd() : navigate(ROUTES.POST))}
              className="mr-4 min-h-10 shrink-0 text-[16px] text-[#9d99a6] sm:mr-6 sm:text-[18px]"
            >
              ‹ Back
            </button>
            <h1 className="text-[22px] font-medium sm:text-[26px]">Promote Ad</h1>
          </div>

          {loading ? (
            <LoadingState />
          ) : error || !ad ? (
            <section className="rounded-[24px] bg-white p-5 text-center">
              <h2 className="text-[20px] font-semibold">No ad ready to promote</h2>
              <p className="mt-3 text-[15px] leading-[1.5] text-[#918d99]">
                {error ?? "Create an ad before choosing a promotion."}
              </p>
              <button
                type="button"
                onClick={() => navigate(ROUTES.POST)}
                className="mt-6 h-[50px] w-full rounded-[11px] bg-gradient-to-r from-amber to-orange text-[16px] text-white shadow-glow"
              >
                Post a free ad
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.ADS_DASHBOARD)}
                className="mt-3 h-[46px] w-full rounded-[10px] border border-[#d8d8de] text-[15px] text-[#6f6c78]"
              >
                Go to my ads
              </button>
            </section>
          ) : (
            <section className="rounded-[24px] bg-white p-5">
              <div className="mb-5 rounded-[12px] bg-[#fff7ed] p-4">
                <p className="text-[14px] font-medium text-[#ff7f1f]">Your ad has been created</p>
                <h2 className="mt-1 break-words text-[18px] font-semibold">{ad.title}</h2>
                <p className="mt-2 text-[14px] leading-[1.45] text-[#918d99]">
                  Promotion is optional. Your ad is already live and can be viewed or managed without payment.
                </p>
              </div>

              <p className="mb-5 text-[16px] leading-[1.45] text-[#918d99]">
                Choose a promotion to give this ad more visibility, or skip this step.
              </p>

              <button
                type="button"
                onClick={viewAd}
                className="mb-5 flex h-[50px] w-full items-center justify-between rounded-[10px] border-2 border-orange px-3.5 text-[15px] text-[#8f8c98] sm:text-[16px]"
              >
                <span>Standard ad</span>
                <span className="text-[#57a56d]">Already live</span>
              </button>

              <div className="mb-6 space-y-4">
                {PROMOTION_PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setError(null);
                      }}
                      className={`w-full rounded-[12px] border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange ${
                        isSelected
                          ? "border-orange bg-[#fff6ea] shadow-[0_10px_24px_rgba(255,151,21,0.14)]"
                          : "border-[#d8d8de] hover:border-orange"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[14px] text-[#8f8c98] sm:text-[15px]">{plan.label}</p>
                          <p className="mt-1 text-[13px] text-[#a09ba7]">{plan.helper}</p>
                        </div>
                        <span
                          className={`mt-0.5 grid h-6 w-6 place-items-center rounded-full border text-[14px] ${
                            isSelected
                              ? "border-orange bg-orange text-white"
                              : "border-[#d0ccd6] text-transparent"
                          }`}
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex gap-2">
                          <DayPill label={plan.duration} active />
                          <DayPill label={plan.id === "top-7" ? "30 Days" : "7 Days"} />
                        </div>
                        <span className={`text-[18px] sm:text-[20px] ${isSelected ? "text-[#ff7f1f]" : "text-[#9b97a4]"}`}>
                          {plan.price}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {error ? <p className="mb-4 text-[14px] text-[#d14343]">{error}</p> : null}

              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedPlan}
                className="h-[50px] w-full rounded-[11px] bg-gradient-to-r from-amber to-orange text-[16px] text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50 sm:text-[18px]"
              >
                Continue to Payment
              </button>

              <button
                type="button"
                onClick={viewAd}
                className="mt-3 h-[50px] w-full rounded-[11px] border border-[#d8d8de] text-[16px] text-[#6f6c78] transition hover:bg-[#f4f3f6] sm:text-[18px]"
              >
                Skip and view ad
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.ADS_DASHBOARD)}
                className="mt-3 h-[46px] w-full rounded-[10px] text-[15px] text-[#6f6c78] transition hover:bg-[#f4f3f6]"
              >
                Go to my ads
              </button>
            </section>
          )}
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
