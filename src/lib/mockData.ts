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
  { id: "10", name: "Laptops", slug: "laptops", icon: "💻" },
  { id: "11", name: "Beauty", slug: "beauty", icon: "💄" }
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
    status: "active",
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
