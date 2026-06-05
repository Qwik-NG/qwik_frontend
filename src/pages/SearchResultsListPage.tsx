import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { buildProductDetailsRoute } from "../constants/routes";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { LocationPin } from "../components/icons/LocationPin";
import { FilterCard } from "../components/ui/FilterCard";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { api } from "../services/api";
import type { Ad } from "../types";

// TODO: replace static filter options with API-backed categories and search facets.
const MOCK_CATEGORY_FILTERS = ["Apartment", "Bungalow", "Mansion", "Duplex"];
const MOCK_HOME_FILTERS = ["4 Bedroom", "3 Bedrooms", "2 Bedrooms"];
const MOCK_PRICE_RANGE = { min: "₦ 200,000", max: "₦ 100,200,000" };

type Listing = {
  id: string;
  price: string;
  title: string;
  description: string;
  location: string;
  image?: string;
};

function toListing(ad: Ad): Listing {
  return {
    id: ad.id,
    price: `₦ ${ad.price.toLocaleString()}`,
    title: ad.title,
    description: ad.description,
    location: ad.location,
    image: ad.images?.[0]?.url,
  };
}

function ListCard({ item, onClick }: { item: Listing; onClick: () => void }) {
  return (
    <article className="cursor-pointer rounded-[18px] bg-white p-3" onClick={onClick}>
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[220px_1fr]">
        <div className="h-[220px] w-full overflow-hidden rounded-[12px] bg-white">
          {item.image ? (
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholder className="rounded-[12px]" />
          )}
        </div>
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
  const query = searchParams.get("q")?.trim() || "";
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ pageSize: "100", imagesLimit: "1" });
        if (query) params.set("search", query);

        const response = await api.ads(`?${params.toString()}`);
        setResults(response.data.map(toListing));
        setTotal(response.meta?.total ?? response.data.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load search results");
      } finally {
        setLoading(false);
      }
    };

    void loadResults();
  }, [query]);

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
                {MOCK_CATEGORY_FILTERS.map((option, index) => (
                  <label key={option} className="flex items-center gap-2"><input checked={index === 0} readOnly={index === 0} type="checkbox" /> {option}</label>
                ))}
              </div>
            </FilterCard>
            <FilterCard title="Home">
              <div className="space-y-2 text-[15px]">
                {MOCK_HOME_FILTERS.map((option, index) => (
                  <label key={option} className="flex items-center gap-2"><input checked={index === 0} readOnly={index === 0} type="checkbox" /> {option}</label>
                ))}
              </div>
            </FilterCard>
            <FilterCard title="Price">
              <div className="mb-3 flex items-center justify-between text-[14px] text-[#5f5c68]">
                <span>{MOCK_PRICE_RANGE.min}</span>
                <span>{MOCK_PRICE_RANGE.max}</span>
              </div>
              <input type="range" className="w-full accent-[#ff9715]" />
            </FilterCard>
          </aside>

          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h1 className="text-[24px] font-medium sm:text-[28px]">
                Found <span className="text-[#ff9715]">{total.toLocaleString()}</span> results for “{query || "All Ads"}”
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
            {loading ? (
              <p className="text-[15px] text-[#6d6a74]">Loading search results...</p>
            ) : error ? (
              <p className="text-[15px] text-[#d14343]">Error: {error}</p>
            ) : results.length === 0 ? (
              <p className="text-[15px] text-[#6d6a74]">No results found.</p>
            ) : (
              <div className="space-y-3">
                {results.map((item) => (
                  <ListCard key={item.id} item={item} onClick={() => navigate(buildProductDetailsRoute(item.id))} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
