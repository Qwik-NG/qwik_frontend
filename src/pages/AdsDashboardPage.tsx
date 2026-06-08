import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { LocationPin } from "../components/icons/LocationPin";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { api } from "../services/api";
import type { Ad } from "../types";

type DashboardAd = {
  id: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED" | "SOLD";
  price: string;
  title: string;
  description: string;
  location: string;
  image?: string;
  fit?: "cover" | "contain";
};

type FilterState = "ACTIVE" | "DRAFT" | "SOLD" | "ARCHIVED";

const stateOptions: Array<{ label: string; value: FilterState }> = [
  { label: "Active", value: "ACTIVE" },
  { label: "Reviewing", value: "DRAFT" },
  { label: "Sold", value: "SOLD" },
  { label: "Declined", value: "ARCHIVED" },
];

function toDashboardAd(ad: Ad): DashboardAd {
  return {
    id: ad.id,
    status: (ad.status as DashboardAd["status"]) || "ACTIVE",
    price: `₦ ${ad.price.toLocaleString()}`,
    title: ad.title,
    description: ad.description,
    location: ad.location,
    image: ad.images?.[0]?.url,
    fit: "cover",
  };
}

function StateChip({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[40px] items-center gap-2 rounded-[10px] px-4 text-[15px] ${
        active ? "bg-badge-bg text-[#ff9715]" : "bg-[#e9e9ee] text-[#b0adb8]"
      }`}
      type="button"
    >
      <span className="text-[16px]">{active ? "✶" : "◷"}</span>
      <span>{label}</span>
    </button>
  );
}

function AdCard({ ad, onClick }: { ad: DashboardAd; onClick: () => void }) {
  return (
    <article className="cursor-pointer rounded-card bg-white p-3.5 transition hover:scale-[1.01]" onClick={onClick}>
      <div className="h-[300px] w-full overflow-hidden rounded-[16px] bg-white">
        {ad.image ? (
          <img src={ad.image} alt={ad.title} className={`h-full w-full ${ad.fit === "contain" ? "object-contain p-4" : "object-cover"}`} />
        ) : (
          <ImagePlaceholder className="rounded-[16px]" />
        )}
      </div>
      <div className="pt-3.5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[22px] font-semibold leading-none">{ad.price}</h3>
          <span className="rounded-[10px] bg-badge-bg px-2.5 py-1 text-[13px] text-[#ff9715]">New</span>
        </div>
        <h4 className="mb-2 text-[17px] font-medium leading-tight">{ad.title}</h4>
        <p className="mb-2 text-[14px] leading-[1.35] text-[#6d6a74]">{ad.description}</p>
        <small className="flex items-center gap-1 text-[15px] text-[#4b4a54]">
          <LocationPin />
          {ad.location}
        </small>
      </div>
    </article>
  );
}

export default function AdsDashboardPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterState>("ACTIVE");
  const [ads, setAds] = useState<DashboardAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserAds = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getUserAds(activeFilter);
        setAds(response.data.map(toDashboardAd));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ads");
      } finally {
        setLoading(false);
      }
    };

    void loadUserAds();
  }, [activeFilter]);

  const emptyMessage = useMemo(() => {
    if (activeFilter === "ACTIVE") return "No active ads yet.";
    if (activeFilter === "DRAFT") return "No ads are under review.";
    if (activeFilter === "SOLD") return "No sold ads yet.";
    return "No declined ads found.";
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "ads")}
          />

          <section>
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "ads")} label="Settings" />
            </div>
            <div className="mb-6 flex flex-wrap gap-3">
              {stateOptions.map((option) => (
                <StateChip
                  key={option.value}
                  label={option.label}
                  active={activeFilter === option.value}
                  onClick={() => setActiveFilter(option.value)}
                />
              ))}
            </div>

            {loading ? (
              <p className="text-[15px] text-[#6d6a74]">Loading ads...</p>
            ) : error ? (
              <p className="text-[15px] text-[#d14343]">Error: {error}</p>
            ) : ads.length === 0 ? (
              <p className="text-[15px] text-[#6d6a74]">{emptyMessage}</p>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:max-w-[620px]">
                {ads.map((ad) => (
                  <div key={ad.id} className="max-w-[300px]">
                    <AdCard ad={ad} onClick={() => navigate(`/product-details/${ad.id}`)} />
                  </div>
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
