import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

function MenuItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
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
              <MenuItem label="Profile" active />
              <MenuItem label="Ads" />
              <MenuItem label="Make money" />
              <MenuItem label="Notification" />
              <MenuItem label="Help" />
              <MenuItem label="About" />
              <MenuItem label="Log out" />
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
                    <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#f2f2f5] text-[14px]" type="button">
                      ✎
                    </button>
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
                <button className="whitespace-nowrap text-[#9794a1]" onClick={() => navigate("/profile-settings")} type="button">Edit Profile</button>
                <button className="whitespace-nowrap text-[#9794a1]" onClick={() => navigate("/profile-settings")} type="button">Company details</button>
                <button className="whitespace-nowrap font-medium" type="button">Chat settings</button>
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
