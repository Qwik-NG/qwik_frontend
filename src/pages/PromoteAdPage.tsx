import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { FallbackImage } from "../components/ui/FallbackImage";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { ROUTES, buildProductDetailsRoute } from "../constants/routes";
import { PROMOTION_PLAN_GROUPS, formatNaira, type PromotionOption } from "../lib/promotionPlans";
import { api } from "../services/api";
import type { Ad } from "../types";

const STANDARD_AD_FEE = 2150;

const PROMOTABLE_STATUSES = new Set(["ACTIVE", "APPROVED"]);
const REVIEW_STATUSES = new Set(["DRAFT", "PENDING"]);

function getAdStatus(ad: Ad) {
  return String(ad.status ?? "ACTIVE").toUpperCase();
}

function isPromotableAd(ad: Ad) {
  return PROMOTABLE_STATUSES.has(getAdStatus(ad));
}

function isPromotionCandidate(ad: Ad) {
  const status = getAdStatus(ad);
  return PROMOTABLE_STATUSES.has(status) || REVIEW_STATUSES.has(status);
}

function getStatusLabel(ad: Ad) {
  const status = getAdStatus(ad);
  if (status === "ACTIVE") return "Active";
  if (status === "APPROVED") return "Approved";
  if (status === "PENDING") return "Pending review";
  if (status === "DRAFT") return "Under review";
  if (status === "SOLD") return "Sold";
  if (status === "ARCHIVED") return "Archived";
  return status;
}

function getPromotionAvailabilityCopy(ad: Ad) {
  return isPromotableAd(ad)
    ? "Ready to promote"
    : "Not promotable yet";
}

function DurationPill({ option, active = false, onSelect }: { option: PromotionOption; active?: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={`rounded-[10px] border px-3 py-2 text-left text-[14px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange ${
        active ? "border-orange bg-[#ff9a12] text-white shadow-[0_8px_18px_rgba(255,151,21,0.22)]" : "border-[#f1d8bd] bg-badge-bg text-[#ff9715] hover:border-orange"
      }`}
    >
      <span className="block font-semibold">{option.durationLabel}</span>
      <span className={`block text-[12px] ${active ? "text-white/85" : "text-[#8f6c42]"}`}>{formatNaira(option.price)}</span>
    </button>
  );
}

function LoadingState() {
  return (
    <section className="space-y-4" aria-label="Loading your ads">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[24px] bg-white p-5">
          <div className="h-[180px] w-full rounded-[18px] bg-[#eeeeF2]" />
          <div className="mt-4 h-5 w-2/3 rounded bg-[#eeeeF2]" />
          <div className="mt-3 h-4 w-1/2 rounded bg-[#eeeeF2]" />
          <div className="mt-2 h-4 w-1/3 rounded bg-[#eeeeF2]" />
          <div className="mt-6 h-[48px] w-full rounded-[10px] bg-[#eeeeF2]" />
        </div>
      ))}
    </section>
  );
}

function AdSelectionCard({ ad, active, onSelect }: { ad: Ad; active: boolean; onSelect: () => void }) {
  const promotable = isPromotableAd(ad);
  const imageUrl = ad.images?.[0]?.url;

  return (
    <article className={`overflow-hidden rounded-[24px] border bg-white transition ${active ? "border-orange shadow-[0_14px_32px_rgba(255,151,21,0.18)]" : "border-[#ece8f0]"}`}>
      <div className="h-[200px] w-full overflow-hidden bg-[#f6f5f8]">
        {imageUrl ? (
          <FallbackImage
            src={imageUrl}
            alt={ad.title}
            className="h-full w-full"
            fallbackClassName="h-full w-full"
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold leading-tight text-ink">{ad.title}</h2>
            <p className="mt-2 text-[18px] font-semibold text-[#22202a]">{formatNaira(ad.price)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${promotable ? "bg-[#eef8f1] text-[#2e8b57]" : "bg-[#fff6ea] text-[#b9771f]"}`}>
            {getStatusLabel(ad)}
          </span>
        </div>

        <p className="mt-3 text-[14px] text-[#77727f]">{ad.location}</p>
        <p className="mt-2 text-[14px] text-[#918d99]">{getPromotionAvailabilityCopy(ad)}</p>

        <button
          type="button"
          onClick={onSelect}
          disabled={!promotable}
          className="mt-5 h-[48px] w-full rounded-[11px] bg-gradient-to-r from-amber to-orange text-[15px] text-white shadow-glow disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#efedf1] disabled:text-[#9a95a2] disabled:shadow-none"
        >
          {promotable ? "Promote" : "Not promotable yet"}
        </button>
      </div>
    </article>
  );
}

export default function PromoteAdPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedAdId = searchParams.get("adId")?.trim() ?? "";
  const [selectedOption, setSelectedOption] = useState<PromotionOption | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedAdId, setSelectedAdId] = useState<string>(requestedAdId);
  const [userAdCount, setUserAdCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFetchError(null);

    api.getUserAds()
      .then((response) => {
        if (!active) return;

        const userAds = response.data;
        const promotionCandidates = userAds.filter(isPromotionCandidate);
        const defaultAd = requestedAdId
          ? promotionCandidates.find((item) => item.id === requestedAdId)
          : undefined;
        const firstPromotableAd = promotionCandidates.find(isPromotableAd);
        const nextSelectedAd = defaultAd?.id ?? firstPromotableAd?.id ?? promotionCandidates[0]?.id ?? "";

        setAds(promotionCandidates);
        setUserAdCount(userAds.length);
        setSelectedAdId(nextSelectedAd);

        if (requestedAdId && !defaultAd) {
          setActionError("That ad is not available to promote from your account.");
        } else {
          setActionError(null);
        }
      })
      .catch((err) => {
        if (!active) return;
        setAds([]);
        setSelectedAdId("");
        setFetchError(err instanceof Error ? err.message : "We could not load your ads.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [requestedAdId]);

  const selectedAd = ads.find((item) => item.id === selectedAdId) ?? null;
  const hasPromotableAds = ads.some(isPromotableAd);
  const standardAdIsFree = userAdCount === null || userAdCount <= 1;

  const viewAd = () => {
    if (selectedAdId) navigate(buildProductDetailsRoute(selectedAdId));
  };

  const openPayment = (option: PromotionOption) => {
    if (!selectedAd || !isPromotableAd(selectedAd)) {
      setActionError("Choose one of your promotable ads to continue.");
      return;
    }

    const params = new URLSearchParams({
      adId: selectedAd.id,
      option: option.id,
      plan: option.plan,
      duration: option.durationLabel,
      price: String(option.price),
    });
    const path = option.plan === "premium" ? ROUTES.PREMIUM_PLAN_PAYMENT : ROUTES.PLAN_PAYMENT;
    navigate(`${path}?${params.toString()}`);
  };

  const handleContinue = () => {
    if (!selectedOption) {
      setActionError("Select a promotion duration to continue to payment.");
      return;
    }

    if (!selectedAd || !isPromotableAd(selectedAd)) {
      setActionError("Choose one of your promotable ads to continue.");
      return;
    }

    setActionError(null);
    openPayment(selectedOption);
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-24 pt-8 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-[430px]">
          <div className="mb-4 flex min-h-[44px] items-center rounded-card bg-white px-4 sm:px-6">
            <button
              type="button"
              onClick={() => (selectedAdId ? viewAd() : navigate(ROUTES.ADS_DASHBOARD))}
              className="mr-4 min-h-10 shrink-0 text-[16px] text-[#9d99a6] sm:mr-6 sm:text-[18px]"
            >
              ‹ Back
            </button>
            <h1 className="text-[22px] font-medium sm:text-[26px]">Promote Ad</h1>
          </div>

          {loading ? (
            <LoadingState />
          ) : fetchError ? (
            <section className="rounded-[24px] bg-white p-5 text-center">
              <h2 className="text-[20px] font-semibold">We couldn’t load your ads</h2>
              <p className="mt-3 text-[15px] leading-[1.5] text-[#918d99]">{fetchError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 h-[50px] w-full rounded-[11px] bg-gradient-to-r from-amber to-orange text-[16px] text-white shadow-glow"
              >
                Retry
              </button>
            </section>
          ) : ads.length === 0 ? (
            <section className="rounded-[24px] bg-white p-5 text-center">
              <h2 className="text-[20px] font-semibold">No ad ready to promote</h2>
              <p className="mt-3 text-[15px] leading-[1.5] text-[#918d99]">
                You do not have any active or review-pending ads available for promotion yet.
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
            <div className="space-y-5">
              <section className="rounded-[24px] bg-white p-5">
                <div className="mb-4 rounded-[12px] bg-[#fff7ed] p-4">
                  <p className="text-[14px] font-medium text-[#ff7f1f]">Choose an ad to promote</p>
                  <h2 className="mt-1 text-[18px] font-semibold">Your ads</h2>
                  <p className="mt-2 text-[14px] leading-[1.45] text-[#918d99]">
                    Active ads can be promoted now. Ads still under review are shown here, but promotion stays locked until they go live.
                  </p>
                </div>

                <div className="space-y-4">
                  {ads.map((ad) => (
                    <AdSelectionCard
                      key={ad.id}
                      ad={ad}
                      active={ad.id === selectedAdId}
                      onSelect={() => {
                        if (!isPromotableAd(ad)) return;
                        setSelectedAdId(ad.id);
                        setSelectedOption(null);
                        setActionError(null);
                      }}
                    />
                  ))}
                </div>
              </section>

              {selectedAd ? (
                <section className="rounded-[24px] bg-white p-5">
                  <div className="mb-5 rounded-[12px] bg-[#fff7ed] p-4">
                    <p className="text-[14px] font-medium text-[#ff7f1f]">Selected ad</p>
                    <h2 className="mt-1 break-words text-[18px] font-semibold">{selectedAd.title}</h2>
                    <p className="mt-2 text-[14px] leading-[1.45] text-[#918d99]">
                      {standardAdIsFree
                        ? "Promotion is optional. Your ad is already live and can be viewed or managed without payment."
                        : "Promotion is optional. Additional standard ads cost a listing fee before standard placement."}
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
                    <span className={standardAdIsFree ? "text-[#57a56d]" : "text-[#ff7f1f]"}>
                      {standardAdIsFree ? "Already live" : formatNaira(STANDARD_AD_FEE)}
                    </span>
                  </button>

                  {!standardAdIsFree ? (
                    <p className="mb-5 rounded-[10px] bg-[#fff7ed] px-3 py-2 text-[13px] leading-[1.45] text-[#8f6c42]">
                      Standard listing payment is not available on this screen yet, so continue with a promotion plan or manage the ad from your dashboard.
                    </p>
                  ) : null}

                  <div className="mb-6 space-y-4">
                    {PROMOTION_PLAN_GROUPS.map((group) => {
                      const isSelected = selectedOption?.plan === group.plan;
                      return (
                        <div
                          key={group.plan}
                          className={`w-full rounded-[12px] border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange ${
                            isSelected
                              ? "border-orange bg-[#fff6ea] shadow-[0_10px_24px_rgba(255,151,21,0.14)]"
                              : "border-[#d8d8de] hover:border-orange"
                          }`}
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[14px] text-[#8f8c98] sm:text-[15px]">{group.label}</p>
                              <p className="mt-1 text-[13px] text-[#a09ba7]">{group.helper}</p>
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
                            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`${group.title} duration options`}>
                              {group.options.map((option) => (
                                <DurationPill
                                  key={option.id}
                                  option={option}
                                  active={selectedOption?.id === option.id}
                                  onSelect={() => {
                                    setSelectedOption(option);
                                    setActionError(null);
                                  }}
                                />
                              ))}
                            </div>
                            <span className={`text-[18px] sm:text-[20px] ${isSelected ? "text-[#ff7f1f]" : "text-[#9b97a4]"}`} aria-live="polite">
                              {isSelected && selectedOption ? formatNaira(selectedOption.price) : "Select duration"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {actionError ? <p className="mb-4 text-[14px] text-[#d14343]">{actionError}</p> : null}

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!selectedOption || !isPromotableAd(selectedAd)}
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
              ) : !hasPromotableAds ? (
                <section className="rounded-[24px] bg-white p-5 text-center">
                  <h2 className="text-[20px] font-semibold">No ad ready to promote</h2>
                  <p className="mt-3 text-[15px] leading-[1.5] text-[#918d99]">
                    Your ads are still under review. Promotion will unlock once an ad becomes active.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.ADS_DASHBOARD)}
                    className="mt-6 h-[46px] w-full rounded-[10px] border border-[#d8d8de] text-[15px] text-[#6f6c78]"
                  >
                    Go to my ads
                  </button>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
