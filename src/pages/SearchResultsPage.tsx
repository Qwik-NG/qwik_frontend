import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import ListingCard, { type ListingCardItem } from "../components/listings/ListingCard";
import { FilterCard } from "../components/ui/FilterCard";

type Listing = ListingCardItem;

const listings: Listing[] = [
  {
    price: "₦ 85,500,000",
    title: "4bdrm Duplex in Lekki",
    description: "A Well Built and Spacious 4bedroom Semi Detached",
    location: "Lagos, Lekki",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
  },
  {
    price: "₦ 90,800,000",
    title: "Furnished 5bdrm Duplex in Port-Harcourt for Sale",
    description: "Superb design 5 bedroom duplex in a gated community with good road network in a serene environment",
    location: "Rivers, Port-Harcourt",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
  },
  {
    price: "₦ 85,500,000",
    title: "4bdrm Duplex in Lekki",
    description: "A Well Built and Spacious 4bedroom Semi Detached",
    location: "Lagos, Lekki",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
  },
];

const repeated = [...listings, ...listings, ...listings];

export default function SearchResultsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-10 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_1fr]">
          <aside className="space-y-3">
            <FilterCard title="Region">
              <button className="flex w-full items-center justify-between text-[15px] text-[#ff9715]" type="button">
                All Nigeria <span>›</span>
              </button>
            </FilterCard>
            <FilterCard title="Sort by">
              <button className="flex w-full items-center justify-between text-[15px] text-[#ff9715]" type="button">
                Newest first <span>›</span>
              </button>
            </FilterCard>
            <FilterCard title="Categories">
              <div className="space-y-2 text-[15px]">
                <label className="flex items-center gap-2"><input checked readOnly type="checkbox" /> Apartment</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Bungalow</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Mansion</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Duplex</label>
              </div>
            </FilterCard>
            <FilterCard title="Home">
              <div className="space-y-2 text-[15px]">
                <label className="flex items-center gap-2"><input checked readOnly type="checkbox" /> 4 Bedroom</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 3 Bedrooms</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 2 Bedrooms</label>
              </div>
            </FilterCard>
            <FilterCard title="Price">
              <div className="mb-3 flex items-center justify-between text-[14px] text-[#5f5c68]">
                <span>₦ 200,000</span>
                <span>₦ 100,200,000</span>
              </div>
              <input type="range" className="w-full accent-[#ff9715]" />
            </FilterCard>
          </aside>

          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h1 className="text-[44px] font-medium">
                Found <span className="text-[#ff9715]">23,029</span> results for “Home”
              </h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/search-results")}
                  className="rounded-[8px] bg-[#ececec] px-2 py-1 text-[28px] text-[#1f1c26]"
                  aria-label="Grid view"
                  title="Grid view"
                >
                  ▦
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/search-results-list")}
                  className="rounded-[8px] px-2 py-1 text-[28px] text-[#1f1c26] hover:bg-[#ececec]"
                  aria-label="List view"
                  title="List view"
                >
                  ☰
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {repeated.map((item, idx) => (
                <ListingCard
                  key={`${item.title}-${idx}`}
                  item={item}
                  interactive
                  clampTitleLines={2}
                  clampDescriptionLines={2}
                  clampLocationLines={1}
                  onClick={() => navigate("/product-details")}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
