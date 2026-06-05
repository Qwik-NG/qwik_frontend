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

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-20 pt-8 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "notification")}
          />

          <section className="min-w-0 max-w-[760px] max-w-full">
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "notification")} label="Settings" />
            </div>
            <div className="mb-8 flex flex-wrap gap-6 sm:gap-10">
              <Tab label="Push" onClick={() => navigate("/notification-settings")} />
              <Tab label="Email" active onClick={() => navigate("/notification-settings-email")} />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <p className="min-w-0 text-[15px] text-[#9794a1] sm:text-[16px]">Deals on products</p>
                <Toggle size="sm" checked />
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="min-w-0 text-[15px] text-[#9794a1] sm:text-[16px]">Message from users</p>
                <Toggle size="sm" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="min-w-0 text-[15px] text-[#9794a1] sm:text-[16px]">Info about your ads</p>
                <Toggle size="sm" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="min-w-0 text-[15px] text-[#9794a1] sm:text-[16px]">Your subscriptions</p>
                <Toggle size="sm" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="min-w-0 text-[15px] text-[#9794a1] sm:text-[16px]">Feedback</p>
                <Toggle size="sm" />
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
