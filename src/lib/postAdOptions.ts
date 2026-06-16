import type { Category } from "../types";

export const POST_CATEGORY_OPTIONS = [
  { name: "Vehicles", slug: "vehicles" },
  { name: "Phones & Tablets", slug: "phones-tablets" },
  { name: "Jobs", slug: "jobs" },
  { name: "Agriculture & Food", slug: "agriculture" },
  { name: "Sports & Leisure", slug: "sports-leisure" },
  { name: "Fashion", slug: "fashion" },
  { name: "Art", slug: "art" },
  { name: "Properties", slug: "properties" },
  { name: "Furniture & Appliances", slug: "furniture-appliances" },
  { name: "Electronics", slug: "electronics" },
  { name: "Beauty", slug: "beauty" },
];

export const CONDITION_OPTIONS = ["New", "Foreign Used", "Local Used"];

const BRAND_OPTIONS_BY_SLUG: Record<string, string[]> = {
  vehicles: ["Toyota", "Mercedes-Benz", "Honda", "Lexus", "Hyundai", "Kia", "Nissan", "BMW", "Other"],
  "phones-tablets": ["Apple", "Samsung", "Tecno", "Infinix", "Xiaomi", "Oppo", "Vivo", "Huawei", "Other"],
  electronics: ["HP", "Dell", "Lenovo", "Apple", "Samsung", "LG", "Sony", "Other"],
};

const DEFAULT_BRAND_OPTIONS = ["Generic", "Other"];

const MODEL_OPTIONS_BY_BRAND: Record<string, string[]> = {
  Apple: ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "MacBook Pro", "MacBook Air", "Other"],
  Samsung: ["Galaxy S21", "Galaxy S22", "Galaxy S23", "Galaxy S24", "Other"],
  Toyota: ["Corolla", "Camry", "RAV4", "Highlander", "Other"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLA", "GLE", "Other"],
};

const CATEGORY_NAME_ALIASES: Record<string, string> = {
  car: "vehicles",
  cars: "vehicles",
  furniture: "furniture-appliances",
  "furniture & appliances": "furniture-appliances",
  phones: "phones-tablets",
  "phones & tablets": "phones-tablets",
  agriculture: "agriculture",
  agric: "agriculture",
  "agriculture & food": "agriculture",
};

export function normalizeCategorySlug(category: Pick<Category, "name" | "slug">) {
  const slug = category.slug.trim().toLowerCase();
  const name = category.name.trim().toLowerCase();
  return CATEGORY_NAME_ALIASES[slug] ?? CATEGORY_NAME_ALIASES[name] ?? slug;
}

export function getOrderedPostCategories(categories: Category[]) {
  return POST_CATEGORY_OPTIONS.map((expected) => {
    const apiCategory = categories.find((category) => normalizeCategorySlug(category) === expected.slug);
    return {
      id: apiCategory?.id ?? "",
      name: expected.name,
      slug: expected.slug,
      available: Boolean(apiCategory),
    };
  });
}

export function getCategorySlugById(categoryId: string, categories: Category[]) {
  return getOrderedPostCategories(categories).find((category) => category.id === categoryId)?.slug ?? "";
}

export function getCategoryById(categoryId: string, categories: Category[]) {
  if (!categoryId) return null;
  for (const c of categories) {
    if (c.id === categoryId) return c;
    const child = c.children?.find((k) => k.id === categoryId);
    if (child) return child;
  }
  return null;
}

export function getBrandOptions(categorySlug: string) {
  return BRAND_OPTIONS_BY_SLUG[categorySlug] ?? DEFAULT_BRAND_OPTIONS;
}

export function getModelOptions(brand: string) {
  return MODEL_OPTIONS_BY_BRAND[brand] ?? ["Other"];
}