import { useMessageNotificationsSetting } from "../hooks/useMessageNotificationsSetting";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import Toggle from "../components/ui/Toggle";
import { UserAvatar } from "../components/ui/UserAvatar";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { getSettingsNavItems } from "../lib/settings-nav-config";

export default function ChatSettingsPage() {
  const navigate = useNavigate();
  const { user, display } = useCurrentUser();
  const chatSettings = useMessageNotificationsSetting();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-20 pt-8 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "chat")}
          />

          <section className="min-w-0">
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "chat")} label="Settings" />
            </div>
            <div className="rounded-card bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <UserAvatar
                      name={display.fullName}
                      imageUrl={user?.profile?.avatarUrl || display.avatarUrl}
                      alt={`${display.fullName} profile`}
                      className="h-[84px] w-[84px] rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-[24px] font-medium leading-tight sm:text-[28px]">{display.fullName}</h1>
                    <p className="text-[15px] text-[#8c8996] sm:text-[16px]">{display.email}</p>
                  </div>
                </div>
                <div className="flex gap-10 text-center">
                  {display.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[20px] sm:text-[22px]">{stat.value}</p>
                      <p className="text-[14px] text-[#8c8996]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-[760px] max-w-full">
              <div className="mb-10 flex flex-wrap gap-5 text-[15px] sm:text-[17px]">
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

              {chatSettings.loading ? (
                <div className="mb-6 h-[56px] animate-pulse rounded-[14px] bg-white" />
              ) : (
                <div className="mb-6 flex items-center justify-between gap-4">
                  <p className="text-[16px] sm:text-[18px] text-[#9794a1]">Receive messages</p>
                  <Toggle
                    size="sm"
                    checked={chatSettings.messageNotifications}
                    onCheckedChange={chatSettings.setMessageNotifications}
                    ariaLabelChecked="Disable receive messages"
                    ariaLabelUnchecked="Enable receive messages"
                    className={chatSettings.saving ? "opacity-60" : ""}
                  />
                </div>
              )}

              {chatSettings.error ? <p className="mb-4 text-[14px] text-[#d14343]">{chatSettings.error}</p> : null}
              {chatSettings.message ? <p className="mb-4 text-[14px] text-[#248a4b]">{chatSettings.message}</p> : null}

              <button
                className="mt-2 h-[48px] w-full max-w-[420px] rounded-[14px] bg-gradient-to-r from-amber to-orange text-[16px] text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50 sm:h-[52px] sm:text-[18px]"
                type="button"
                onClick={() => void chatSettings.save()}
                disabled={chatSettings.loading || chatSettings.saving || !chatSettings.hasChanges}
              >
                {chatSettings.saving ? "Saving..." : "Save"}
              </button>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
