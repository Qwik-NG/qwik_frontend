export type PromotionPlanType = "top" | "premium";
export type PromotionOptionId = "top-1-month" | "top-30-days" | "premium-1-month" | "premium-3-months";
export type PromotionBackendPlan = PromotionOptionId;

export type PromotionOption = {
  id: PromotionOptionId;
  plan: PromotionPlanType;
  backendPlan: PromotionBackendPlan;
  title: string;
  label: string;
  durationLabel: string;
  price: number;
  helper: string;
};

export const PROMOTION_OPTIONS: PromotionOption[] = [
  {
    id: "top-1-month",
    plan: "top",
    backendPlan: "top-1-month",
    title: "TOP",
    label: "Promote this ad with TOP",
    durationLabel: "1 Month",
    price: 9950,
    helper: "A simple boost for monthly visibility.",
  },
  {
    id: "top-30-days",
    plan: "top",
    backendPlan: "top-30-days",
    title: "TOP",
    label: "Promote this ad with TOP",
    durationLabel: "30 Days",
    price: 25850,
    helper: "Sustain TOP visibility for a focused campaign.",
  },
  {
    id: "premium-1-month",
    plan: "premium",
    backendPlan: "premium-1-month",
    title: "Premium",
    label: "Promote this ad with Premium",
    durationLabel: "1 Month",
    price: 24800,
    helper: "High-impact placement for a monthly campaign.",
  },
  {
    id: "premium-3-months",
    plan: "premium",
    backendPlan: "premium-3-months",
    title: "Premium",
    label: "Promote this ad with Premium",
    durationLabel: "3 Months",
    price: 69400,
    helper: "Longer placement for higher repeat exposure.",
  },
];

export const PROMOTION_PLAN_GROUPS = [
  {
    plan: "top" as const,
    title: "TOP",
    label: "Promote this ad with TOP",
    helper: "A simple boost for fresh visibility.",
    options: PROMOTION_OPTIONS.filter((option) => option.plan === "top"),
  },
  {
    plan: "premium" as const,
    title: "Premium",
    label: "Promote this ad with Premium",
    helper: "Higher placement for stronger repeat exposure.",
    options: PROMOTION_OPTIONS.filter((option) => option.plan === "premium"),
  },
];

export function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  })}`;
}

export function getPromotionOption(id?: string | null) {
  return PROMOTION_OPTIONS.find((option) => option.id === id) ?? null;
}

export function getPromotionOptionFromParams(searchParams: URLSearchParams) {
  const option = getPromotionOption(searchParams.get("option"));
  if (option) return option;

  const plan = searchParams.get("plan");
  const durationLabel = searchParams.get("duration") ?? searchParams.get("durationLabel");
  return PROMOTION_OPTIONS.find((item) => item.plan === plan && item.durationLabel === durationLabel) ?? null;
}

export function getPromotionVat(price: number) {
  return price * 0.075;
}

export function getPromotionTotal(price: number) {
  return price + getPromotionVat(price);
}