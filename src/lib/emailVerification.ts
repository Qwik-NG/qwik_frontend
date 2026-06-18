import { api, isEmailVerificationRequiredError } from "../services/api";
import type { User } from "../types";

type NavigateFn = (to: string, options?: { replace?: boolean }) => void;

const VERIFY_EMAIL_ROUTE = "/verify-email";

export function isAlreadyVerifiedError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return error.message.trim().toLowerCase() === "email is already verified";
}

export function buildVerifyEmailRoute(nextPath?: string) {
  if (!nextPath || nextPath === "/") return VERIFY_EMAIL_ROUTE;
  const params = new URLSearchParams({ next: nextPath });
  return `${VERIFY_EMAIL_ROUTE}?${params.toString()}`;
}

export function resolveSafeNextPath(nextParam: string | null | undefined, fallback = "/") {
  if (!nextParam) return fallback;

  try {
    const decoded = decodeURIComponent(nextParam);
    if (!decoded.startsWith("/") || decoded.startsWith("//")) return fallback;
    return decoded;
  } catch {
    return fallback;
  }
}

export async function fetchFreshCurrentUser() {
  try {
    const response = await api.me();
    return response.data;
  } catch {
    return null;
  }
}

export async function ensureFreshVerifiedEmail({
  navigate,
  nextPath,
  fallbackUser,
  onUnverified,
}: {
  navigate: NavigateFn;
  nextPath?: string;
  fallbackUser?: User | null;
  onUnverified?: () => void;
}) {
  const freshUser = await fetchFreshCurrentUser();
  const verified = Boolean(freshUser?.emailVerifiedAt || fallbackUser?.emailVerifiedAt);

  if (verified) return true;

  onUnverified?.();
  navigate(buildVerifyEmailRoute(nextPath));
  return false;
}

export async function reconcileVerificationRequiredError({
  error,
  navigate,
  nextPath,
  fallbackUser,
  onUnverified,
}: {
  error: unknown;
  navigate: NavigateFn;
  nextPath?: string;
  fallbackUser?: User | null;
  onUnverified?: () => void;
}) {
  if (!isEmailVerificationRequiredError(error)) return false;

  const verified = await ensureFreshVerifiedEmail({
    navigate,
    nextPath,
    fallbackUser,
    onUnverified,
  });

  return verified;
}
