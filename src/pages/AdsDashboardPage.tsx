import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { LocationPin } from "../components/icons/LocationPin";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { getSettingsNavItems } from "../lib/settings-nav-config";

type Ad = {
  price: string;
  title: string;
  description: string;
  location: string;
  image: string;
  fit?: "cover" | "contain";
};

const ads: Ad[] = [
  {
    price: "₦ 1,900,000",
    title: "Apple MacBook Pro",
    description: "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
    location: "Lagos, Ikeja",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
    fit: "contain",
  },
  {
    price: "₦ 11,000,000",
    title: "Mercedes-Benz GLA 250 2015 Blue",
    description:
      "Keyless entry Panoramic roof Led intelligent light Custom duty fully paid This is a very sharp...",
    location: "Abuja, Apo",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1200",
    fit: "cover",
  },
];


function StateChip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`flex h-[48px] items-center gap-2 rounded-[10px] px-6 text-[31px] ${
        active ? "bg-badge-bg text-[#ff9715]" : "bg-[#e9e9ee] text-[#b0adb8]"
      }`}
      type="button"
    >
      <span className="text-[23px]">{active ? "✶" : "◷"}</span>
      <span>{label}</span>
    </button>
  );
}

function AdCard({ ad }: { ad: Ad }) {
  return (
    <article className="rounded-card bg-white p-3.5">
      <div className="h-[300px] w-full overflow-hidden rounded-[16px] bg-white">
        <img src={ad.image} alt={ad.title} className={`h-full w-full ${ad.fit === "contain" ? "object-contain p-4" : "object-cover"}`} />
      </div>
      <div className="pt-3.5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[30px] font-semibold leading-none">{ad.price}</h3>
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
              <StateChip label="Active" active />
              <StateChip label="Reviewing" />
              <StateChip label="Declined" />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:max-w-[620px]">
              {ads.map((ad) => (
                <div key={ad.title} className="max-w-[300px]">
                  <AdCard ad={ad} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
