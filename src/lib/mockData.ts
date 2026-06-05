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
