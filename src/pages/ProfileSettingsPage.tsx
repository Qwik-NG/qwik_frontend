import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { api } from "../services/api";
import { clearToken } from "../services/auth";
import { getSettingsNavItems } from "../lib/settings-nav-config";

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void api.me()
      .then((res) => {
        setFullName(res.data.fullName ?? "");
        setEmail(res.data.email ?? "");
        setBio(res.data.profile?.bio ?? "");
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "profile")}
          />

          <section>
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "profile")} label="Settings" />
            </div>
            <div className="rounded-card bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img className="h-[84px] w-[84px] rounded-full object-cover" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120" alt="profile" />
                  </div>
                  <div>
                    <h1 className="text-[42px] font-medium leading-tight">{fullName || "Profile"}</h1>
                    <p className="text-[20px] text-[#8c8996]">{email || "-"}</p>
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
                <button className="whitespace-nowrap text-[#9794a1]" type="button">
                  Edit Profile
                </button>
                <button className="whitespace-nowrap font-medium" type="button">
                  Company details
                </button>
                <button className="whitespace-nowrap text-[#9794a1]" onClick={() => navigate("/chat-settings")} type="button">
                  Chat settings
                </button>
              </div>

              <label className="mb-2 block text-[16px] text-[#94919d]">Business Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mb-5 h-12 w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 text-[17px] outline-none" placeholder="Enter your full name" />

              <label className="mb-2 block text-[16px] text-[#94919d]">Description</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mb-5 h-[120px] w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 py-3 text-[17px] outline-none" placeholder="What does your company do?" />

              <button className="h-[50px] w-full rounded-[10px] bg-gradient-to-r from-amber to-orange text-[18px] text-white shadow-glow" type="button" onClick={async () => {
                try {
                  setLoading(true);
                  await api.updateMe({ fullName, bio });
                  window.alert("Profile updated");
                } catch (error) {
                  window.alert(error instanceof Error ? error.message : "Failed to update profile");
                } finally {
                  setLoading(false);
                }
              }}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
