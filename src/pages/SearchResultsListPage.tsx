import type { ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { LocationPin } from "../components/icons/LocationPin";
import { FilterCard } from "../components/ui/FilterCard";

type Listing = {
  price: string;
  title: string;
  description: string;
  location: string;
  image: string;
};

const listings: Listing[] = [
  {
    price: "₦ 85,500,000",
    title: "4bdrm Duplex in Lekki",
    description: "A Well Built and Spacious 4bedroom Semi Detached",
    location: "Lagos, Lekki",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
  },
  {
    price: "₦ 85,500,000",
    title: "4bdrm Duplex in Lekki",
    description: "A Well Built and Spacious 4bedroom Semi Detached",
    location: "Lagos, Lekki",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
  },
  {
    price: "₦ 85,500,000",
    title: "4bdrm Duplex in Lekki",
    description: "A Well Built and Spacious 4bedroom Semi Detached",
    location: "Lagos, Lekki",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
  },
];

const repeated = [...listings, ...listings];

function ListCard({ item, onClick }: { item: Listing; onClick: () => void }) {
  return (
    <article className="cursor-pointer rounded-[18px] bg-white p-3" onClick={onClick}>
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[220px_1fr]">
        <img src={item.image} alt={item.title} className="h-[220px] w-full rounded-[12px] object-cover" />
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h4 className="text-[24px] font-semibold leading-none sm:text-[28px]">{item.price}</h4>
            <span className="rounded-[9px] bg-badge-bg px-2.5 py-1 text-[14px] text-[#ff9715]">New</span>
          </div>
          <h5 className="mb-2 text-[18px] font-medium leading-tight">{item.title}</h5>
          <p className="mb-2 text-[15px] leading-[1.45] text-[#6d6a74]">{item.description}</p>
          <small className="flex items-center gap-1 text-[14px] text-[#4b4a54]">
            <LocationPin className="h-4 w-4" />
            <span>{item.location}</span>
          </small>
        </div>
      </div>
    </article>
  );
}

export default function SearchResultsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  // TODO: INTEGRATION READY
  // When backend is connected:
  // 1. Extract filters from URL (query, category, price, location, sort)
  // 2. Call: const { data: results } = await api.searchAds({ query, ...filters })
  // 3. Display results in list format using SearchResults type
  // 4. Use RequestStateWrapper for loading/error states
  // 5. Implement pagination if totalPages > 1
  // Types ready: SearchFilters, SearchResults, Ad from src/types/index.ts
  // Mock search available: getMockSearchResults(query) from src/lib/mockData.ts

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-10 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[220px_1fr]">
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
              <h1 className="text-[24px] font-medium sm:text-[28px]">
                Found <span className="text-[#ff9715]">23,029</span> results for “Home”
              </h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/search-results")}
                  className="rounded-[8px] px-2 py-1 text-[18px] text-[#1f1c26] hover:bg-[#ececec]"
                  aria-label="Grid view"
                  title="Grid view"
                >
                  ▦
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/search-results-list")}
                  className="rounded-[8px] bg-[#ececec] px-2 py-1 text-[18px] text-[#1f1c26]"
                  aria-label="List view"
                  title="List view"
                >
                  ☰
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {repeated.map((item, idx) => (
                <ListCard key={`${item.title}-${idx}`} item={item} onClick={() => navigate("/product-details")} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
