import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { BellIcon, BoxIcon, InfoIcon, LogoutIcon, PhoneIcon, TicketIcon, UserIcon } from "../components/icons/SettingsIcons";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import Toggle from "../components/ui/Toggle";

function Tab({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`text-[18px] sm:text-[22px] ${active ? "text-[#1f1d27]" : "text-[#9794a1]"}`} type="button">
      {label}
    </button>
  );
}

export default function EmailNotificationSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={[
              { label: "Profile", icon: <UserIcon />, onClick: () => navigate("/profile-settings") },
              { label: "Ads", icon: <BoxIcon />, onClick: () => navigate("/ads-dashboard") },
              { label: "Make money", icon: <TicketIcon />, onClick: () => navigate("/promote-ad") },
              { label: "Notification", icon: <BellIcon />, active: true, onClick: () => navigate("/notification-settings-email") },
              { label: "Help", icon: <PhoneIcon />, onClick: () => navigate("/messages") },
              { label: "About", icon: <InfoIcon />, onClick: () => navigate("/") },
              { label: "Log out", icon: <LogoutIcon />, onClick: () => navigate("/signin") },
            ]}
          />

          <section className="max-w-[760px]">
            <div className="mb-4">
              <MobileSettingsMenu items={[
                { label: "Profile", icon: <UserIcon />, onClick: () => navigate("/profile-settings") },
                { label: "Ads", icon: <BoxIcon />, onClick: () => navigate("/ads-dashboard") },
                { label: "Make money", icon: <TicketIcon />, onClick: () => navigate("/promote-ad") },
                { label: "Notification", icon: <BellIcon />, active: true, onClick: () => navigate("/notification-settings-email") },
                { label: "Help", icon: <PhoneIcon />, onClick: () => navigate("/messages") },
                { label: "About", icon: <InfoIcon />, onClick: () => navigate("/") },
                { label: "Log out", icon: <LogoutIcon />, onClick: () => navigate("/signin") },
              ]} label="Settings" />
            </div>
            <div className="mb-8 flex gap-10">
              <Tab label="Push" onClick={() => navigate("/notification-settings")} />
              <Tab label="Email" active onClick={() => navigate("/notification-settings-email")} />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[16px] sm:text-[18px] text-[#9794a1]">Deals on products</p>
                <Toggle checked />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[16px] sm:text-[18px] text-[#9794a1]">Message from users</p>
                <Toggle />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[16px] sm:text-[18px] text-[#9794a1]">Info about your ads</p>
                <Toggle />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[16px] sm:text-[18px] text-[#9794a1]">Your subscriptions</p>
                <Toggle />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[16px] sm:text-[18px] text-[#9794a1]">Feedback</p>
                <Toggle />
              </div>
            </div>

            <button className="mt-8 h-[48px] w-full max-w-[420px] rounded-[14px] bg-gradient-to-r from-amber to-orange text-[18px] text-white shadow-glow sm:h-[54px] sm:text-[20px]" type="button">
              Save
            </button>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
