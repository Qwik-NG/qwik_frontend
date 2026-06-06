import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  buildProductDetailsRoute,
  buildSearchResultsRoute,
  buildSearchRoute,
} from "../constants/routes";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import ElectronicsSearchResultsView from "../components/search/ElectronicsSearchResultsView";
import PhonesSearchResultsView from "../components/search/PhonesSearchResultsView";
import ListingCard, { type ListingCardItem } from "../components/listings/ListingCard";
import VehicleSearchResultsView from "../components/search/VehicleSearchResultsView";
import BackButton from "../components/ui/BackButton";
import { getMockSearchResults, isElectronicsSearchQuery, isPhonesSearchQuery, isVehicleSearchQuery, mockAds, mockCategories } from "../lib/mockData";
import type { Ad } from "../types";

type SortValue = "newest" | "price-low" | "price-high";
type VerifiedValue = "all" | "verified" | "unverified";

type Listing = ListingCardItem;

type SearchListing = Listing & { id: string };

const SORT_OPTIONS: Array<{ label: string; value: SortValue }> = [
  { label: "Newest first", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

const VERIFIED_OPTIONS: Array<{ label: string; value: VerifiedValue }> = [
  { label: "Show All", value: "all" },
  { label: "Verified Seller", value: "verified" },
  { label: "Unverified Seller", value: "unverified" },
];

function formatNaira(value: number) {
  return `₦ ${value.toLocaleString()}`;
}

function FilterPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[22px] bg-white px-4 py-5 shadow-[0_10px_26px_rgba(31,29,39,0.04)] sm:px-5">
      <p className="mb-4 text-[15px] font-medium text-[#1f1d27]">{title}</p>
      {children}
    </div>
  );
}

function FilterOption({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 text-left text-[15px] text-[#2f2d37]">
      <span className={`grid h-7 w-7 place-items-center rounded-[8px] border ${checked ? "border-[#9a989f] bg-[#6f6d75] text-white" : "border-[#d6d2da] bg-white"}`}>
        {checked ? <span className="text-[14px] leading-none">✓</span> : null}
      </span>
      <span>{label}</span>
    </button>
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
    price: formatNaira(ad.price),
    title: ad.title,
    description: ad.description,
    location: ad.location,
    image: ad.images?.[0]?.url,
    verifiedSeller: Boolean(ad.user?.profile?.verified || ad.user?.profile?.verificationStatus === "verified"),
  };
}

function sortAds(ads: Ad[], sortBy: SortValue) {
  return [...ads].sort((left, right) => {
    if (sortBy === "price-low") return left.price - right.price;
    if (sortBy === "price-high") return right.price - left.price;
    const rightCreatedAt = right.createdAt ? new Date(right.createdAt).getTime() : 0;
    const leftCreatedAt = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    return rightCreatedAt - leftCreatedAt;
  });
}

function SearchFilters({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortByChange,
  verifiedFilter,
  onVerifiedFilterChange,
  maxPrice,
  selectedMaxPrice,
  onSelectedMaxPriceChange,
}: {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: SortValue;
  onSortByChange: (value: SortValue) => void;
  verifiedFilter: VerifiedValue;
  onVerifiedFilterChange: (value: VerifiedValue) => void;
  maxPrice: number;
  selectedMaxPrice: number;
  onSelectedMaxPriceChange: (value: number) => void;
}) {
  return (
    <div className="space-y-4">
      <FilterPanel title="Region">
        <button className="flex w-full items-center justify-between text-[15px] text-[#ff9715]" type="button">
          <span>All Nigeria</span>
          <span className="text-[#9794a1]">›</span>
        </button>
      </FilterPanel>

      <FilterPanel title="Sort by">
        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value as SortValue)}
            className="w-full appearance-none bg-transparent pr-7 text-[15px] text-[#ff9715] outline-none"
            aria-label="Sort search results"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#9794a1]">›</span>
        </div>
      </FilterPanel>

      <FilterPanel title="Categories">
        <div className="space-y-3">
          <FilterOption label="Show All" checked={selectedCategory === "all"} onClick={() => onCategoryChange("all")} />
          {mockCategories.map((category) => (
            <FilterOption
              key={category.slug}
              label={category.name === "Properties" ? "Home" : category.name}
              checked={selectedCategory === category.slug}
              onClick={() => onCategoryChange(category.slug)}
            />
          ))}
        </div>
      </FilterPanel>

      <FilterPanel title="Verified Seller">
        <div className="space-y-3">
          {VERIFIED_OPTIONS.map((option) => (
            <FilterOption
              key={option.value}
              label={option.label}
              checked={verifiedFilter === option.value}
              onClick={() => onVerifiedFilterChange(option.value)}
            />
          ))}
        </div>
      </FilterPanel>

      <FilterPanel title="Price">
        <div className="mb-4 flex items-center justify-between gap-3 text-[14px] text-[#5f5c68]">
          <span>{formatNaira(0)}</span>
          <span>{formatNaira(selectedMaxPrice)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={Math.max(Math.round(maxPrice / 100), 1000)}
          value={selectedMaxPrice}
          onChange={(event) => onSelectedMaxPriceChange(Number(event.target.value))}
          className="w-full accent-[#ff9715]"
          aria-label="Maximum price"
        />
      </FilterPanel>
    </div>
  );
}

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  if (isVehicleSearchQuery(query)) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <VehicleSearchResultsView query={query} navigate={navigate} view="grid" />
        <SiteFooter navigate={navigate} />
      </div>
    );
  }

  if (isElectronicsSearchQuery(query)) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <ElectronicsSearchResultsView query={query} navigate={navigate} view="grid" />
        <SiteFooter navigate={navigate} />
      </div>
    );
  }

  if (isPhonesSearchQuery(query)) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <PhonesSearchResultsView query={query} navigate={navigate} view="grid" />
        <SiteFooter navigate={navigate} />
      </div>
    );
  }

  const resultsLabel = query || "All Ads";
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortValue>("newest");
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedValue>("all");
  const fallbackMaxPrice = Math.max(...mockAds.map((ad) => ad.price));
  const matchedAds = getMockSearchResults(query);
  const maxPrice = Math.max(...matchedAds.map((ad) => ad.price), fallbackMaxPrice);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(maxPrice);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory("all");
    setSortBy("newest");
    setVerifiedFilter("all");
    setSelectedMaxPrice(maxPrice);
    setMobileFiltersOpen(false);
  }, [query, maxPrice]);

  const filteredAds = sortAds(
    matchedAds.filter((ad) => {
      const categoryMatches =
        selectedCategory === "all" || ad.category.slug === selectedCategory;
      const verified = Boolean(ad.user?.profile?.verified || ad.user?.profile?.verificationStatus === "verified");
      const verifiedMatches =
        verifiedFilter === "all" ||
        (verifiedFilter === "verified" && verified) ||
        (verifiedFilter === "unverified" && !verified);
      const priceMatches = ad.price <= selectedMaxPrice;
      return categoryMatches && verifiedMatches && priceMatches;
    }),
    sortBy,
  );

  const results = filteredAds.map(toListing);

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-20 pt-8 sm:px-6 lg:px-12">
        {mobileFiltersOpen ? (
          <div className="fixed inset-0 z-[110] bg-[#1f1d27]/38 xl:hidden" onClick={() => setMobileFiltersOpen(false)}>
            <div
              className="ml-auto h-full w-[min(88vw,360px)] overflow-y-auto bg-page px-4 py-6 shadow-[0_18px_40px_rgba(31,29,39,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[20px] font-medium text-[#1f1d27]">Filters</h2>
                <button type="button" className="text-[14px] text-[#ff9715]" onClick={() => setMobileFiltersOpen(false)}>
                  Close
                </button>
              </div>
              <SearchFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                verifiedFilter={verifiedFilter}
                onVerifiedFilterChange={setVerifiedFilter}
                maxPrice={maxPrice}
                selectedMaxPrice={selectedMaxPrice}
                onSelectedMaxPriceChange={setSelectedMaxPrice}
              />
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[256px_minmax(0,1fr)] xl:items-start">
          <aside className="hidden space-y-4 xl:sticky xl:top-[98px] xl:block">
            <SearchFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              verifiedFilter={verifiedFilter}
              onVerifiedFilterChange={setVerifiedFilter}
              maxPrice={maxPrice}
              selectedMaxPrice={selectedMaxPrice}
              onSelectedMaxPriceChange={setSelectedMaxPrice}
            />
          </aside>

          <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <BackButton />
            </div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#e2ded7] bg-white px-4 text-[14px] font-medium text-[#1f1d27] shadow-[0_8px_20px_rgba(31,29,39,0.05)] xl:hidden"
                >
                  Filters
                </button>
                <h1 className="text-[28px] font-medium tracking-[-0.02em] text-[#1f1d27] sm:text-[36px]">
                  Found <span className="text-[#ff9715]">{results.length.toLocaleString()}</span> results for “{resultsLabel}”
                </h1>
              </div>
              <div className="flex items-center gap-2 self-start">
                <button
                  type="button"
                  onClick={() => navigate(buildSearchResultsRoute(query || undefined))}
                  className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#fff3e5]"
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <GridIcon active />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(buildSearchRoute(query || undefined))}
                  className="grid h-10 w-10 place-items-center rounded-[10px] bg-transparent hover:bg-[#f4f1eb]"
                  aria-label="List view"
                  title="List view"
                >
                  <ListIcon />
                </button>
              </div>
            </div>
            {results.length === 0 ? (
              <div className="rounded-[24px] border border-[#ddd9d2] bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(31,29,39,0.05)]">
                <h2 className="text-[22px] font-medium text-[#1f1d27]">No results found</h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-[#6d6a74]">
                  Try another keyword or adjust the filters to widen your search for “{resultsLabel}”.
                </p>
              </div>
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
