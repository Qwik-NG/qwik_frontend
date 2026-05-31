import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

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

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M9 5v3h6V5" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <path d="M12 7v2M12 11v2M12 15v2" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M18 9.5a6 6 0 0 0-12 0c0 7-2.6 7.5-2.6 7.5h17.2S18 16.5 18 9.5" />
      <path d="M14.2 20a2.4 2.4 0 0 1-4.4 0" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M22 16.9v2.5a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 2.1 3.7 2 2 0 0 1 4.1 1.5h2.5a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1l-1 1a16 16 0 0 0 6 6l1-1a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M14 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3" />
      <path d="M9 12h11M17 9l3 3-3 3" />
    </svg>
  );
}

function MenuItem({ label, icon, active = false, onClick }: { label: string; icon: ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex h-[58px] w-full items-center gap-3 rounded-[12px] px-4 text-left text-[16px] ${
        active ? "bg-[#efefef] text-[#1f1d27]" : "text-[#94919d]"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function StateChip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`flex h-[48px] items-center gap-2 rounded-[10px] px-6 text-[31px] ${
        active ? "bg-[#f5ebdc] text-[#ff9715]" : "bg-[#e9e9ee] text-[#b0adb8]"
      }`}
      type="button"
    >
      <span className="text-[23px]">{active ? "✶" : "◷"}</span>
      <span>{label}</span>
    </button>
  );
}

function LocationPin() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 10c0 5.3-7 10-7 10s-7-4.7-7-10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function AdCard({ ad }: { ad: Ad }) {
  return (
    <article className="rounded-[20px] bg-white p-3.5">
      <div className="h-[300px] w-full overflow-hidden rounded-[16px] bg-white">
        <img src={ad.image} alt={ad.title} className={`h-full w-full ${ad.fit === "contain" ? "object-contain p-4" : "object-cover"}`} />
      </div>
      <div className="pt-3.5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[30px] font-semibold leading-none">{ad.price}</h3>
          <span className="rounded-[10px] bg-[#f5ebdc] px-2.5 py-1 text-[13px] text-[#ff9715]">New</span>
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
          <aside className="rounded-[20px] bg-white p-4">
            <div className="space-y-2">
              <MenuItem label="Profile" icon={<UserIcon />} onClick={() => navigate("/profile-settings")} />
              <MenuItem label="Ads" icon={<BoxIcon />} active onClick={() => navigate("/ads-dashboard")} />
              <MenuItem label="Make money" icon={<TicketIcon />} onClick={() => navigate("/promote-ad")} />
              <MenuItem label="Notification" icon={<BellIcon />} onClick={() => navigate("/notification-settings")} />
              <MenuItem label="Help" icon={<PhoneIcon />} onClick={() => navigate("/messages")} />
              <MenuItem label="About" icon={<InfoIcon />} onClick={() => navigate("/")} />
              <MenuItem label="Log out" icon={<LogoutIcon />} onClick={() => navigate("/signin")} />
            </div>
          </aside>

          <section>
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
