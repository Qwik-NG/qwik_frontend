import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

function MenuItem({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex h-[58px] w-full items-center gap-3 rounded-[12px] px-4 text-left text-[16px] ${
        active ? "bg-[#efefef] text-[#1f1d27]" : "text-[#94919d]"
      }`}
    >
      <span className="text-[20px]">○</span>
      <span>{label}</span>
    </button>
  );
}

function Tab({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`text-[42px] ${active ? "text-[#1f1d27]" : "text-[#9794a1]"}`} type="button">
      {label}
    </button>
  );
}

function Toggle({ on = false }: { on?: boolean }) {
  return (
    <button type="button" className={`relative h-10 w-[66px] rounded-full ${on ? "bg-[#f6d8b0]" : "bg-[#d3d2d8]"}`}>
      <span className={`absolute top-1 h-8 w-8 rounded-full ${on ? "right-1 bg-gradient-to-r from-amber to-orange" : "left-1 bg-[#adabb6]"}`} />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <aside className="rounded-[20px] bg-white p-4">
            <div className="space-y-2">
              <MenuItem label="Profile" onClick={() => navigate("/profile-settings")} />
              <MenuItem label="Ads" onClick={() => navigate("/ads-dashboard")} />
              <MenuItem label="Make money" onClick={() => navigate("/promote-ad")} />
              <MenuItem label="Notification" active onClick={() => navigate("/notification-settings")} />
              <MenuItem label="Help" onClick={() => navigate("/messages")} />
              <MenuItem label="About" onClick={() => navigate("/")} />
              <MenuItem label="Log out" onClick={() => navigate("/signin")} />
            </div>
          </aside>

          <section className="max-w-[760px]">
            <div className="mb-8 flex gap-10">
              <Tab label="Push" active onClick={() => navigate("/notification-settings")} />
              <Tab label="Email" onClick={() => navigate("/notification-settings-email")} />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[35px] text-[#9794a1]">Deals, recommendations, news</p>
                <Toggle on />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[35px] text-[#9794a1]">Message from users</p>
                <Toggle />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[35px] text-[#9794a1]">Info about your ads</p>
                <Toggle />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[35px] text-[#9794a1]">Other useful Info</p>
                <Toggle />
              </div>
            </div>

            <button className="mt-8 h-[70px] w-[420px] rounded-[14px] bg-gradient-to-r from-amber to-orange text-[36px] text-white shadow-glow" type="button">
              Save
            </button>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
