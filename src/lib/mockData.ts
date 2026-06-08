/**
 * Mock Data Adapters
 * Shape mock data to match expected API response types
 * Ensures consistency between mock development and real backend integration
 */

import type {
  Category,
  Ad,
  User,
  SavedAd,
  Conversation,
  Message,
  Notification
} from "../types/index";

export type VehicleType = "Car" | "Buses" | "Motorcycle & Scooters" | "Buses & Microbuses";
export type VehicleCondition = "Brand New" | "Foreign Used" | "Local Used";

export type ElectronicsType = "Laptops & Computers" | "Audio & Music Equipment" | "Computer Hardware" | "Monitors";
export type ElectronicsCondition = "Brand New" | "Refurbished" | "Used";
export type PhonesType = "Mobile Phones" | "Tablet" | "Accessories for Phones and Tab" | "Smart watch";
export type PhonesCondition = "Brand New" | "Refurbished" | "Used";
export type BeautyType = "Body Lotion" | "Body Wash & Soap" | "Body Oils" | "Body Creams & Milks" | "Body Scrubs" | "Shower Gel";
export type BeautyCondition = "Brand New" | "Refurbished" | "Used";
export type FurnitureType = "Chairs" | "Tables" | "Bed & Frames" | "Sofas" | "TV Stand & Mount" | "Mattresses" | "Wardrobes";
export type FurnitureCondition = "Brand New" | "Used";
export type FashionSearchState = "general" | "men" | "women" | "baby-kids";
export type FashionCategory = "Men's Fashion" | "Women's Fashion" | "Baby & Kids Fashion";
export type FashionType = "Clothings" | "Bags" | "Jewelry" | "Shoe";
export type FashionBrand = "Nike" | "Louis vitton" | "Adidas";
export type FashionStyle = "Casual" | "Formal" | "Vintage";
export type FashionColor = "Black" | "Multi" | "White";
export type FashionCondition = "Brand New" | "Used";
export type FashionStripItem =
  | "Men's Fashion"
  | "Women's Fashion"
  | "Baby & Kids Fashion"
  | "Shirt"
  | "Suits"
  | "T-shirt & Tanks"
  | "Jeans"
  | "Active Wear"
  | "Bags"
  | "Jewelry"
  | "Dresses"
  | "Clothing set"
  | "Ball Gowns"
  | "Shoes"
  | "Caps";

export type MockVehicleListing = {
  id: string;
  ad: Ad;
  brand: "Benz" | "Toyota" | "Honda" | "Ford" | "Lexus" | "Nissan" | "BMW" | "Audi";
  vehicleType: VehicleType;
  condition: VehicleCondition;
};

export type MockElectronicsListing = {
  id: string;
  ad: Ad;
  brand: "Asus" | "Apple" | "HP" | "Dell" | "Lenovo";
  electronicsType: ElectronicsType;
  stripCategory: "Laptops" | "Desktop" | "Server";
  condition: ElectronicsCondition;
};

export type MockPhonesListing = {
  id: string;
  ad: Ad;
  brand: "Apple" | "Tecno" | "Samsung" | "Xiaomi" | "Redmi";
  phonesType: PhonesType;
  stripBrand: "Apple" | "Tecno" | "Samsung" | "Xiaomi" | "Redmi";
  condition: PhonesCondition;
};

export type MockBeautyListing = {
  id: string;
  ad: Ad;
  categoryType: "Body Care" | "Face Care" | "Vitamin and Supplement" | "Fragrance";
  beautyType: BeautyType;
  brand: "Fresh" | "Zoya" | "Clean";
  stripCategory: BeautyType;
  condition: BeautyCondition;
};

export type MockFurnitureListing = {
  id: string;
  ad: Ad;
  categoryType: "Furnitures" | "Home Appliances" | "Kitchen Appliances" | "Lighting";
  furnitureType: FurnitureType;
  room: "Bedroom" | "Kitchen" | "Home Office / Study";
  stripCategory: FurnitureType;
  condition: FurnitureCondition;
};

export type MockFashionListing = {
  id: string;
  ad: Ad;
  audience: FashionSearchState;
  categoryType: FashionCategory;
  fashionType: FashionType;
  brand: FashionBrand;
  style: FashionStyle;
  color: FashionColor;
  stripCategory: FashionStripItem;
  condition: FashionCondition;
};

export type JobCategoryType = "Full Time" | "Part Time" | "Internship";
export type JobStripType = JobCategoryType | "Contract" | "Remote" | "Temporary";

export type MockJobListing = {
  id: string;
  ad: Ad;
  categoryType: JobCategoryType;
  stripCategory: JobStripType;
};

/**
 * Mock Categories
 */
export const mockCategories: Category[] = [
  { id: "1", name: "Cars", slug: "cars", icon: "🚗" },
  { id: "2", name: "Phones", slug: "phones", icon: "📱" },
  { id: "3", name: "Jobs", slug: "jobs", icon: "💼" },
  { id: "4", name: "Agriculture", slug: "agriculture", icon: "🌾" },
  { id: "5", name: "Sports", slug: "sports", icon: "⚽" },
  { id: "6", name: "Fashion", slug: "fashion", icon: "👗" },
  { id: "7", name: "Electronics", slug: "electronics", icon: "💻" },
  { id: "8", name: "Properties", slug: "properties", icon: "🏠" },
  { id: "9", name: "Furniture", slug: "furniture", icon: "🛋️" },
  { id: "10", name: "Beauty", slug: "beauty", icon: "💄" }
];

/**
 * Mock User
 */
export const mockUser: User = {
  id: "user-1",
  email: "user@example.com",
  fullName: "John Doe",
  phone: "+234 123 456 7890",
  location: "Lagos, Nigeria",
  profile: {
    bio: "Professional seller of quality items",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    verified: true,
    verificationStatus: "verified",
    rating: 4.8,
    reviewCount: 125
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const mockUnverifiedUser: User = {
  id: "user-2",
  email: "seller@example.com",
  fullName: "Ada Seller",
  phone: "+234 987 654 3210",
  location: "Lagos, Nigeria",
  profile: {
    bio: "Trusted marketplace seller",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    verified: false,
    verificationStatus: "pending",
    rating: 4.2,
    reviewCount: 37
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Factory function to create mock ads with consistent typing
 */
export function createMockAd(
  id: string,
  title: string,
  price: number,
  description: string,
  location: string,
  imageUrl: string,
  category: Category = mockCategories[0],
  user: User = mockUser,
  overrides?: Partial<Ad>
): Ad {
  return {
    id,
    title,
    description,
    price,
    location,
    category,
    user,
    images: [{ id: "img-1", url: imageUrl, order: 1 }],
    status: "ACTIVE",
    featured: false,
    viewCount: Math.floor(Math.random() * 500),
    savedCount: Math.floor(Math.random() * 50),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    isSaved: false,
    ...overrides
  };
}

/**
 * Mock Ads - Using factory function for consistency
 */
export const mockAds: Ad[] = [
  createMockAd(
    "ad-1",
    "Mercedes-Benz GLA 250 2015 Blue",
    11000000,
    "Keyless entry Panoramic roof Led intelligent light Custom duty fully paid",
    "Abuja, Apo",
    "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1200",
    mockCategories[0]
  ),
  createMockAd(
    "ad-2",
    "Apple MacBook Pro",
    1900000,
    "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
    "Lagos, Ikeja",
    "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
    mockCategories[6]
  ),
  createMockAd(
    "ad-3",
    "4bdrm Duplex in Lekki",
    85500000,
    "A Well Built and Spacious 4bedroom Semi Detached",
    "Lagos, Lekki",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    mockCategories[7]
  ),
  createMockAd(
    "ad-4",
    "Furnished 5bdrm Duplex in Port-Harcourt",
    90800000,
    "Superb design 5 bedroom duplex in a gated community with good road network",
    "Rivers, Port-Harcourt",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
    mockCategories[7]
  ),
  createMockAd(
    "ad-5",
    "iPhone 15 Pro Max 256GB",
    1850000,
    "Factory unlocked iPhone with battery health at 100 percent and complete accessories.",
    "Lagos, Ikeja",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200",
    mockCategories[1],
    mockUser
  ),
  createMockAd(
    "ad-6",
    "Samsung Galaxy S24 Ultra",
    1420000,
    "Premium Android phone with S Pen support, clean screen and original box.",
    "Abuja, Wuse",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200",
    mockCategories[1],
    mockUnverifiedUser
  ),
  createMockAd(
    "ad-7",
    "Women Fashion Two Piece Set",
    95000,
    "Elegant fashion set for outings, made with premium fabric and neat finishing.",
    "Lagos, Yaba",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
    mockCategories[5],
    mockUnverifiedUser
  ),
  createMockAd(
    "ad-8",
    "Men Fashion Senator Wear",
    120000,
    "Tailored senator wear available in multiple colors for events and office use.",
    "Abuja, Gwarinpa",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200",
    mockCategories[5],
    mockUser
  ),
  createMockAd(
    "ad-9",
    "3 Bedroom Apartment in Home Estate",
    42000000,
    "Modern home apartment with fitted kitchen, wardrobes, and steady power supply.",
    "Lagos, Ajah",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
    mockCategories[7],
    mockUser
  )
];

// TODO: Replace this frontend-only vehicle search data with backend search facets once category filters are API-backed.
export const mockVehicleListings: MockVehicleListing[] = [
  {
    id: "vehicle-1",
    brand: "Benz",
    vehicleType: "Car",
    condition: "Foreign Used",
    ad: createMockAd(
      "vehicle-ad-1",
      "Mercedes-Benz GLA 250 2015 Blue",
      11000000,
      "Keyless entry panoramic roof LED intelligent light custom duty fully paid. This is a very sharp ride.",
      "Abuja, Apo",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200",
      mockCategories[0],
      mockUnverifiedUser,
    ),
  },
  {
    id: "vehicle-2",
    brand: "Toyota",
    vehicleType: "Car",
    condition: "Foreign Used",
    ad: createMockAd(
      "vehicle-ad-2",
      "Toyota Camry 2015 White",
      11000000,
      "Keyless entry panoramic roof LED intelligent light custom duty fully paid. This is a very sharp ride.",
      "Abuja, Apo",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200",
      mockCategories[0],
      mockUser,
    ),
  },
  {
    id: "vehicle-3",
    brand: "BMW",
    vehicleType: "Car",
    condition: "Brand New",
    ad: createMockAd(
      "vehicle-ad-3",
      "BMW 2024 Model White",
      11000000,
      "Keyless entry panoramic roof LED intelligent light custom duty fully paid. This is a very sharp ride.",
      "Abuja, Apo",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200",
      mockCategories[0],
      mockUnverifiedUser,
    ),
  },
  {
    id: "vehicle-4",
    brand: "Nissan",
    vehicleType: "Car",
    condition: "Brand New",
    ad: createMockAd(
      "vehicle-ad-4",
      "Nissan 2025 Model Black",
      11000000,
      "Keyless entry panoramic roof LED intelligent light custom duty fully paid. This is a very sharp ride.",
      "Abuja, Apo",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200",
      mockCategories[0],
      mockUnverifiedUser,
    ),
  },
  {
    id: "vehicle-5",
    brand: "Benz",
    vehicleType: "Car",
    condition: "Foreign Used",
    ad: createMockAd(
      "vehicle-ad-5",
      "Mercedes-Benz GLA 250 2015 Blue",
      11000000,
      "Keyless entry panoramic roof LED intelligent light custom duty fully paid. This is a very sharp ride.",
      "Abuja, Apo",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200",
      mockCategories[0],
      mockUnverifiedUser,
    ),
  },
  {
    id: "vehicle-6",
    brand: "Honda",
    vehicleType: "Car",
    condition: "Local Used",
    ad: createMockAd(
      "vehicle-ad-6",
      "Honda 2016 Red",
      11000000,
      "Keyless entry panoramic roof LED intelligent light custom duty fully paid. This is a very sharp ride.",
      "Abuja, Apo",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
      mockCategories[0],
      mockUser,
    ),
  },
  {
    id: "vehicle-7",
    brand: "Benz",
    vehicleType: "Car",
    condition: "Foreign Used",
    ad: createMockAd(
      "vehicle-ad-7",
      "Mercedes-Benz GLA 250 2015 Blue",
      11000000,
      "Keyless entry panoramic roof LED intelligent light custom duty fully paid. This is a very sharp ride.",
      "Abuja, Apo",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200",
      mockCategories[0],
      mockUnverifiedUser,
    ),
  },
  {
    id: "vehicle-8",
    brand: "Lexus",
    vehicleType: "Car",
    condition: "Foreign Used",
    ad: createMockAd(
      "vehicle-ad-8",
      "Lexus RX350 Jeep Black",
      11000000,
      "Keyless entry panoramic roof LED intelligent light custom duty fully paid. This is a very sharp ride.",
      "Abuja, Apo",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200",
      mockCategories[0],
      mockUser,
    ),
  },
  {
    id: "vehicle-9",
    brand: "Benz",
    vehicleType: "Car",
    condition: "Foreign Used",
    ad: createMockAd(
      "vehicle-ad-9",
      "Mercedes-Benz GLA 250 2015 Blue",
      11000000,
      "Keyless entry panoramic roof LED intelligent light custom duty fully paid. This is a very sharp ride.",
      "Abuja, Apo",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200",
      mockCategories[0],
      mockUnverifiedUser,
    ),
  },
  {
    id: "vehicle-10",
    brand: "Toyota",
    vehicleType: "Buses",
    condition: "Local Used",
    ad: createMockAd(
      "vehicle-ad-10",
      "Toyota Coaster Bus Silver",
      14500000,
      "Reliable transport bus with clean interior, cold AC, and strong engine performance.",
      "Lagos, Mile 2",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200",
      mockCategories[0],
      mockUnverifiedUser,
    ),
  },
  {
    id: "vehicle-11",
    brand: "Honda",
    vehicleType: "Motorcycle & Scooters",
    condition: "Brand New",
    ad: createMockAd(
      "vehicle-ad-11",
      "Honda Scooter 2024 Blue",
      3800000,
      "Fuel-efficient scooter with modern dashboard, low mileage, and smooth handling.",
      "Lagos, Surulere",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200",
      mockCategories[0],
      mockUser,
    ),
  },
  {
    id: "vehicle-12",
    brand: "Ford",
    vehicleType: "Buses & Microbuses",
    condition: "Foreign Used",
    ad: createMockAd(
      "vehicle-ad-12",
      "Ford Transit 2020 White",
      9800000,
      "Clean microbus with spacious cabin, strong suspension, and long-distance comfort.",
      "Abuja, Kubwa",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200",
      mockCategories[0],
      mockUser,
    ),
  },
];

// TODO: Replace electronics mock listings with backend API data.
// TODO: Replace electronics filters with backend categories.
export const mockElectronicsListings: MockElectronicsListing[] = [
  {
    id: "electronics-1",
    brand: "Apple",
    electronicsType: "Laptops & Computers",
    stripCategory: "Laptops",
    condition: "Brand New",
    ad: createMockAd(
      "electronics-ad-1",
      "Apple MacBook Pro",
      1900000,
      "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
      mockCategories[6],
      mockUser,
    ),
  },
  {
    id: "electronics-2",
    brand: "Apple",
    electronicsType: "Laptops & Computers",
    stripCategory: "Laptops",
    condition: "Brand New",
    ad: createMockAd(
      "electronics-ad-2",
      "Apple MacBook Pro",
      1900000,
      "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
      mockCategories[6],
      mockUnverifiedUser,
    ),
  },
  {
    id: "electronics-3",
    brand: "Apple",
    electronicsType: "Laptops & Computers",
    stripCategory: "Laptops",
    condition: "Brand New",
    ad: createMockAd(
      "electronics-ad-3",
      "Apple MacBook Pro",
      1900000,
      "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
      mockCategories[6],
      mockUnverifiedUser,
    ),
  },
  {
    id: "electronics-4",
    brand: "Apple",
    electronicsType: "Laptops & Computers",
    stripCategory: "Laptops",
    condition: "Brand New",
    ad: createMockAd(
      "electronics-ad-4",
      "Apple MacBook Pro",
      1900000,
      "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
      mockCategories[6],
      mockUser,
    ),
  },
  {
    id: "electronics-5",
    brand: "Apple",
    electronicsType: "Laptops & Computers",
    stripCategory: "Laptops",
    condition: "Brand New",
    ad: createMockAd(
      "electronics-ad-5",
      "Apple MacBook Pro",
      1900000,
      "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
      mockCategories[6],
      mockUnverifiedUser,
    ),
  },
  {
    id: "electronics-6",
    brand: "Apple",
    electronicsType: "Laptops & Computers",
    stripCategory: "Laptops",
    condition: "Brand New",
    ad: createMockAd(
      "electronics-ad-6",
      "Apple MacBook Pro",
      1900000,
      "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
      mockCategories[6],
      mockUser,
    ),
  },
  {
    id: "electronics-7",
    brand: "Apple",
    electronicsType: "Laptops & Computers",
    stripCategory: "Laptops",
    condition: "Brand New",
    ad: createMockAd(
      "electronics-ad-7",
      "Apple MacBook Pro",
      1900000,
      "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
      mockCategories[6],
      mockUser,
    ),
  },
  {
    id: "electronics-8",
    brand: "Asus",
    electronicsType: "Laptops & Computers",
    stripCategory: "Laptops",
    condition: "Brand New",
    ad: createMockAd(
      "electronics-ad-8",
      "Asus ROG Laptop",
      1750000,
      "Gaming laptop Asus ROG with powerful graphics, 16GB RAM, and fast SSD storage.",
      "Abuja, Wuse",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1200",
      mockCategories[6],
      mockUnverifiedUser,
    ),
  },
  {
    id: "electronics-9",
    brand: "HP",
    electronicsType: "Laptops & Computers",
    stripCategory: "Laptops",
    condition: "Refurbished",
    ad: createMockAd(
      "electronics-ad-9",
      "HP EliteBook",
      890000,
      "HP EliteBook business laptop with clean body, strong battery life, and SSD performance.",
      "Port Harcourt, GRA",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200",
      mockCategories[6],
      mockUser,
    ),
  },
  {
    id: "electronics-10",
    brand: "Dell",
    electronicsType: "Monitors",
    stripCategory: "Desktop",
    condition: "Used",
    ad: createMockAd(
      "electronics-ad-10",
      "Dell XPS Desktop",
      1250000,
      "Dell XPS desktop setup with monitor, keyboard, and strong processor for office work.",
      "Lagos, Yaba",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1200",
      mockCategories[6],
      mockUnverifiedUser,
    ),
  },
  {
    id: "electronics-11",
    brand: "Lenovo",
    electronicsType: "Computer Hardware",
    stripCategory: "Server",
    condition: "Refurbished",
    ad: createMockAd(
      "electronics-ad-11",
      "Lenovo ThinkPad",
      980000,
      "Reliable Lenovo ThinkPad with clean keyboard, solid build quality, and fast startup speed.",
      "Ibadan, Ring Road",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
      mockCategories[6],
      mockUser,
    ),
  },
];

// TODO: Replace phones/tablets mock listings with backend API data.
// TODO: Replace phones/tablets filters with backend categories.
export const mockPhonesListings: MockPhonesListing[] = [
  {
    id: "phones-1",
    brand: "Samsung",
    stripBrand: "Samsung",
    phonesType: "Mobile Phones",
    condition: "Brand New",
    ad: createMockAd(
      "phones-ad-1",
      "Samsung Galaxy S24 Ultra",
      1900000,
      "New Samsung Galaxy flagship with 256GB storage, vibrant display, and clean accessories.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200",
      mockCategories[1],
      mockUser,
    ),
  },
  {
    id: "phones-2",
    brand: "Samsung",
    stripBrand: "Samsung",
    phonesType: "Mobile Phones",
    condition: "Brand New",
    ad: createMockAd(
      "phones-ad-2",
      "Samsung Galaxy A55",
      820000,
      "Brand new Samsung phone with premium camera, long battery life, and strong performance.",
      "Abuja, Wuse",
      "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=1200",
      mockCategories[1],
      mockUnverifiedUser,
    ),
  },
  {
    id: "phones-3",
    brand: "Apple",
    stripBrand: "Apple",
    phonesType: "Mobile Phones",
    condition: "Brand New",
    ad: createMockAd(
      "phones-ad-3",
      "Apple iPhone 15 Pro Max",
      1900000,
      "Factory sealed iPhone 15 Pro Max with 256GB storage, Face ID, and original charger.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200",
      mockCategories[1],
      mockUser,
    ),
  },
  {
    id: "phones-4",
    brand: "Apple",
    stripBrand: "Apple",
    phonesType: "Mobile Phones",
    condition: "Used",
    ad: createMockAd(
      "phones-ad-4",
      "Apple iPhone 14 Pro",
      1250000,
      "Neatly used iPhone 14 Pro with strong battery health and flawless screen condition.",
      "Port Harcourt, GRA",
      "https://images.unsplash.com/photo-1678911820864-e4c567c655d7?w=1200",
      mockCategories[1],
      mockUnverifiedUser,
    ),
  },
  {
    id: "phones-5",
    brand: "Tecno",
    stripBrand: "Tecno",
    phonesType: "Mobile Phones",
    condition: "Brand New",
    ad: createMockAd(
      "phones-ad-5",
      "Tecno Camon 30",
      420000,
      "Latest Tecno phone with sharp camera, bright display, and all accessories included.",
      "Benin, GRA",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1200",
      mockCategories[1],
      mockUser,
    ),
  },
  {
    id: "phones-6",
    brand: "Xiaomi",
    stripBrand: "Xiaomi",
    phonesType: "Mobile Phones",
    condition: "Refurbished",
    ad: createMockAd(
      "phones-ad-6",
      "Xiaomi 13 Pro",
      760000,
      "Refurbished Xiaomi phone with Leica camera system, smooth screen, and clean body.",
      "Ibadan, Ring Road",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200",
      mockCategories[1],
      mockUnverifiedUser,
    ),
  },
  {
    id: "phones-7",
    brand: "Redmi",
    stripBrand: "Redmi",
    phonesType: "Mobile Phones",
    condition: "Brand New",
    ad: createMockAd(
      "phones-ad-7",
      "Redmi Note 13 Pro",
      510000,
      "Brand new Redmi device with clean design, fast charging, and boxed accessories.",
      "Enugu, Independence Layout",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=1200",
      mockCategories[1],
      mockUser,
    ),
  },
  {
    id: "phones-8",
    brand: "Samsung",
    stripBrand: "Samsung",
    phonesType: "Tablet",
    condition: "Brand New",
    ad: createMockAd(
      "phones-ad-8",
      "Samsung Galaxy Tab S9",
      980000,
      "Premium Samsung tablet with stylus, AMOLED display, and strong multitasking performance.",
      "Abuja, Jabi",
      "https://images.unsplash.com/photo-1589739900243-4b52cd9dd4a2?w=1200",
      mockCategories[1],
      mockUser,
    ),
  },
  {
    id: "phones-9",
    brand: "Apple",
    stripBrand: "Apple",
    phonesType: "Accessories for Phones and Tab",
    condition: "Brand New",
    ad: createMockAd(
      "phones-ad-9",
      "Apple MagSafe Charger",
      85000,
      "Original MagSafe wireless charger for iPhone with fast and secure magnetic snap.",
      "Lagos, Lekki",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200",
      mockCategories[1],
      mockUnverifiedUser,
    ),
  },
  {
    id: "phones-10",
    brand: "Tecno",
    stripBrand: "Tecno",
    phonesType: "Smart watch",
    condition: "Brand New",
    ad: createMockAd(
      "phones-ad-10",
      "Tecno Smart Watch Pro",
      120000,
      "Brand new Tecno smart watch with fitness tracking, long battery, and colorful display.",
      "Lagos, Surulere",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200",
      mockCategories[1],
      mockUser,
    ),
  },
];

// TODO: Replace beauty mock listings with backend API data.
// TODO: Replace beauty filters with backend categories.
export const mockBeautyListings: MockBeautyListing[] = [
  {
    id: "beauty-1",
    categoryType: "Body Care",
    beautyType: "Body Lotion",
    stripCategory: "Body Lotion",
    brand: "Fresh",
    condition: "Brand New",
    ad: createMockAd(
      "beauty-ad-1",
      "Dreamz Body Care",
      1900000,
      "Rich body lotion set with smooth finish, long moisture retention, and gentle daily use.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200",
      mockCategories[9],
      mockUser,
    ),
  },
  {
    id: "beauty-2",
    categoryType: "Body Care",
    beautyType: "Body Wash & Soap",
    stripCategory: "Body Wash & Soap",
    brand: "Zoya",
    condition: "Brand New",
    ad: createMockAd(
      "beauty-ad-2",
      "Body Wash & Soap",
      260000,
      "Refreshing body wash bundle with soft fragrance, foamy texture, and skin-friendly formula.",
      "Abuja, Wuse",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200",
      mockCategories[9],
      mockUnverifiedUser,
    ),
  },
  {
    id: "beauty-3",
    categoryType: "Body Care",
    beautyType: "Body Oils",
    stripCategory: "Body Oils",
    brand: "Clean",
    condition: "Brand New",
    ad: createMockAd(
      "beauty-ad-3",
      "Body Oil",
      180000,
      "Lightweight body oil for deep nourishment, glow enhancement, and everyday skin care.",
      "Lagos, Lekki",
      "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=1200",
      mockCategories[9],
      mockUser,
    ),
  },
  {
    id: "beauty-4",
    categoryType: "Body Care",
    beautyType: "Body Creams & Milks",
    stripCategory: "Body Creams & Milks",
    brand: "Fresh",
    condition: "Brand New",
    ad: createMockAd(
      "beauty-ad-4",
      "Body Cream",
      230000,
      "Softening body cream with rich texture, all-day hydration, and non-greasy finish.",
      "Port Harcourt, GRA",
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=1200",
      mockCategories[9],
      mockUser,
    ),
  },
  {
    id: "beauty-5",
    categoryType: "Body Care",
    beautyType: "Body Scrubs",
    stripCategory: "Body Scrubs",
    brand: "Zoya",
    condition: "Refurbished",
    ad: createMockAd(
      "beauty-ad-5",
      "Body Scrub",
      150000,
      "Exfoliating body scrub with fresh scent and gentle granules for smoother skin tone.",
      "Benin, GRA",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200",
      mockCategories[9],
      mockUnverifiedUser,
    ),
  },
  {
    id: "beauty-6",
    categoryType: "Body Care",
    beautyType: "Shower Gel",
    stripCategory: "Shower Gel",
    brand: "Clean",
    condition: "Brand New",
    ad: createMockAd(
      "beauty-ad-6",
      "Shower Gel",
      125000,
      "Cleansing shower gel with bright scent, balanced moisture, and smooth after-feel.",
      "Ibadan, Ring Road",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200",
      mockCategories[9],
      mockUser,
    ),
  },
  {
    id: "beauty-7",
    categoryType: "Face Care",
    beautyType: "Body Lotion",
    stripCategory: "Body Lotion",
    brand: "Fresh",
    condition: "Brand New",
    ad: createMockAd(
      "beauty-ad-7",
      "Skincare Set",
      320000,
      "Complete skincare set with toner, serum, and moisturizer for a clean daily routine.",
      "Lagos, Yaba",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200",
      mockCategories[9],
      mockUser,
    ),
  },
  {
    id: "beauty-8",
    categoryType: "Vitamin and Supplement",
    beautyType: "Body Oils",
    stripCategory: "Body Oils",
    brand: "Clean",
    condition: "Used",
    ad: createMockAd(
      "beauty-ad-8",
      "Body Care Vitamins",
      90000,
      "Supplement bundle curated for wellness support, skin glow, and daily body care routine.",
      "Abuja, Garki",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200",
      mockCategories[9],
      mockUnverifiedUser,
    ),
  },
  {
    id: "beauty-9",
    categoryType: "Fragrance",
    beautyType: "Shower Gel",
    stripCategory: "Shower Gel",
    brand: "Zoya",
    condition: "Brand New",
    ad: createMockAd(
      "beauty-ad-9",
      "Body Mist Combo",
      140000,
      "Layered fragrance combo with shower gel and mist for a lasting clean scent.",
      "Enugu, Independence Layout",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200",
      mockCategories[9],
      mockUser,
    ),
  },
];

// TODO: Replace furniture listings with backend API data
// TODO: Replace furniture categories with backend-driven data
export const mockFurnitureListings: MockFurnitureListing[] = [
  {
    id: "furniture-1",
    categoryType: "Furnitures",
    furnitureType: "Bed & Frames",
    room: "Bedroom",
    stripCategory: "Bed & Frames",
    condition: "Brand New",
    ad: createMockAd(
      "furniture-ad-1",
      "Luxury Bedroom Set",
      1900000,
      "Long lasting materials and soft mattress with padded headboard, matching stool, and warm bedside lighting.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      mockCategories[8],
      mockUser,
    ),
  },
  {
    id: "furniture-2",
    categoryType: "Furnitures",
    furnitureType: "Sofas",
    room: "Home Office / Study",
    stripCategory: "Sofas",
    condition: "Brand New",
    ad: createMockAd(
      "furniture-ad-2",
      "Modern Sofa",
      1900000,
      "Modern sofa with soft neutral upholstery, compact profile, and clean contemporary lines for elegant living rooms.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      mockCategories[8],
      mockUser,
    ),
  },
  {
    id: "furniture-3",
    categoryType: "Furnitures",
    furnitureType: "Tables",
    room: "Kitchen",
    stripCategory: "Tables",
    condition: "Brand New",
    ad: createMockAd(
      "furniture-ad-3",
      "Dining Table Set",
      1900000,
      "Long lasting wood dining table set with refined finish, balanced proportions, and easy-clean top surface.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      mockCategories[8],
      mockUnverifiedUser,
    ),
  },
  {
    id: "furniture-4",
    categoryType: "Furnitures",
    furnitureType: "Chairs",
    room: "Home Office / Study",
    stripCategory: "Chairs",
    condition: "Brand New",
    ad: createMockAd(
      "furniture-ad-4",
      "Office Chair",
      1900000,
      "Ergonomic office chair with supportive seat, durable frame, and smooth rolling base for daily work use.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=1200",
      mockCategories[8],
      mockUser,
    ),
  },
  {
    id: "furniture-5",
    categoryType: "Furnitures",
    furnitureType: "TV Stand & Mount",
    room: "Home Office / Study",
    stripCategory: "TV Stand & Mount",
    condition: "Used",
    ad: createMockAd(
      "furniture-ad-5",
      "TV Stand",
      1900000,
      "Minimal TV stand with layered storage, sturdy base, and muted finish for a clean entertainment setup.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1582582429416-f2ef8f0f5bce?w=1200",
      mockCategories[8],
      mockUnverifiedUser,
    ),
  },
  {
    id: "furniture-6",
    categoryType: "Furnitures",
    furnitureType: "Wardrobes",
    room: "Bedroom",
    stripCategory: "Wardrobes",
    condition: "Brand New",
    ad: createMockAd(
      "furniture-ad-6",
      "Wardrobe",
      1900000,
      "Spacious wardrobe with full-height doors, organized shelving, and polished finish for modern bedrooms.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200",
      mockCategories[8],
      mockUser,
    ),
  },
  {
    id: "furniture-7",
    categoryType: "Kitchen Appliances",
    furnitureType: "Tables",
    room: "Kitchen",
    stripCategory: "Tables",
    condition: "Brand New",
    ad: createMockAd(
      "furniture-ad-7",
      "Kitchen Cabinet",
      1900000,
      "Kitchen cabinet system with integrated worktop, high-gloss finish, and practical storage for modern spaces.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200",
      mockCategories[8],
      mockUnverifiedUser,
    ),
  },
  {
    id: "furniture-8",
    categoryType: "Home Appliances",
    furnitureType: "Mattresses",
    room: "Bedroom",
    stripCategory: "Mattresses",
    condition: "Brand New",
    ad: createMockAd(
      "furniture-ad-8",
      "Orthopedic Mattress",
      1900000,
      "Deep comfort mattress with layered support, breathable cover, and premium finish for restful sleep.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
      mockCategories[8],
      mockUser,
    ),
  },
  {
    id: "furniture-9",
    categoryType: "Lighting",
    furnitureType: "Tables",
    room: "Bedroom",
    stripCategory: "Tables",
    condition: "Brand New",
    ad: createMockAd(
      "furniture-ad-9",
      "Designer Pendant Lights",
      1900000,
      "Architectural pendant lights with soft ambient glow and sculpted silhouette for stylish interiors.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      mockCategories[8],
      mockUnverifiedUser,
    ),
  },
  {
    id: "furniture-10",
    categoryType: "Furnitures",
    furnitureType: "Chairs",
    room: "Home Office / Study",
    stripCategory: "Chairs",
    condition: "Used",
    ad: createMockAd(
      "furniture-ad-10",
      "Accent Chair",
      1900000,
      "Statement accent chair with sculpted shell, wooden legs, and compact footprint for styled corners.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1200",
      mockCategories[8],
      mockUser,
    ),
  },
];

// TODO: Replace fashion mock listings with backend API data
// TODO: Replace fashion subcategories with backend-driven category data
export const mockFashionListings: MockFashionListing[] = [
  {
    id: "fashion-1",
    audience: "men",
    categoryType: "Men's Fashion",
    fashionType: "Clothings",
    brand: "Nike",
    style: "Formal",
    color: "Black",
    stripCategory: "Suits",
    condition: "Brand New",
    ad: createMockAd(
      "fashion-ad-1",
      "Classic Men's Suit",
      1900000,
      "Structured two-piece suit with a tailored fit, premium fabric, and clean formal finish for events and office wear.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1593032465171-8bd6d6f0a27c?w=1200",
      mockCategories[5],
      mockUser,
    ),
  },
  {
    id: "fashion-2",
    audience: "men",
    categoryType: "Men's Fashion",
    fashionType: "Clothings",
    brand: "Adidas",
    style: "Casual",
    color: "White",
    stripCategory: "T-shirt & Tanks",
    condition: "Brand New",
    ad: createMockAd(
      "fashion-ad-2",
      "Men's Street Tee",
      780000,
      "Relaxed streetwear tee with soft cotton feel, crisp neckline, and versatile everyday styling.",
      "Abuja, Wuse",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200",
      mockCategories[5],
      mockUnverifiedUser,
    ),
  },
  {
    id: "fashion-3",
    audience: "men",
    categoryType: "Men's Fashion",
    fashionType: "Clothings",
    brand: "Nike",
    style: "Vintage",
    color: "Multi",
    stripCategory: "Jeans",
    condition: "Used",
    ad: createMockAd(
      "fashion-ad-3",
      "Vintage Denim Jeans",
      620000,
      "Aged wash denim jeans with straight-leg fit, durable finish, and a broken-in vintage look.",
      "Lagos, Yaba",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200",
      mockCategories[5],
      mockUser,
    ),
  },
  {
    id: "fashion-4",
    audience: "men",
    categoryType: "Men's Fashion",
    fashionType: "Bags",
    brand: "Louis vitton",
    style: "Formal",
    color: "Black",
    stripCategory: "Bags",
    condition: "Brand New",
    ad: createMockAd(
      "fashion-ad-4",
      "Executive Leather Bag",
      1450000,
      "Minimal leather bag with structured form, polished hardware, and room for daily office essentials.",
      "Lagos, Victoria Island",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200",
      mockCategories[5],
      mockUser,
    ),
  },
  {
    id: "fashion-5",
    audience: "women",
    categoryType: "Women's Fashion",
    fashionType: "Clothings",
    brand: "Adidas",
    style: "Casual",
    color: "White",
    stripCategory: "Shirt",
    condition: "Brand New",
    ad: createMockAd(
      "fashion-ad-5",
      "Women's Cotton Shirt",
      690000,
      "Soft cotton shirt with clean buttons, easy drape, and versatile styling for work or casual wear.",
      "Lagos, Lekki",
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200",
      mockCategories[5],
      mockUnverifiedUser,
    ),
  },
  {
    id: "fashion-6",
    audience: "women",
    categoryType: "Women's Fashion",
    fashionType: "Clothings",
    brand: "Nike",
    style: "Formal",
    color: "Black",
    stripCategory: "Dresses",
    condition: "Brand New",
    ad: createMockAd(
      "fashion-ad-6",
      "Evening Dress",
      1650000,
      "Refined evening dress with a sculpted waist, fluid fabric, and elegant silhouette for occasions.",
      "Abuja, Maitama",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200",
      mockCategories[5],
      mockUser,
    ),
  },
  {
    id: "fashion-7",
    audience: "women",
    categoryType: "Women's Fashion",
    fashionType: "Jewelry",
    brand: "Louis vitton",
    style: "Vintage",
    color: "Multi",
    stripCategory: "Jewelry",
    condition: "Brand New",
    ad: createMockAd(
      "fashion-ad-7",
      "Statement Jewelry Set",
      950000,
      "Layered jewelry set with bold detailing, polished finish, and coordinated pieces for elevated styling.",
      "Port Harcourt, GRA",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200",
      mockCategories[5],
      mockUser,
    ),
  },
  {
    id: "fashion-8",
    audience: "women",
    categoryType: "Women's Fashion",
    fashionType: "Bags",
    brand: "Louis vitton",
    style: "Formal",
    color: "Black",
    stripCategory: "Bags",
    condition: "Used",
    ad: createMockAd(
      "fashion-ad-8",
      "Structured Handbag",
      1200000,
      "Structured handbag with top handle, compact frame, and polished texture for dressy daily looks.",
      "Lagos, Surulere",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200",
      mockCategories[5],
      mockUnverifiedUser,
    ),
  },
  {
    id: "fashion-9",
    audience: "baby-kids",
    categoryType: "Baby & Kids Fashion",
    fashionType: "Clothings",
    brand: "Adidas",
    style: "Casual",
    color: "Multi",
    stripCategory: "Clothing set",
    condition: "Brand New",
    ad: createMockAd(
      "fashion-ad-9",
      "Kids Clothing Set",
      540000,
      "Coordinated kids clothing set with soft fabric, cheerful tones, and easy all-day comfort.",
      "Lagos, Ajah",
      "https://images.unsplash.com/photo-1519238359922-989348752efb?w=1200",
      mockCategories[5],
      mockUser,
    ),
  },
  {
    id: "fashion-10",
    audience: "baby-kids",
    categoryType: "Baby & Kids Fashion",
    fashionType: "Clothings",
    brand: "Nike",
    style: "Formal",
    color: "White",
    stripCategory: "Ball Gowns",
    condition: "Brand New",
    ad: createMockAd(
      "fashion-ad-10",
      "Kids Ball Gown",
      1320000,
      "Layered kids ball gown with soft volume, detailed trim, and a dressy finish for celebrations.",
      "Abuja, Gwarinpa",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200",
      mockCategories[5],
      mockUnverifiedUser,
    ),
  },
  {
    id: "fashion-11",
    audience: "baby-kids",
    categoryType: "Baby & Kids Fashion",
    fashionType: "Shoe",
    brand: "Adidas",
    style: "Casual",
    color: "Black",
    stripCategory: "Shoes",
    condition: "Brand New",
    ad: createMockAd(
      "fashion-ad-11",
      "Kids Sneakers",
      610000,
      "Comfort-focused kids sneakers with lightweight sole, easy closure, and durable upper for active days.",
      "Lagos, Festac",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
      mockCategories[5],
      mockUser,
    ),
  },
  {
    id: "fashion-12",
    audience: "baby-kids",
    categoryType: "Baby & Kids Fashion",
    fashionType: "Clothings",
    brand: "Nike",
    style: "Vintage",
    color: "White",
    stripCategory: "Caps",
    condition: "Used",
    ad: createMockAd(
      "fashion-ad-12",
      "Kids Branded Cap",
      340000,
      "Lightweight kids cap with curved brim, playful branding, and breathable construction for sunny outings.",
      "Ibadan, Ring Road",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=1200",
      mockCategories[5],
      mockUnverifiedUser,
    ),
  },
];

// TODO: Replace job mock listings with backend API data
// TODO: Replace job filters with backend-driven job categories
export const mockJobListings: MockJobListing[] = [
  {
    id: "job-1",
    categoryType: "Full Time",
    stripCategory: "Full Time",
    ad: createMockAd(
      "job-ad-1",
      "UI/UX Designer",
      100000,
      "Long Lastin materials and Soft mattres.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
      mockCategories[2],
      mockUser,
    ),
  },
  {
    id: "job-2",
    categoryType: "Part Time",
    stripCategory: "Part Time",
    ad: createMockAd(
      "job-ad-2",
      "Secretary",
      100000,
      "Long Lastin materials and Soft mattres.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
      mockCategories[2],
      mockUnverifiedUser,
    ),
  },
  {
    id: "job-3",
    categoryType: "Full Time",
    stripCategory: "Remote",
    ad: createMockAd(
      "job-ad-3",
      "Web Developer",
      100000,
      "Long Lastin materials and Soft mattres.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
      mockCategories[2],
      mockUnverifiedUser,
    ),
  },
  {
    id: "job-4",
    categoryType: "Full Time",
    stripCategory: "Contract",
    ad: createMockAd(
      "job-ad-4",
      "Driver",
      100000,
      "Long Lastin materials and Soft mattres.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200",
      mockCategories[2],
      mockUser,
    ),
  },
  {
    id: "job-5",
    categoryType: "Full Time",
    stripCategory: "Full Time",
    ad: createMockAd(
      "job-ad-5",
      "Executive Director",
      100000,
      "Long Lastin materials and Soft mattres.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200",
      mockCategories[2],
      mockUser,
    ),
  },
  {
    id: "job-6",
    categoryType: "Part Time",
    stripCategory: "Temporary",
    ad: createMockAd(
      "job-ad-6",
      "Dispatch Rider",
      100000,
      "Long Lastin materials and Soft mattres.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200",
      mockCategories[2],
      mockUnverifiedUser,
    ),
  },
  {
    id: "job-7",
    categoryType: "Internship",
    stripCategory: "Internship",
    ad: createMockAd(
      "job-ad-7",
      "Technical Assistant",
      100000,
      "Long Lastin materials and Soft mattres.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
      mockCategories[2],
      mockUser,
    ),
  },
  {
    id: "job-8",
    categoryType: "Part Time",
    stripCategory: "Contract",
    ad: createMockAd(
      "job-ad-8",
      "Store Keeper",
      100000,
      "Long Lastin materials and Soft mattres.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200",
      mockCategories[2],
      mockUnverifiedUser,
    ),
  },
  {
    id: "job-9",
    categoryType: "Full Time",
    stripCategory: "Remote",
    ad: createMockAd(
      "job-ad-9",
      "Sales Rep",
      100000,
      "Long Lastin materials and Soft mattres.",
      "Lagos, Ikeja",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
      mockCategories[2],
      mockUnverifiedUser,
    ),
  },
];

/**
 * Mock Saved Ads
 */
export const mockSavedAds: Ad[] = [
  createMockAd(
    "saved-1",
    "Samsung Galaxy S24",
    450000,
    "Latest Samsung smartphone with advanced features",
    "Lagos, VI",
    "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=1200",
    mockCategories[1]
  ),
  createMockAd(
    "saved-2",
    "iPhone 15 Pro Max",
    850000,
    "Latest iPhone with latest technology",
    "Abuja, Wuse",
    "https://images.unsplash.com/photo-1511454612769-a02fbc866d48?w=1200",
    mockCategories[1]
  )
];

/**
 * Mock Conversations
 */
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: [
      mockUser,
      { id: "user-2", email: "jane@example.com", fullName: "Jane Smith", location: "Lagos" }
    ],
    lastMessage: { id: "msg-1", conversationId: "conv-1", senderId: "user-2", text: "Are you still selling?", read: false, createdAt: new Date().toISOString() },
    lastMessageAt: new Date().toISOString(),
    unreadCount: 2
  },
  {
    id: "conv-2",
    participants: [
      mockUser,
      { id: "user-3", email: "bob@example.com", fullName: "Bob Johnson", location: "Abuja" }
    ],
    lastMessage: { id: "msg-2", conversationId: "conv-2", senderId: "user-3", text: "Thanks, I'll take it", read: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0
  }
];

/**
 * Mock Messages
 */
export const mockMessages: Message[] = [
  { id: "msg-1", conversationId: "conv-1", senderId: "user-2", text: "Hi, is this item still available?", read: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "msg-2", conversationId: "conv-1", senderId: "user-1", text: "Yes, it is! Still in great condition.", read: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "msg-3", conversationId: "conv-1", senderId: "user-2", text: "Are you still selling?", read: false, createdAt: new Date().toISOString() }
];

/**
 * Mock Notifications
 */
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    type: "message",
    title: "New Message",
    body: "Jane Smith sent you a message about your car listing",
    read: false,
    actionUrl: "/messages",
    createdAt: new Date().toISOString()
  },
  {
    id: "notif-2",
    userId: "user-1",
    type: "offer",
    title: "New Offer",
    body: "Someone made an offer on your Mercedes-Benz",
    read: false,
    actionUrl: "/ads-dashboard",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "notif-3",
    userId: "user-1",
    type: "system",
    title: "Welcome",
    body: "Welcome to Qwik! Start buying and selling today.",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

/**
 * Helper function to simulate search results
 */
export function getMockSearchResults(query?: string, category?: string): Ad[] {
  let results = mockAds;

  if (query) {
    const queryLower = query.toLowerCase();
    results = results.filter((ad) => {
      const searchableFields = [ad.title, ad.description, ad.category.name, ad.category.slug];
      return searchableFields.some((field) => field.toLowerCase().includes(queryLower));
    });
  }

  if (category) {
    const categoryLower = category.toLowerCase();
    results = results.filter(
      (ad) => ad.category.slug.toLowerCase() === categoryLower || ad.category.name.toLowerCase() === categoryLower,
    );
  }

  return results;
}

export function isVehicleSearchQuery(query?: string): boolean {
  const queryLower = query?.trim().toLowerCase();
  if (!queryLower) return false;
  return ["vehicle", "vehicles", "car", "cars"].includes(queryLower);
}

export function isElectronicsSearchQuery(query?: string): boolean {
  const queryLower = query?.trim().toLowerCase();
  if (!queryLower) return false;
  return ["electronics", "electronic", "laptop", "laptops", "computer", "computers"].includes(queryLower);
}

export function isPhonesSearchQuery(query?: string): boolean {
  const queryLower = query?.trim().toLowerCase();
  if (!queryLower) return false;
  return [
    "phone",
    "phones",
    "phones & tablets",
    "phones & tablet",
    "phones and tablets",
    "tablet",
    "tablets",
  ].includes(queryLower);
}

export function isBeautySearchQuery(query?: string): boolean {
  const queryLower = query?.trim().toLowerCase();
  if (!queryLower) return false;
  return ["beauty", "body care", "skincare"].includes(queryLower);
}

function normalizeFashionQuery(query?: string): string {
  return (query ?? "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeJobQuery(query?: string): string {
  return (query ?? "")
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getFashionSearchState(query?: string): FashionSearchState | null {
  const normalizedQuery = normalizeFashionQuery(query);
  if (!normalizedQuery) return null;
  if (["fashion"].includes(normalizedQuery)) return "general";
  if (["mens fashion", "men fashion"].includes(normalizedQuery)) return "men";
  if (["womens fashion", "women fashion"].includes(normalizedQuery)) return "women";
  if (["baby fashion", "kids fashion", "baby and kids fashion", "baby kids fashion"].includes(normalizedQuery)) return "baby-kids";
  return null;
}

export function isFashionSearchQuery(query?: string): boolean {
  return getFashionSearchState(query) !== null;
}

export function getJobSearchStrip(query?: string): JobStripType | null {
  const queryLower = normalizeJobQuery(query);
  if (!queryLower) return null;

  if (["job", "jobs"].includes(queryLower)) return null;
  if (queryLower === "full time") return "Full Time";
  if (queryLower === "part time") return "Part Time";
  if (queryLower === "internship") return "Internship";
  if (queryLower === "contract") return "Contract";
  if (queryLower === "remote") return "Remote";
  if (queryLower === "temporary") return "Temporary";
  return null;
}

export function isJobSearchQuery(query?: string): boolean {
  const queryLower = normalizeJobQuery(query);
  if (!queryLower) return false;
  return ["job", "jobs", "full time", "part time", "internship", "contract", "remote", "temporary"].includes(queryLower);
}

export function isFurnitureSearchQuery(query?: string): boolean {
  const queryLower = query?.trim().toLowerCase();
  if (!queryLower) return false;
  return [
    "furniture",
    "furnitures",
    "furniture and appliances",
    "bedroom",
    "sofa",
    "sofas",
    "wardrobe",
    "wardrobes",
    "dining table",
    "table",
    "tables",
  ].includes(queryLower);
}

export function getMockVehicleSearchResults(query?: string): MockVehicleListing[] {
  if (!query || isVehicleSearchQuery(query)) {
    return mockVehicleListings;
  }

  const queryLower = query.trim().toLowerCase();
  return mockVehicleListings.filter(({ ad, brand, vehicleType, condition }) => {
    const searchableFields = [
      ad.title,
      ad.description,
      ad.location,
      brand,
      vehicleType,
      condition,
      ad.category.name,
      ad.category.slug,
    ];
    return searchableFields.some((field) => field.toLowerCase().includes(queryLower));
  });
}

export function getMockElectronicsSearchResults(query?: string): MockElectronicsListing[] {
  if (!query || isElectronicsSearchQuery(query)) {
    return mockElectronicsListings;
  }

  const queryLower = query.trim().toLowerCase();
  return mockElectronicsListings.filter(({ ad, brand, electronicsType, stripCategory, condition }) => {
    const searchableFields = [
      ad.title,
      ad.description,
      ad.location,
      brand,
      electronicsType,
      stripCategory,
      condition,
      ad.category.name,
      ad.category.slug,
    ];
    return searchableFields.some((field) => field.toLowerCase().includes(queryLower));
  });
}

export function getMockPhonesSearchResults(query?: string): MockPhonesListing[] {
  if (!query || isPhonesSearchQuery(query)) {
    return mockPhonesListings;
  }

  const queryLower = query.trim().toLowerCase();
  return mockPhonesListings.filter(({ ad, brand, phonesType, stripBrand, condition }) => {
    const searchableFields = [
      ad.title,
      ad.description,
      ad.location,
      brand,
      phonesType,
      stripBrand,
      condition,
      ad.category.name,
      ad.category.slug,
    ];
    return searchableFields.some((field) => field.toLowerCase().includes(queryLower));
  });
}

export function getMockBeautySearchResults(query?: string): MockBeautyListing[] {
  if (!query || isBeautySearchQuery(query)) {
    return mockBeautyListings;
  }

  const queryLower = query.trim().toLowerCase();
  return mockBeautyListings.filter(({ ad, categoryType, beautyType, brand, stripCategory, condition }) => {
    const searchableFields = [
      ad.title,
      ad.description,
      ad.location,
      categoryType,
      beautyType,
      brand,
      stripCategory,
      condition,
      ad.category.name,
      ad.category.slug,
    ];
    return searchableFields.some((field) => field.toLowerCase().includes(queryLower));
  });
}

export function getMockFurnitureSearchResults(query?: string): MockFurnitureListing[] {
  if (!query || isFurnitureSearchQuery(query)) {
    return mockFurnitureListings;
  }

  const queryLower = query.trim().toLowerCase();
  return mockFurnitureListings.filter(({ ad, categoryType, furnitureType, room, stripCategory, condition }) => {
    const searchableFields = [
      ad.title,
      ad.description,
      ad.location,
      categoryType,
      furnitureType,
      room,
      stripCategory,
      condition,
      ad.category.name,
      ad.category.slug,
    ];
    return searchableFields.some((field) => field.toLowerCase().includes(queryLower));
  });
}

export function getMockFashionSearchResults(query?: string): MockFashionListing[] {
  const state = getFashionSearchState(query);
  if (!query || state === "general") {
    return mockFashionListings;
  }

  if (state) {
    return mockFashionListings.filter((item) => item.audience === state);
  }

  const queryLower = query.trim().toLowerCase();
  return mockFashionListings.filter(({ ad, audience, categoryType, fashionType, brand, style, color, stripCategory, condition }) => {
    const searchableFields = [
      ad.title,
      ad.description,
      ad.location,
      audience,
      categoryType,
      fashionType,
      brand,
      style,
      color,
      stripCategory,
      condition,
      ad.category.name,
      ad.category.slug,
    ];
    return searchableFields.some((field) => field.toLowerCase().includes(queryLower));
  });
}

export function getMockJobSearchResults(query?: string): MockJobListing[] {
  if (!query || isJobSearchQuery(query)) {
    const strip = getJobSearchStrip(query);
    if (!strip) return mockJobListings;
    return mockJobListings.filter((listing) => listing.stripCategory === strip);
  }

  const queryLower = normalizeJobQuery(query);
  return mockJobListings.filter(({ ad, categoryType, stripCategory }) => {
    const searchableFields = [
      ad.title,
      ad.description,
      ad.location,
      categoryType,
      stripCategory,
      ad.category.name,
      ad.category.slug,
    ];
    return searchableFields.some((field) => normalizeJobQuery(field).includes(queryLower));
  });
}
