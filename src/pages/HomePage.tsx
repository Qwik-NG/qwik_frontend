import type { ComponentType } from "react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { buildSearchResultsRoute, buildSearchRoute } from "../constants/routes";
import { FallbackImage } from "../components/ui/FallbackImage";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { getLocationSearchParam } from "../lib/searchContext";
import { api } from "../services/api";

type Category = {
  name: string;
  shortName: string;
  tone: string;
  image?: string;
  icon?: ComponentType<{ className?: string }>;
  route: string;
};
type Product = { id: string; price: number; title: string; description: string; location: string; images: Array<{ url: string }> };

const categories: Category[] = [
  { name: "Vehicles", shortName: "Cars", image: "/category-images/vehicles.png", tone: "#f8ebe4", route: buildSearchRoute("Vehicles") },
  { name: "Phones & Tablets", shortName: "Phones", image: "/category-images/phone.png", tone: "#e9edff", route: buildSearchRoute("Phones") },
  { name: "Jobs", shortName: "Jobs", image: "/category-images/image.png", tone: "#f2e8dd", route: buildSearchRoute("Job") },
  { name: "Agriculture", shortName: "Agric", image: "/category-images/agriculture.png", tone: "#e5f1df", route: buildSearchRoute("Agriculture") },
  { name: "Sports & Leisure", shortName: "Sports", image: "/category-images/sports.png", tone: "#e7eefb", route: buildSearchRoute("Sports & Leisure") },
  { name: "Fashion", shortName: "Fashion", image: "/category-images/fashion.png", tone: "#f6eadc", route: buildSearchRoute("Fashion") },
  { name: "Art", shortName: "Art", image: "/category-images/art.png", tone: "#f0e8f7", route: buildSearchRoute("Art") },
  { name: "Properties", shortName: "Properties", image: "/category-images/properties.png", tone: "#e2f1e9", route: buildSearchResultsRoute("Home") },
  { name: "Furniture & Appliances", shortName: "Furniture", image: "/category-images/furniture.png", tone: "#f4e3f4", route: buildSearchRoute("Furniture") },
  { name: "Electronics", shortName: "Electronics", image: "/category-images/electronics.png", tone: "#ebeef3", route: buildSearchRoute("Electronics") },
  { name: "Beauty", shortName: "Beauty", image: "/category-images/beauty.png", tone: "#f1e4ee", route: buildSearchRoute("Beauty") }
];

function LocationPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ProductCardSkeleton() {
  return (
    <article className="rounded-[22px] bg-white p-2.5 sm:rounded-[26px] sm:p-4">
      <div className="h-[170px] w-full animate-pulse rounded-[14px] bg-[#f2f2f4] sm:h-[260px] sm:rounded-[18px]" />
      <div className="space-y-3 px-0 pb-1 pt-3 sm:pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="h-5 w-24 animate-pulse rounded bg-[#f2f2f4]" />
          <div className="h-7 w-12 animate-pulse rounded-[10px] bg-[#f2f2f4]" />
        </div>
        <div className="h-4 w-4/5 animate-pulse rounded bg-[#f2f2f4]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#f2f2f4]" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-[#f2f2f4]" />
      </div>
    </article>
  );
}

function CategoryCard({ item, onClick }: { item: Category; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-[70px] shrink-0 flex-col items-center gap-1.5 text-center transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9715] focus-visible:ring-offset-4 focus-visible:ring-offset-page active:scale-[0.96] sm:w-[82px] lg:w-[88px]"
      aria-label={`Browse ${item.name}`}
    >
      <span
        className="grid h-[48px] w-[48px] place-items-center overflow-hidden rounded-full shadow-[0_8px_18px_rgba(31,29,39,0.05)] transition duration-200 group-hover:scale-105 group-hover:shadow-[0_12px_24px_rgba(31,29,39,0.09)] sm:h-[52px] sm:w-[52px] lg:h-[56px] lg:w-[56px]"
        style={{ background: item.tone }}
      >
        {item.image ? (
          <FallbackImage
            src={item.image}
            alt=""
            fit="contain"
            className="h-[34px] w-[34px] rounded-full mix-blend-multiply sm:h-[38px] sm:w-[38px] lg:h-[40px] lg:w-[40px]"
            fallbackClassName="h-[34px] w-[34px] rounded-full sm:h-[38px] sm:w-[38px] lg:h-[40px] lg:w-[40px]"
            loading="eager"
            decoding="async"
          />
        ) : item.icon ? (
          <item.icon className="h-[30px] w-[30px] sm:h-[34px] sm:w-[34px] lg:h-[36px] lg:w-[36px]" />
        ) : null}
      </span>
      <span className="max-w-full text-[11px] font-medium leading-[1.15] text-[#1f1d27] sm:text-[12px] lg:text-[12px]">
        <span className="sm:hidden">{item.shortName}</span>
        <span className="hidden sm:inline">{item.name}</span>
      </span>
    </button>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedLocation = getLocationSearchParam(location.search);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ pageSize: "12", imagesLimit: "1" });
      if (selectedLocation) params.set("location", selectedLocation);
      const result = await api.ads(`?${params.toString()}`);
      setProducts(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ads");
      console.error("Error fetching ads:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);
  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <section className="mx-auto w-full max-w-[1728px] overflow-hidden px-4 pb-1 pt-5 sm:px-6 sm:pt-7 lg:px-12 xl:pt-8">
        <div className="category-scroll -mx-4 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-12 lg:px-12">
          <div className="flex w-max min-w-full flex-nowrap items-start gap-3 sm:gap-4 lg:gap-3 xl:justify-between xl:gap-4">
            {categories.map((item) => (
              <CategoryCard key={item.name} item={item} onClick={() => navigate(item.route)} />
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pb-24 lg:pt-14">
        <h2 className="mb-5 text-[26px] font-medium sm:text-[32px]">Top Ads</h2>
        
        {loading && (
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}
        {error && (
          <div className="rounded-[18px] border border-[#f0d1d1] bg-white px-6 py-8 text-center">
            <p className="text-[16px] text-[#d14343]">{error}</p>
            <button
              type="button"
              onClick={fetchAds}
              className="mt-4 rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 py-2 text-[15px] text-white"
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && products.length === 0 && <p className="text-center text-lg text-gray-500">No ads available</p>}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {products.map((item) => (
              <article
                key={item.id}
                className="cursor-pointer rounded-[22px] bg-white p-2.5 transition hover:scale-[1.01] sm:rounded-[26px] sm:p-4"
                onClick={() => navigate(`/product-details/${item.id}`)}
              >
                <div className="h-[170px] w-full overflow-hidden rounded-[14px] bg-white sm:h-[260px] sm:rounded-[18px]">
                  {item.images?.[0]?.url ? (
                    <FallbackImage
                      src={item.images[0].url}
                      alt={item.title}
                      className="h-full w-full"
                      fallbackClassName="rounded-[14px] sm:rounded-[18px]"
                    />
                  ) : (
                    <ImagePlaceholder className="rounded-[14px] sm:rounded-[18px]" />
                  )}
                </div>
                <div className="px-0 pb-1 pt-3 sm:pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="m-0 whitespace-nowrap text-[16px] font-semibold leading-none sm:text-[20px]">₦ {item.price.toLocaleString()}</h3>
                    <span className="rounded-[10px] bg-[#f5ebdc] px-2 py-1 text-[12px] text-[#ff9715] sm:rounded-[12px] sm:px-3 sm:py-1.5 sm:text-[15px]">New</span>
                  </div>
                  <h4 className="mb-1.5 mt-3 text-[15px] font-medium leading-[1.25] sm:mt-4 sm:text-[18px]" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</h4>
                  <p className="mb-2 text-[13px] leading-[1.35] text-muted sm:mb-3 sm:text-[15px] sm:leading-[1.4]" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
                  <small className="flex items-center gap-1 text-[13px] text-[#4b4a54] sm:text-[15px]">
                    <LocationPin className="h-4 w-4" />
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.location}</span>
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
