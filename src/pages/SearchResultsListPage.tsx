import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  buildProductDetailsRoute,
  buildSearchResultsRoute,
  buildSearchRoute,
} from "../constants/routes";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import BeautySearchResultsView from "../components/search/BeautySearchResultsView";
import ElectronicsSearchResultsView from "../components/search/ElectronicsSearchResultsView";
import FashionSearchResultsView from "../components/search/FashionSearchResultsView";
import FurnituresSearchResultsView from "../components/search/FurnituresSearchResultsView";
import JobSearchResultsView from "../components/search/JobSearchResultsView";
import PhonesSearchResultsView from "../components/search/PhonesSearchResultsView";
import VehicleSearchResultsView from "../components/search/VehicleSearchResultsView";
import { LocationPin } from "../components/icons/LocationPin";
import BackButton from "../components/ui/BackButton";
import { FallbackImage } from "../components/ui/FallbackImage";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { isBeautySearchQuery, isElectronicsSearchQuery, isFashionSearchQuery, isFurnitureSearchQuery, isJobSearchQuery, isPhonesSearchQuery, isVehicleSearchQuery, mockCategories } from "../lib/mockData";
import { getCategorySearchContext, getLocationSearchParam } from "../lib/searchContext";
import { api } from "../services/api";
import type { Ad } from "../types";

type SortValue = "newest" | "price-low" | "price-high";
type VerifiedValue = "all" | "verified" | "unverified";

type Listing = {
  id: string;
  rawPrice: number;
  price: string;
  title: string;
  description: string;
  location: string;
  image?: string;
  verifiedSeller?: boolean;
};

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

function ListResultSkeleton() {
  return (
    <article className="rounded-[22px] bg-white p-3 shadow-[0_10px_26px_rgba(31,29,39,0.04)]">
      <div className="grid grid-cols-[120px_1fr] gap-4 sm:grid-cols-[180px_1fr]">
        <div className="h-[130px] animate-pulse rounded-[16px] bg-[#f2f2f4] sm:h-[160px]" />
        <div className="space-y-3 py-1">
          <div className="h-5 w-28 animate-pulse rounded bg-[#f2f2f4]" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-[#f2f2f4]" />
          <div className="h-4 w-full animate-pulse rounded bg-[#f2f2f4]" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-[#f2f2f4]" />
        </div>
      </div>
    </article>
  );
}

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

function toListing(ad: Ad): Listing {
  return {
    id: ad.id,
    rawPrice: ad.price,
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

function ListCard({ item, onClick }: { item: Listing; onClick: () => void }) {
  return (
    <article className="cursor-pointer rounded-[24px] border border-[#ddd9d2] bg-white p-3 shadow-[0_8px_24px_rgba(31,29,39,0.05)] sm:p-4" onClick={onClick}>
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="relative h-[220px] w-full overflow-hidden rounded-[18px] bg-white sm:h-[250px]">
          {item.verifiedSeller ? (
            <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-[8px] bg-[#73b784] px-2.5 py-1 text-[11px] font-medium text-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
                <path d="m9.4 12.1 1.8 1.8 3.8-4.1" />
              </svg>
              <span>Verified Seller</span>
            </span>
          ) : null}
          {item.image ? (
            <FallbackImage
              src={item.image}
              alt={item.title}
              className="h-full w-full"
              fallbackClassName="rounded-[18px]"
            />
          ) : (
            <ImagePlaceholder className="rounded-[18px]" />
          )}
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-[24px] font-semibold leading-none text-[#1f1d27] sm:text-[28px]">{item.price}</h4>
            <span className="rounded-[9px] bg-badge-bg px-2.5 py-1 text-[14px] text-[#ff9715]">New</span>
          </div>
          <h5 className="mb-2 text-[20px] font-medium leading-tight text-[#1f1d27]">{item.title}</h5>
          <p className="mb-3 text-[15px] leading-[1.55] text-[#6d6a74]">{item.description}</p>
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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const categoryContext = getCategorySearchContext(`?${searchParams.toString()}`);
  const categorySlug = categoryContext?.slug;
  const selectedLocation = getLocationSearchParam(`?${searchParams.toString()}`);

  if (categorySlug === "vehicles" || isVehicleSearchQuery(query)) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <VehicleSearchResultsView
          query={query}
          navigate={navigate}
          view={location.pathname === "/search-results-list" ? "list" : "grid"}
          locationFilter={selectedLocation}
        />
        <SiteFooter navigate={navigate} />
      </div>
    );
  }

  if (categorySlug === "electronics" || isElectronicsSearchQuery(query)) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <ElectronicsSearchResultsView
          query={query}
          navigate={navigate}
          view={location.pathname === "/search-results-list" ? "list" : "grid"}
          locationFilter={selectedLocation}
        />
        <SiteFooter navigate={navigate} />
      </div>
    );
  }

  if (categorySlug === "phones-tablets" || isPhonesSearchQuery(query)) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <PhonesSearchResultsView
          query={query}
          navigate={navigate}
          view={location.pathname === "/search-results-list" ? "list" : "grid"}
          locationFilter={selectedLocation}
        />
        <SiteFooter navigate={navigate} />
      </div>
    );
  }

  if (categorySlug === "beauty" || isBeautySearchQuery(query)) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <BeautySearchResultsView
          query={query}
          navigate={navigate}
          view={location.pathname === "/search-results-list" ? "list" : "grid"}
          locationFilter={selectedLocation}
        />
        <SiteFooter navigate={navigate} />
      </div>
    );
  }

  if (categorySlug === "fashion" || isFashionSearchQuery(query)) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <FashionSearchResultsView
          query={query}
          navigate={navigate}
          view={location.pathname === "/search-results-list" ? "list" : "grid"}
          locationFilter={selectedLocation}
        />
        <SiteFooter navigate={navigate} />
      </div>
    );
  }

  if (categorySlug === "jobs" || isJobSearchQuery(query)) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <JobSearchResultsView
          query={query}
          navigate={navigate}
          view={location.pathname === "/search-results-list" ? "list" : "grid"}
          locationFilter={selectedLocation}
        />
        <SiteFooter navigate={navigate} />
      </div>
    );
  }

  if (categorySlug === "furniture-appliances" || isFurnitureSearchQuery(query)) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <FurnituresSearchResultsView
          query={query}
          navigate={navigate}
          view={location.pathname === "/search-results-list" ? "list" : "grid"}
          locationFilter={selectedLocation}
        />
        <SiteFooter navigate={navigate} />
      </div>
    );
  }

  const resultsLabel = query || "All Ads";
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortValue>("newest");
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedValue>("all");
  const [matchedAds, setMatchedAds] = useState<Ad[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [adsError, setAdsError] = useState<string | null>(null);
  const maxPrice = Math.max(...matchedAds.map((ad) => ad.price), 100200000);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(maxPrice);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const loadAds = useCallback(async () => {
    try {
      setLoadingAds(true);
      setAdsError(null);
      const params = new URLSearchParams({ pageSize: "24", imagesLimit: "1" });
      if (query) params.set("q", query);
      if (categorySlug) params.set("category", categorySlug);
      if (selectedLocation) params.set("location", selectedLocation);
      const response = await api.ads(`?${params.toString()}`);
      setMatchedAds(response.data);
    } catch (err) {
      setAdsError(err instanceof Error ? err.message : "Failed to load ads");
      setMatchedAds([]);
    } finally {
      setLoadingAds(false);
    }
  }, [categorySlug, query, selectedLocation]);

  useEffect(() => {
    void loadAds();
  }, [loadAds]);

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
                  className="grid h-10 w-10 place-items-center rounded-[10px] bg-transparent hover:bg-[#f4f1eb]"
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <GridIcon />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(buildSearchRoute(query || undefined))}
                  className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#fff3e5]"
                  aria-label="List view"
                  title="List view"
                >
                  <ListIcon active />
                </button>
              </div>
            </div>
            {loadingAds ? (
              <div className="space-y-3 sm:space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ListResultSkeleton key={index} />
                ))}
              </div>
            ) : adsError ? (
              <div className="rounded-[24px] border border-[#f0d1d1] bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(31,29,39,0.05)]">
                <h2 className="text-[22px] font-medium text-[#1f1d27]">Failed to load ads</h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-[#6d6a74]">{adsError}</p>
                <button
                  type="button"
                  onClick={loadAds}
                  className="mt-5 rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 py-2 text-[15px] text-white"
                >
                  Retry
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-[24px] border border-[#ddd9d2] bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(31,29,39,0.05)]">
                <h2 className="text-[22px] font-medium text-[#1f1d27]">No results found</h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-[#6d6a74]">
                  Try another keyword or adjust the filters to widen your search for “{resultsLabel}”.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
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
