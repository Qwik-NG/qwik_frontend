function normalizeConditionToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

export function getAdConditionLabel(condition?: string | null): string | null {
  if (!condition) return null;

  const token = normalizeConditionToken(condition);
  if (!token) return null;

  if (token === "new" || token === "brand new" || token === "brandnew") {
    return "Brand New";
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

  return condition.trim();
}
