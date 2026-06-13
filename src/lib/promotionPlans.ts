export type PromotionPlanType = "top" | "premium";
export type PromotionDuration = 7 | 30;
export type PromotionOptionId = "top-7" | "top-30" | "premium-7" | "premium-30";
export type PromotionBackendPlan = "top-7" | "premium-30";

export type PromotionOption = {
  id: PromotionOptionId;
  plan: PromotionPlanType;
  backendPlan: PromotionBackendPlan;
  title: string;
  label: string;
  duration: PromotionDuration;
  price: number;
  helper: string;
};

export const PROMOTION_OPTIONS: PromotionOption[] = [
  {
    id: "top-7",
    plan: "top",
    backendPlan: "top-7",
    title: "TOP",
    label: "Promote this ad with TOP",
    duration: 7,
    price: 1500,
    helper: "A simple boost for fresh visibility.",
  },
  {
    id: "top-30",
    plan: "top",
    backendPlan: "top-7",
    title: "TOP",
    label: "Promote this ad with TOP",
    duration: 30,
    price: 4000,
    helper: "Sustain TOP visibility for a full month.",
  },
  {
    id: "premium-7",
    plan: "premium",
    backendPlan: "premium-30",
    title: "Premium",
    label: "Promote this ad with Premium",
    duration: 7,
    price: 4000,
    helper: "High-impact placement for a focused campaign.",
  },
  {
    id: "premium-30",
    plan: "premium",
    backendPlan: "premium-30",
    title: "Premium",
    label: "Promote this ad with Premium",
    duration: 30,
    price: 10000,
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
  const duration = Number(searchParams.get("duration"));
  return PROMOTION_OPTIONS.find((item) => item.plan === plan && item.duration === duration) ?? null;
}

export function getPromotionVat(price: number) {
  return price * 0.075;
}

export function getPromotionTotal(price: number) {
  return price + getPromotionVat(price);
}