import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

function MenuItem({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex h-[58px] w-full items-center gap-3 rounded-[12px] px-4 text-left text-[16px] ${
        active ? "bg-[#efefef] text-[#1f1d27]" : "text-[#94919d]"
      }`}
    >
      <span className="text-[20px]">◌</span>
      <span>{label}</span>
    </button>
  );
}

export default function ProfileSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <aside className="rounded-[20px] bg-white p-4">
            <div className="space-y-2">
              <MenuItem label="Profile" active onClick={() => navigate("/profile-settings")} />
              <MenuItem label="Ads" onClick={() => navigate("/ads-dashboard")} />
              <MenuItem label="Make money" onClick={() => navigate("/promote-ad")} />
              <MenuItem label="Notification" onClick={() => navigate("/notification-settings")} />
              <MenuItem label="Help" onClick={() => navigate("/messages")} />
              <MenuItem label="About" onClick={() => navigate("/")} />
              <MenuItem label="Log out" onClick={() => navigate("/signin")} />
            </div>
          </aside>

          <section>
            <div className="rounded-[20px] bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img className="h-[84px] w-[84px] rounded-full object-cover" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120" alt="profile" />
                    <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#f2f2f5] text-[14px]" type="button">✎</button>
                  </div>
                  <div>
                    <h1 className="text-[42px] font-medium leading-tight">Sherry James</h1>
                    <p className="text-[20px] text-[#8c8996]">Imshuvo97@gmail.com</p>
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

            <div className="mt-6 max-w-[520px]">
              <div className="mb-6 flex flex-nowrap gap-3 text-[20px] sm:text-[24px]">
                <button className="whitespace-nowrap text-[#9794a1]" type="button">Edit Profile</button>
                <button className="whitespace-nowrap font-medium" type="button">Company details</button>
                <button className="whitespace-nowrap text-[#9794a1]" onClick={() => navigate("/chat-settings")} type="button">Chat settings</button>
              </div>

              <label className="mb-2 block text-[16px] text-[#94919d]">Business Name</label>
              <input className="mb-5 h-12 w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 text-[17px] outline-none" placeholder="Enter your full name" />

              <label className="mb-2 block text-[16px] text-[#94919d]">Description</label>
              <textarea className="mb-5 h-[120px] w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 py-3 text-[17px] outline-none" placeholder="What does your company do?" />

              <button className="h-[50px] w-full rounded-[10px] bg-gradient-to-r from-amber to-orange text-[18px] text-white shadow-glow" type="button">
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




