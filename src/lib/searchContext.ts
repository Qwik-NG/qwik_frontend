import { ROUTES } from "../constants/routes";

type CategorySearchContext = {
  name: string;
  slug: string;
  aliases: string[];
};

const CATEGORY_SEARCH_CONTEXTS: CategorySearchContext[] = [
  { name: "Vehicles", slug: "vehicles", aliases: ["vehicle", "vehicles", "car", "cars"] },
  { name: "Phones & Tablets", slug: "phones-tablets", aliases: ["phone", "phones", "tablet", "tablets", "phones & tablets"] },
  { name: "Agriculture & Food", slug: "agriculture", aliases: ["agriculture", "agric", "agriculture & food", "food"] },
  { name: "Sports & Leisure", slug: "sports-leisure", aliases: ["sport", "sports", "sports & leisure", "leisure"] },
  { name: "Art", slug: "art", aliases: ["art", "arts"] },
  { name: "Electronics", slug: "electronics", aliases: ["electronic", "electronics"] },
  { name: "Properties", slug: "properties", aliases: ["home", "property", "properties"] },
  { name: "Furniture", slug: "furniture-appliances", aliases: ["furniture", "furnitures", "furniture & appliances"] },
  { name: "Fashion", slug: "fashion", aliases: ["fashion"] },
  { name: "Beauty", slug: "beauty", aliases: ["beauty"] },
  { name: "Jobs", slug: "jobs", aliases: ["job", "jobs"] },
];

const SEARCH_PATHS = [ROUTES.SEARCH, ROUTES.SEARCH_RESULTS, ROUTES.SEARCH_RESULTS_LIST];
export const ALL_NIGERIA_LOCATION = "All Nigeria";

export const NIGERIAN_LOCATIONS = [
  ALL_NIGERIA_LOCATION,
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

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

export function getLocationSearchParam(search: string) {
  const location = new URLSearchParams(search).get("location")?.trim();
  return location && location !== ALL_NIGERIA_LOCATION ? location : "";
}
