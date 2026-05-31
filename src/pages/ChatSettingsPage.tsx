import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

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

function ToggleRow({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <p className="text-[35px] text-[#9794a1]">{label}</p>
      <button type="button" className="relative h-10 w-[66px] rounded-full bg-[#f6d8b0]">
        <span className="absolute right-1 top-1 h-8 w-8 rounded-full bg-gradient-to-r from-amber to-orange" />
      </button>
    </div>
  );
}

export default function ChatSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <aside className="rounded-[20px] bg-white p-4">
            <div className="space-y-2">
              <MenuItem label="Profile" icon={<UserIcon />} active onClick={() => navigate("/profile-settings")} />
              <MenuItem label="Ads" icon={<BoxIcon />} onClick={() => navigate("/ads-dashboard")} />
              <MenuItem label="Make money" icon={<TicketIcon />} onClick={() => navigate("/promote-ad")} />
              <MenuItem label="Notification" icon={<BellIcon />} onClick={() => navigate("/notification-settings")} />
              <MenuItem label="Help" icon={<PhoneIcon />} onClick={() => navigate("/messages")} />
              <MenuItem label="About" icon={<InfoIcon />} onClick={() => navigate("/")} />
              <MenuItem label="Log out" icon={<LogoutIcon />} onClick={() => navigate("/signin")} />
            </div>
          </aside>

          <section>
            <div className="rounded-[20px] bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      className="h-[84px] w-[84px] rounded-full object-cover"
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120"
                      alt="profile"
                    />
                  </div>
                  <div>
                    <h1 className="text-[50px] font-medium leading-tight">Sherry James</h1>
                    <p className="text-[36px] text-[#8c8996]">Imshuvo97@gmail.com</p>
                  </div>
                </div>
                <div className="flex gap-10 text-center">
                  <div>
                    <p className="text-[42px]">12</p>
                    <p className="text-[18px] text-[#8c8996]">Following</p>
                  </div>
                  <div>
                    <p className="text-[42px]">23</p>
                    <p className="text-[18px] text-[#8c8996]">Followers</p>
                  </div>
                  <div>
                    <p className="text-[42px]">17</p>
                    <p className="text-[18px] text-[#8c8996]">adverts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-[760px]">
              <div className="mb-10 flex flex-nowrap gap-5 text-[26px] sm:text-[34px]">
                <button className="whitespace-nowrap text-[#9794a1]" onClick={() => navigate("/profile-settings")} type="button">
                  Edit Profile
                </button>
                <button className="whitespace-nowrap text-[#9794a1]" onClick={() => navigate("/profile-settings")} type="button">
                  Company details
                </button>
                <button className="whitespace-nowrap font-medium" type="button">
                  Chat settings
                </button>
              </div>

              <ToggleRow label="Receive messages" />
              <ToggleRow label="Receive messages" />

              <button className="mt-2 h-[70px] w-[420px] rounded-[14px] bg-gradient-to-r from-amber to-orange text-[36px] text-white shadow-glow" type="button">
                Save
              </button>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
