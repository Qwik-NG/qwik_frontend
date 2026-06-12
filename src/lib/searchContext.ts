import { ROUTES } from "../constants/routes";

type CategorySearchContext = {
  name: string;
  slug: string;
  aliases: string[];
};

const CATEGORY_SEARCH_CONTEXTS: CategorySearchContext[] = [
  { name: "Vehicles", slug: "vehicles", aliases: ["vehicle", "vehicles", "car", "cars"] },
  { name: "Phones & Tablets", slug: "phones-tablets", aliases: ["phone", "phones", "tablet", "tablets", "phones & tablets"] },
  { name: "Electronics", slug: "electronics", aliases: ["electronic", "electronics"] },
  { name: "Properties", slug: "properties", aliases: ["home", "property", "properties"] },
  { name: "Furniture", slug: "furniture-appliances", aliases: ["furniture", "furnitures", "furniture & appliances"] },
  { name: "Fashion", slug: "fashion", aliases: ["fashion"] },
  { name: "Beauty", slug: "beauty", aliases: ["beauty"] },
  { name: "Jobs", slug: "jobs", aliases: ["job", "jobs"] },
];

const SEARCH_PATHS = [ROUTES.SEARCH, ROUTES.SEARCH_RESULTS, ROUTES.SEARCH_RESULTS_LIST];

export function isSearchResultsPath(pathname: string) {
  return SEARCH_PATHS.includes(pathname);
}

export function getCategorySearchContext(search: string) {
  const params = new URLSearchParams(search);
  const category = params.get("category")?.trim().toLowerCase();
  const query = params.get("q")?.trim().toLowerCase();

  return CATEGORY_SEARCH_CONTEXTS.find(
    (context) =>
      context.slug === category ||
      context.aliases.includes(category || "") ||
      (!category && context.aliases.includes(query || "")),
  ) ?? null;
}

export function isCategoryMarkerQuery(query?: string) {
  if (!query?.trim()) return false;
  return Boolean(getCategorySearchContext(`?q=${encodeURIComponent(query.trim())}`));
}
