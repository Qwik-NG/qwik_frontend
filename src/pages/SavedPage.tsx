import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import ListingCard, { type ListingCardItem } from "../components/listings/ListingCard";

type SavedAd = ListingCardItem;

const savedAds: SavedAd[] = [
  {
    price: "₦ 1,900,000",
    title: "Apple MacBook Pro",
    description: "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
    location: "Lagos, Ikeja",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
    imageFit: "contain",
  },
  {
    price: "₦ 11,000,000",
    title: "Mercedes-Benz GLA 250 2015 Blue",
    description:
      "Keyless entry Panoramic roof Led intelligent light Custom duty fully paid This is a very sharp...",
    location: "Abuja, Apo",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1200",
    imageFit: "cover",
  },
];

function BookmarkIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M6.5 4.8c0-1 .8-1.8 1.8-1.8h7.4c1 0 1.8.8 1.8 1.8v16.1L12 17.5l-5.5 3.4V4.8Z" />
    </svg>
  );
}

export default function SavedPage() {
  const navigate = useNavigate();

  // TODO: INTEGRATION READY
  // When backend is connected:
  // 1. Call: const { data: savedAds } = await api.savedAds()
  // 2. Replace hardcoded `repeated` with fetched savedAds
  // 3. Use RequestStateWrapper for loading/error states
  // 4. Show EmptyState when no saved ads: title="No Saved Items", description="Start saving ads to view them here"
  // Types ready: Ad[], SavedAd from src/types/index.ts
  // Mock data available: mockSavedAds from src/lib/mockData.ts

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} activeIcon="bookmark" />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pb-24 lg:pt-14">
        <div className="mb-6 flex items-center gap-2.5">
          <BookmarkIcon />
          <h1 className="text-[34px] font-normal leading-none text-ink">Saved</h1>
        </div>

        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {savedAds.map((ad) => (
            <ListingCard key={ad.title} item={ad} />
          ))}
        </section>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
