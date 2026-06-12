import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { FallbackImage } from "../components/ui/FallbackImage";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { api } from "../services/api";
import type { Ad } from "../types";

type SavedCardAd = {
  id: string;
  price: string;
  title: string;
  description: string;
  location: string;
  image?: string;
  fit?: "cover" | "contain";
};

function toSavedCardAd(ad: Ad): SavedCardAd {
  return {
    id: ad.id,
    price: `₦ ${ad.price.toLocaleString()}`,
    title: ad.title,
    description: ad.description,
    location: ad.location,
    image: ad.images?.[0]?.url,
    fit: "cover",
  };
}

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

function LocationPin() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M19 10c0 5.3-7 10-7 10s-7-4.7-7-10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function SavedCard({ ad, onClick }: { ad: SavedCardAd; onClick: () => void }) {
  return (
    <article className="cursor-pointer rounded-[22px] bg-white p-2.5 transition hover:scale-[1.01] sm:rounded-[26px] sm:p-4" onClick={onClick}>
      <div className="h-[170px] w-full overflow-hidden rounded-[14px] bg-white sm:h-[260px] sm:rounded-[18px]">
        {ad.image ? (
          <FallbackImage
            src={ad.image}
            alt={ad.title}
            fit={ad.fit === "contain" ? "contain" : "cover"}
            className={`h-full w-full ${ad.fit === "contain" ? "p-4" : ""}`}
            fallbackClassName="rounded-[14px] sm:rounded-[18px]"
          />
        ) : (
          <ImagePlaceholder className="rounded-[14px] sm:rounded-[18px]" />
        )}
      </div>
      <div className="px-0 pb-1 pt-3 sm:pt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="m-0 whitespace-nowrap text-[16px] font-semibold leading-none text-ink sm:text-[20px]">{ad.price}</h3>
          <span className="rounded-[10px] bg-[#f5ebdc] px-2 py-1 text-[12px] text-[#ff9715] sm:rounded-[12px] sm:px-3 sm:py-1.5 sm:text-[15px]">New</span>
        </div>
        <h4 className="mb-1.5 mt-3 text-[15px] font-medium leading-[1.25] text-ink sm:mt-4 sm:text-[18px]">{ad.title}</h4>
        <p className="mb-2 text-[13px] leading-[1.35] text-[#6d6a74] sm:mb-3 sm:text-[15px] sm:leading-[1.4]">{ad.description}</p>
        <small className="flex items-center gap-1 text-[13px] text-[#4b4a54] sm:text-[15px]">
          <LocationPin />
          {ad.location}
        </small>
      </div>
    </article>
  );
}

function SavedCardSkeleton() {
  return (
    <article className="rounded-[22px] bg-white p-2.5 sm:rounded-[26px] sm:p-4">
      <div className="h-[170px] w-full animate-pulse rounded-[14px] bg-[#f2f2f4] sm:h-[260px] sm:rounded-[18px]" />
      <div className="space-y-3 px-0 pb-1 pt-3 sm:pt-4">
        <div className="h-5 w-28 animate-pulse rounded bg-[#f2f2f4]" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#f2f2f4]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#f2f2f4]" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-[#f2f2f4]" />
      </div>
    </article>
  );
}

export default function SavedPage() {
  const navigate = useNavigate();
  const [savedAds, setSavedAds] = useState<SavedCardAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSavedAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.savedAds();
      setSavedAds(response.data.map(toSavedCardAd));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load saved ads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSavedAds();
  }, [loadSavedAds]);

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} activeIcon="bookmark" />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pb-24 lg:pt-14">
        <div className="mb-6 flex items-center gap-2.5">
          <BookmarkIcon />
          <h1 className="text-[34px] font-normal leading-none text-ink">Saved</h1>
        </div>

        {loading ? (
          <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SavedCardSkeleton key={index} />
            ))}
          </section>
        ) : error ? (
          <div className="rounded-[18px] border border-[#f0d1d1] bg-white px-6 py-8">
            <p className="text-[15px] text-[#d14343]">{error}</p>
            <button
              type="button"
              onClick={loadSavedAds}
              className="mt-4 rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 py-2 text-[15px] text-white"
            >
              Retry
            </button>
          </div>
        ) : savedAds.length === 0 ? (
          <p className="text-[15px] text-[#6d6a74]">You have no saved ads yet.</p>
        ) : (
          <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {savedAds.map((ad) => (
              <SavedCard key={ad.id} ad={ad} onClick={() => navigate(`/product-details/${ad.id}`)} />
            ))}
          </section>
        )}
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
