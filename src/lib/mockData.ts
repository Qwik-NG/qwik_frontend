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

export type MockVehicleListing = {
  id: string;
  ad: Ad;
  brand: "Benz" | "Toyota" | "Honda" | "Ford" | "Lexus" | "Nissan" | "BMW" | "Audi";
  vehicleType: VehicleType;
  condition: VehicleCondition;
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
