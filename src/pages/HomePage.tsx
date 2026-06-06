import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { buildSearchResultsRoute, buildSearchRoute } from "../constants/routes";
import {
  AgricultureIcon,
  BeautyIcon,
  CarsIcon,
  ElectronicsIcon,
  FashionIcon,
  FurnitureIcon,
  JobsIcon,
  LaptopIcon,
  MoreIcon,
  PhonesIcon,
  PropertiesIcon,
  SportsIcon,
} from "../components/icons/CategoryIcons";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { apiUrl } from "../services/api";

type Category = {
  name: string;
  tone: string;
  icon: ComponentType<{ className?: string }>;
};
type Product = { id: string; price: number; title: string; description: string; location: string; images: Array<{ url: string }> };

const categories: Category[] = [
  { name: "Cars", icon: CarsIcon, tone: "#f5e8e2" },
  { name: "Phones", icon: PhonesIcon, tone: "#e7ebfa" },
  { name: "Jobs", icon: JobsIcon, tone: "#ece8e8" },
  { name: "Agriculture", icon: AgricultureIcon, tone: "#dff1e6" },
  { name: "Sports", icon: SportsIcon, tone: "#ececec" },
  { name: "Fashion", icon: FashionIcon, tone: "#f3ebdd" },
  { name: "Electronics", icon: ElectronicsIcon, tone: "#e8e8e8" },
  { name: "Properties", icon: PropertiesIcon, tone: "#deede5" },
  { name: "Furniture", icon: FurnitureIcon, tone: "#f2dff0" },
  { name: "Laptop", icon: LaptopIcon, tone: "#e6e2f0" },
  { name: "Beauty", icon: BeautyIcon, tone: "#e8dfeb" },
  { name: "More", icon: MoreIcon, tone: "#f0f0f0" }
];

function LocationPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl("/ads?pageSize=12"));
        if (!response.ok) throw new Error("Failed to fetch ads");
        const result = await response.json();
        setProducts(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);
  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <section className="mx-auto grid w-full max-w-[1728px] grid-cols-4 gap-3 px-4 pb-1 pt-8 sm:px-6 sm:pt-[50px] md:grid-cols-6 lg:px-12 xl:grid-cols-12 xl:pt-[70px]">
        {categories.map((item) => (
          <button
            key={item.name}
            className="text-center"
            onClick={() =>
              navigate(
                item.name === "More"
                  ? "/search-results-list"
                  : item.name === "Cars"
                    ? buildSearchRoute("Vehicles")
                  : item.name === "Electronics"
                    ? buildSearchRoute("Electronics")
                  : buildSearchResultsRoute(item.name === "Properties" ? "Home" : item.name),
              )
            }
            type="button"
          >
            <div className="mx-auto mb-1.5 grid h-[68px] w-[68px] place-items-center overflow-hidden rounded-full" style={{ background: item.tone }}>
              <item.icon />
            </div>
            <p className="m-0 text-[13px]">{item.name}</p>
          </button>
        ))}
      </section>

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pb-24 lg:pt-14">
        <h2 className="mb-5 text-[26px] font-medium sm:text-[32px]">Top Ads</h2>
        
        {loading && <p className="text-center text-lg text-gray-500">Loading ads...</p>}
        {error && <p className="text-center text-lg text-red-500">Error: {error}</p>}
        
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
                    <img src={item.images[0].url} alt={item.title} className="h-full w-full object-cover" />
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
