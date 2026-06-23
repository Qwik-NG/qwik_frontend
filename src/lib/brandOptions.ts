const DEFAULT_BRANDS = ["Generic", "Other"];

export const VEHICLE_CAR_BRANDS = [
  "Toyota",
  "Mercedes-Benz",
  "Honda",
  "Lexus",
  "Hyundai",
  "Kia",
  "Nissan",
  "BMW",
  "Audi",
  "Ford",
  "Chevrolet",
];

export const VEHICLE_MOTORCYCLE_BRANDS = [
  "Bajaj",
  "TVS",
  "Honda",
  "Haojue",
  "Qlink",
  "Suzuki",
  "Jincheng",
  "Yamaha",
  "Kawasaki",
  "BMW",
  "Electric Vehicles",
];

export const VEHICLE_BUSES_TRUCKS_BRANDS = [
  "Toyota",
  "Mercedes-Benz",
  "Mitsubishi",
  "MAN",
  "Volvo",
  "Scania",
  "Iveco",
  "Isuzu",
  "Ashok Leyland",
];

const CATEGORY_BRANDS_BY_SLUG: Record<string, string[]> = {
  "phones-tablets": ["Apple", "Samsung", "Tecno", "Infinix", "Xiaomi", "Oppo", "Vivo", "Huawei", "Google", "Nokia", "Other"],
  electronics: ["HP", "Dell", "Lenovo", "Apple", "Samsung", "LG", "Sony", "Asus", "Acer", "Toshiba", "Other"],
  fashion: ["Nike", "Adidas", "Gucci", "Louis Vuitton", "Zara", "H&M", "Puma", "Other"],
  beauty: ["Nivea", "Dove", "Neutrogena", "L'Oreal", "Maybelline", "MAC", "Black Opal", "Other"],
  "furniture-appliances": ["LG", "Samsung", "Haier", "Hisense", "Polystar", "Maxi", "Nexus", "Other"],
  properties: DEFAULT_BRANDS,
  jobs: DEFAULT_BRANDS,
  agriculture: DEFAULT_BRANDS,
  "sports-leisure": DEFAULT_BRANDS,
  art: DEFAULT_BRANDS,
};

function normalizeToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getVehicleBrandGroup(subcategoryName?: string): "cars" | "motorcycles" | "buses-trucks" {
  const token = normalizeToken(subcategoryName ?? "");
  if (!token) return "cars";

  if (
    token.includes("motor") ||
    token.includes("scooter") ||
    token.includes("bike")
  ) {
    return "motorcycles";
  }

  if (
    token.includes("bus") ||
    token.includes("truck") ||
    token.includes("lorry") ||
    token.includes("microbus") ||
    token.includes("van")
  ) {
    return "buses-trucks";
  }

  return "cars";
}

export function getVehicleBrandOptions(subcategoryName?: string): string[] {
  const group = getVehicleBrandGroup(subcategoryName);
  if (group === "motorcycles") return VEHICLE_MOTORCYCLE_BRANDS;
  if (group === "buses-trucks") return VEHICLE_BUSES_TRUCKS_BRANDS;
  return VEHICLE_CAR_BRANDS;
}

export function getVehicleBrandOptionsByType(vehicleType: string): string[] {
  if (vehicleType === "Motorcycle & Scooters") return VEHICLE_MOTORCYCLE_BRANDS;
  if (vehicleType === "Buses" || vehicleType === "Buses & Microbuses") return VEHICLE_BUSES_TRUCKS_BRANDS;
  if (vehicleType === "Car") return VEHICLE_CAR_BRANDS;
  return [];
}

export function getBrandOptionsForCategory(categorySlug: string, subcategoryName?: string): string[] {
  if (categorySlug === "vehicles") {
    return getVehicleBrandOptions(subcategoryName);
  }
  return CATEGORY_BRANDS_BY_SLUG[categorySlug] ?? DEFAULT_BRANDS;
}

export function isBrandInOptions(brand: string, options: string[]): boolean {
  const normalizedBrand = normalizeToken(brand);
  if (!normalizedBrand) return false;
  return options.some((option) => normalizeToken(option) === normalizedBrand);
}
