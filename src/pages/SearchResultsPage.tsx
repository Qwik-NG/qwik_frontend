import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { buildProductDetailsRoute } from "../constants/routes";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import ListingCard, { type ListingCardItem } from "../components/listings/ListingCard";
import { api } from "../services/api";
import type { Ad } from "../types";

// TODO: replace static filter options with API-backed categories and search facets.
const MOCK_CATEGORY_FILTERS = ["Show All", "Apartment", "Bungalow", "Mansion", "Duplex"];
const MOCK_HOME_FILTERS = ["4 Bedroom", "3 Bedrooms", "2 Bedrooms"];
const MOCK_VERIFIED_FILTERS = ["Show All", "Verified Seller", "Unverified Seller"];
const MOCK_PRICE_RANGE = { min: "₦ 200,000", max: "₦ 100,200,000" };

type Listing = ListingCardItem;

type SearchListing = Listing & { id: string };

function FilterPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] bg-white px-4 py-5 shadow-[0_10px_26px_rgba(31,29,39,0.04)] sm:px-5">
      <p className="mb-4 text-[15px] font-medium text-[#1f1d27]">{title}</p>
      {children}
    </div>
  );
}

function FilterCheck({ label, checked = false }: { label: string; checked?: boolean }) {
  return (
    <label className="flex items-center gap-3 text-[15px] text-[#2f2d37]">
      <span className={`grid h-7 w-7 place-items-center rounded-[8px] border ${checked ? "border-[#9a989f] bg-[#6f6d75] text-white" : "border-[#d6d2da] bg-white"}`}>
        {checked ? <span className="text-[14px] leading-none">✓</span> : null}
      </span>
      <span>{label}</span>
    </label>
  );
}

function GridIcon({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${active ? "text-[#ff9715]" : "text-[#1f1d27]"}`} fill="currentColor" aria-hidden="true">
      <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />
    </svg>
  );
}

function ListIcon({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${active ? "text-[#ff9715]" : "text-[#1f1d27]"}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 7h12M8 12h12M8 17h12" />
      <circle cx="4" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function toListing(ad: Ad): SearchListing {
  return {
    id: ad.id,
    price: `₦ ${ad.price.toLocaleString()}`,
    title: ad.title,
    description: ad.description,
    location: ad.location,
    image: ad.images?.[0]?.url,
    verifiedSeller: Boolean(ad.user?.profile?.verified || ad.user?.profile?.verificationStatus === "verified"),
  };
}

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const resultsLabel = query || "All Ads";
  const [results, setResults] = useState<SearchListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ pageSize: "20", imagesLimit: "1" });
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

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-20 pt-8 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[256px_minmax(0,1fr)] xl:items-start">
          <aside className="space-y-4 xl:sticky xl:top-[98px]">
            <FilterPanel title="Region">
              <button className="flex w-full items-center justify-between text-[15px] text-[#ff9715]" type="button">
                <span>All Nigeria</span>
                <span className="text-[#9794a1]">›</span>
              </button>
            </FilterPanel>
            <FilterPanel title="Sort by">
              <button className="flex w-full items-center justify-between text-[15px] text-[#ff9715]" type="button">
                <span>Newest first</span>
                <span className="text-[#9794a1]">›</span>
              </button>
            </FilterPanel>
            <FilterPanel title="Categories">
              <div className="space-y-3">
                {MOCK_CATEGORY_FILTERS.map((option, index) => (
                  <FilterCheck key={option} label={option} checked={index === 1} />
                ))}
              </div>
            </FilterPanel>
            <FilterPanel title={resultsLabel}>
              <div className="space-y-3">
                {MOCK_HOME_FILTERS.map((option, index) => (
                  <FilterCheck key={option} label={option} checked={index === 0} />
                ))}
              </div>
            </FilterPanel>
            <FilterPanel title="Verified Sellers">
              <div className="space-y-3">
                {MOCK_VERIFIED_FILTERS.map((option, index) => (
                  <FilterCheck key={option} label={option} checked={index === 0} />
                ))}
              </div>
            </FilterPanel>
            <FilterPanel title="Price">
              <div className="mb-4 flex items-center justify-between text-[14px] text-[#5f5c68]">
                <span>{MOCK_PRICE_RANGE.min}</span>
                <span>{MOCK_PRICE_RANGE.max}</span>
              </div>
              <input type="range" className="w-full accent-[#ff9715]" defaultValue={0} />
            </FilterPanel>
          </aside>

          <section className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-[28px] font-medium tracking-[-0.02em] text-[#1f1d27] sm:text-[36px]">
                Found <span className="text-[#ff9715]">{total.toLocaleString()}</span> results for “{resultsLabel}”
              </h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(query ? `/search-results?q=${encodeURIComponent(query)}` : "/search-results")}
                  className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#fff3e5]"
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <GridIcon active />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(query ? `/search-results-list?q=${encodeURIComponent(query)}` : "/search-results-list")}
                  className="grid h-10 w-10 place-items-center rounded-[10px] bg-transparent hover:bg-[#f4f1eb]"
                  aria-label="List view"
                  title="List view"
                >
                  <ListIcon />
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((item) => (
                  <ListingCard
                    key={item.id}
                    item={item}
                    interactive
                    clampTitleLines={2}
                    clampDescriptionLines={3}
                    clampLocationLines={1}
                    imageHeightClassName="h-[230px] sm:h-[260px]"
                    onClick={() => navigate(buildProductDetailsRoute(item.id))}
                  />
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
