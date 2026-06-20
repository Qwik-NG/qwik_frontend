export type CategoryBubbleGroup =
  | "agriculture"
  | "art"
  | "beauty"
  | "electronics"
  | "fashion"
  | "furniture"
  | "jobs"
  | "phones"
  | "properties"
  | "sports"
  | "vehicles";

const CATEGORY_BUBBLE_IMAGE_MAP: Record<CategoryBubbleGroup, Record<string, string>> = {
  agriculture: {
    "food-and-beverages": "/agriculture-categories/food-beverages.png",
    "farm-animals": "/agriculture-categories/farm-animals.png",
    "seeds-and-fertilizers": "/agriculture-categories/seed-and-fertilizers.png",
    "farm-machinery-and-equipment": "/agriculture-categories/farm-machinery.png",
    "farm-animal-feed-and-supplement": "/agriculture-categories/farm-animal-feed.png",
  },
  art: {
    paintings: "/art-categories/paintings.png",
    "canva-design": "/art-categories/canva-design.png",
    awards: "/art-categories/awards.png",
  },
  beauty: {
    "body-lotion": "/beauty-categories/body-lotion-64.png",
    "body-wash": "/beauty-categories/body-wash-64.png",
    "body-oils": "/beauty-categories/body-oil-64.png",
    "body-creams": "/beauty-categories/body-cream-64.png",
    "body-scrubs": "/beauty-categories/body-scrub-64.png",
    "shower-gel": "/beauty-categories/shower-gel-50.png",
  },
  electronics: {
    laptops: "/electronics-categories/laptop-48.png",
    desktop: "/electronics-categories/idesktop2-48.png",
    "desktop-computers": "/electronics-categories/idesktop2-48.png",
    server: "/electronics-categories/server-100.png",
  },
  fashion: {
    "mens-fashion": "/fashion-categories/mens-fashion-40.png",
    "womens-fashion": "/fashion-categories/womens-fashion-48.png",
    "baby-kids-fashion": "/fashion-categories/icons8-children-48.png",
  },
  furniture: {
    chairs: "/furniture-categories/chair-48.png",
    tables: "/furniture-categories/table-32.png",
    "bed-frames": "/furniture-categories/bed-frames-94.png",
    sofas: "/furniture-categories/sofa-94.png",
    "tv-stand-mount": "/furniture-categories/tv-stand-68.png",
    mattresses: "/furniture-categories/mattrass-100.png",
    wardrobes: "/furniture-categories/wardrobe-48.png",
  },
  jobs: {
    "full-time": "/jobs-categories/fulltime-jobs-64.png",
    "part-time": "/jobs-categories/parttime-jobs-64.png",
    internship: "/jobs-categories/internship-jobs-64.png",
    contract: "/jobs-categories/contract-jobs-64.png",
    remote: "/jobs-categories/remote-jobs-64.png",
    temporary: "/jobs-categories/temporary-jobs-64.png",
  },
  phones: {
    apple: "/phone-categories/apple-100.png",
    tecno: "/phone-categories/tecno.png",
    samsung: "/phone-categories/samsung-80.png",
    xiaomi: "/phone-categories/xiaomi-48.png",
    redmi: "/phone-categories/redmi.png",
  },
  properties: {
    "houses-apartments": "/properties-categories/house-48.png",
    "commercial-property": "/properties-categories/commercial-properties-64.png",
    "short-let": "/properties-categories/short-let-50.png",
    "event-centers": "/properties-categories/event-center-48.png",
    "property-services": "/properties-categories/property-service-50.png",
  },
  sports: {
    "personal-mobility": "/sport-categories/personal-mobility.png",
    "sports-equipment": "/sport-categories/sports-equipments.png",
    massagers: "/sport-categories/massagers.png",
    "musical-instrument": "/sport-categories/musical-instruments.png",
    "fitness-and-personal-training-services": "/sport-categories/fitness-personal.png",
  },
  vehicles: {
    benz: "/vehicle-categories/mercedes-benz-24.png",
    toyota: "/vehicle-categories/toyota-50.png",
    honda: "/vehicle-categories/honda-50.png",
    ford: "/vehicle-categories/icons8-ford-48.png",
    lexus: "/vehicle-categories/icons8-lexus-48.png",
    nissan: "/vehicle-categories/icons8-nissan-48.png",
    bmw: "/vehicle-categories/icons8-bmw-48.png",
    audi: "/vehicle-categories/icons8-audi-50.png",
  },
};

const CATEGORY_BUBBLE_LABEL_ALIASES: Record<CategoryBubbleGroup, Record<string, string>> = {
  agriculture: {},
  art: {},
  beauty: {
    "body wash & soap": "body-wash",
    "body oils": "body-oils",
    "body creams & milks": "body-creams",
    "body scrubs": "body-scrubs",
    "shower gel": "shower-gel",
    "body lotion": "body-lotion",
  },
  electronics: {},
  fashion: {
    "men's fashion": "mens-fashion",
    "women's fashion": "womens-fashion",
    "baby & kids fashion": "baby-kids-fashion",
    "baby and kids fashion": "baby-kids-fashion",
    "baby kids fashion": "baby-kids-fashion",
    "kids fashion": "baby-kids-fashion",
  },
  furniture: {
    "bed & frames": "bed-frames",
    "tv stand & mount": "tv-stand-mount",
    mattresses: "mattresses",
    wardrobes: "wardrobes",
  },
  jobs: {
    "full time": "full-time",
    "part time": "part-time",
  },
  phones: {},
  properties: {
    "houses & apartments": "houses-apartments",
    "commercial property": "commercial-property",
    "short let": "short-let",
    "event centers": "event-centers",
    "property services": "property-services",
  },
  sports: {},
  vehicles: {},
};

function slugifyBubbleLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategoryBubbleImage(group: CategoryBubbleGroup, label: string) {
  const normalizedLabel = label.trim().toLowerCase();
  const labelAlias = CATEGORY_BUBBLE_LABEL_ALIASES[group][normalizedLabel];
  const key = labelAlias ?? slugifyBubbleLabel(label);
  return CATEGORY_BUBBLE_IMAGE_MAP[group][key];
}

export function getBubbleInitials(label: string) {
  const tokens = label
    .replace(/&/g, " ")
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => !["and", "for", "of", "the", "to", "with"].includes(token.toLowerCase()));

  if (tokens.length === 0) {
    return label.slice(0, 2).toUpperCase();
  }

  return tokens
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");
}