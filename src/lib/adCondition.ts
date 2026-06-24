function normalizeConditionToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getAdConditionLabel(condition?: string | null): string | null {
  if (!condition) return null;

  const token = normalizeConditionToken(condition);
  if (!token) return null;

  if (token === "new" || token === "brand new" || token === "brandnew") {
    return "New";
  }

  if (token === "foreign used" || token === "foreignused") {
    return "Foreign Used";
  }

  if (token === "local used" || token === "localused") {
    return "Local Used";
  }

  if (token === "nigerian used" || token === "nigerianused") {
    return "Nigerian Used";
  }

  if (token === "used") {
    return "Used";
  }

  return toTitleCase(token);
}
