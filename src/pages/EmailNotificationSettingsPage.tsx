import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import Toggle from "../components/ui/Toggle";
import { Tab } from "../components/ui/Tab";
import { getSettingsNavItems } from "../lib/settings-nav-config";

export default function EmailNotificationSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "notification")}
          />

          <section className="max-w-[760px]">
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "notification")} label="Settings" />
            </div>
            <div className="mb-8 flex gap-10">
              <Tab label="Push" onClick={() => navigate("/notification-settings")} />
              <Tab label="Email" active onClick={() => navigate("/notification-settings-email")} />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[15px] sm:text-[16px] text-[#9794a1]">Deals on products</p>
                <Toggle checked />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[15px] sm:text-[16px] text-[#9794a1]">Message from users</p>
                <Toggle />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[15px] sm:text-[16px] text-[#9794a1]">Info about your ads</p>
                <Toggle />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[15px] sm:text-[16px] text-[#9794a1]">Your subscriptions</p>
                <Toggle />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[15px] sm:text-[16px] text-[#9794a1]">Feedback</p>
                <Toggle />
              </div>
            </div>

            <button className="mt-8 h-[48px] w-full max-w-[420px] rounded-[14px] bg-gradient-to-r from-amber to-orange text-[16px] text-white shadow-glow sm:h-[52px] sm:text-[18px]" type="button">
              Save
            </button>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
