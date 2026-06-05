import type { User } from "../types";

export type UserMetric = {
  label: string;
  value: string;
};

export type CurrentUserDisplay = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatarUrl: string;
  initials: string;
  stats: UserMetric[];
};

const DEFAULT_METRIC_VALUE = "—";

export function getUserInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "QU";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function formatMemberSince(createdAt?: string) {
  if (!createdAt) {
    return "Registered seller";
  }

  const parsedDate = new Date(createdAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Registered seller";
  }

  return `Member since ${new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(parsedDate)}`;
}

export function buildCurrentUserDisplay(user?: Partial<User> | null): CurrentUserDisplay {
  const fullName = user?.fullName?.trim() || "Qwik User";
  const email = user?.email?.trim() || "";
  const phone = user?.phone?.trim() || "";
  const location = user?.location?.trim() || "";
  const bio = user?.profile?.bio?.trim() || "";
  const avatarUrl = user?.profile?.avatarUrl?.trim() || "";

  return {
    fullName,
    email,
    phone,
    location,
    bio,
    avatarUrl,
    initials: getUserInitials(fullName),
    stats: [
      { label: "Following", value: DEFAULT_METRIC_VALUE },
      { label: "Followers", value: DEFAULT_METRIC_VALUE },
      { label: "adverts", value: DEFAULT_METRIC_VALUE },
    ],
  };
}