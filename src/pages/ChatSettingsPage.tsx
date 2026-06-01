import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { BellIcon, BoxIcon, InfoIcon, LogoutIcon, PhoneIcon, TicketIcon, UserIcon } from "../components/icons/SettingsIcons";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import Toggle from "../components/ui/Toggle";

function ToggleRow({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <p className="text-[16px] sm:text-[18px] text-[#9794a1]">{label}</p>
      <Toggle checked />
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
          <SettingsSidebar
            className="hidden md:block"
            items={[
              { label: "Profile", icon: <UserIcon />, active: true, onClick: () => navigate("/profile-settings") },
              { label: "Ads", icon: <BoxIcon />, onClick: () => navigate("/ads-dashboard") },
              { label: "Make money", icon: <TicketIcon />, onClick: () => navigate("/promote-ad") },
              { label: "Notification", icon: <BellIcon />, onClick: () => navigate("/notification-settings") },
              { label: "Help", icon: <PhoneIcon />, onClick: () => navigate("/messages") },
              { label: "About", icon: <InfoIcon />, onClick: () => navigate("/") },
              { label: "Log out", icon: <LogoutIcon />, onClick: () => navigate("/signin") },
            ]}
          />

          <section>
            <div className="mb-4">
              <MobileSettingsMenu items={[
                { label: "Profile", icon: <UserIcon />, active: true, onClick: () => navigate("/profile-settings") },
                { label: "Ads", icon: <BoxIcon />, onClick: () => navigate("/ads-dashboard") },
                { label: "Make money", icon: <TicketIcon />, onClick: () => navigate("/promote-ad") },
                { label: "Notification", icon: <BellIcon />, onClick: () => navigate("/notification-settings") },
                { label: "Help", icon: <PhoneIcon />, onClick: () => navigate("/messages") },
                { label: "About", icon: <InfoIcon />, onClick: () => navigate("/") },
                { label: "Log out", icon: <LogoutIcon />, onClick: () => navigate("/signin") },
              ]} label="Settings" />
            </div>
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
                    <h1 className="text-[26px] font-medium leading-tight sm:text-[30px]">Sherry James</h1>
                    <p className="text-[16px] text-[#8c8996] sm:text-[18px]">Imshuvo97@gmail.com</p>
                  </div>
                </div>
                <div className="flex gap-10 text-center">
                  <div>
                    <p className="text-[24px] sm:text-[28px]">12</p>
                    <p className="text-[18px] text-[#8c8996]">Following</p>
                  </div>
                  <div>
                    <p className="text-[24px] sm:text-[28px]">23</p>
                    <p className="text-[18px] text-[#8c8996]">Followers</p>
                  </div>
                  <div>
                    <p className="text-[24px] sm:text-[28px]">17</p>
                    <p className="text-[18px] text-[#8c8996]">adverts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-[760px]">
              <div className="mb-10 flex flex-nowrap gap-5 text-[16px] sm:text-[20px]">
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

              <button className="mt-2 h-[48px] w-full max-w-[420px] rounded-[14px] bg-gradient-to-r from-amber to-orange text-[18px] text-white shadow-glow sm:h-[54px] sm:text-[20px]" type="button">
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
