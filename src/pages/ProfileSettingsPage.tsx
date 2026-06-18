import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import DropdownSelect from "../components/ui/DropdownSelect";
import Toggle from "../components/ui/Toggle";
import { UserAvatar } from "../components/ui/UserAvatar";
import { useToast } from "../context/ToastContext";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { api } from "../services/api";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { ALL_NIGERIA_LOCATION, NIGERIAN_AREAS, NIGERIAN_LOCATIONS } from "../lib/searchContext";

type TabKey = "edit-profile" | "company-details" | "chat-settings";

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-[#eceaf0] bg-[#faf9fc] px-4 py-3">
      <p className="text-[13px] text-[#94919d]">{label}</p>
      <p className="mt-1 text-[15px] font-medium text-ink">{value}</p>
    </div>
  );
}

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const { user, display, setUser } = useCurrentUser();
  const profileFallback = (user?.profile ?? {}) as Record<string, unknown>;
  const [activeTab, setActiveTab] = useState<TabKey>("edit-profile");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [locationState, setLocationState] = useState("");
  const [locationArea, setLocationArea] = useState("");
  const [selectedLogoName, setSelectedLogoName] = useState("");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedAvatarFile) {
      setAvatarPreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedAvatarFile);
    setAvatarPreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedAvatarFile]);

  // TODO: replace these fallbacks with real company profile fields when backend company settings are available.
  const companyDetails = {
    businessType: typeof profileFallback.businessType === "string" ? profileFallback.businessType : "Retail Business",
    businessCategory: typeof profileFallback.businessCategory === "string" ? profileFallback.businessCategory : "General Merchandise",
    registrationNumber: typeof profileFallback.registrationNumber === "string" ? profileFallback.registrationNumber : "RC-1029384",
    businessAddress: typeof profileFallback.businessAddress === "string" ? profileFallback.businessAddress : display.location || "Lagos, Nigeria",
    verificationStatus: typeof profileFallback.verificationStatus === "string" ? profileFallback.verificationStatus : "Pending verification",
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Jan 2024",
    activeAds: String(display.stats.find((stat) => stat.label.toLowerCase().includes("ads"))?.value ?? "0"),
  };

  useEffect(() => {
    setFullName(user?.fullName ?? display.fullName);
    setEmail(user?.email ?? display.email);
    setBio(user?.profile?.bio ?? display.bio);
    setPhone(user?.phone ?? display.phone);
    setAvatarUrl(user?.profile?.avatarUrl ?? display.avatarUrl);

    // Prefer structured fields when present; otherwise parse legacy `location`.
    const existingLocation = (user?.location ?? (typeof profileFallback.location === "string" ? profileFallback.location : display.location) ?? "").trim();
    const explicitState = (user?.locationState ?? "").trim();
    const explicitArea = (user?.locationArea ?? "").trim();
    if (explicitState || explicitArea) {
      setLocationState(explicitState);
      setLocationArea(explicitArea);
    } else if (existingLocation) {
      // Try "Area, State" pattern first
      const parts = existingLocation.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2 && NIGERIAN_LOCATIONS.includes(parts[parts.length - 1])) {
        setLocationState(parts[parts.length - 1]);
        setLocationArea(parts.slice(0, -1).join(", "));
      } else if (NIGERIAN_LOCATIONS.includes(existingLocation)) {
        setLocationState(existingLocation);
        setLocationArea("");
      } else {
        setLocationState("");
        setLocationArea(existingLocation);
      }
    } else {
      setLocationState("");
      setLocationArea("");
    }
  }, [display.avatarUrl, display.bio, display.email, display.fullName, display.location, display.phone, profileFallback.location, user]);

  const stateOptions = useMemo(() => NIGERIAN_LOCATIONS.filter((s) => s !== ALL_NIGERIA_LOCATION), []);
  const areasForState = locationState ? NIGERIAN_AREAS[locationState] : undefined;

  return (
    <div className="min-h-screen bg-page text-ink">
      <div className="hidden md:block">
        <SiteHeader navigate={navigate} />
      </div>

      <div className="px-4 pb-2 pt-5 sm:px-6 md:hidden">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to homepage"
          className="inline-flex items-center rounded-[10px] bg-transparent p-1 text-[#ff8300] transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-page"
        >
          <img src="/images/logo-header.png" alt="Qwik" className="h-[34px] w-[34px] object-contain" />
          <span className="ml-2 text-[28px] font-normal leading-none">qwik</span>
        </button>
      </div>

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-20 pt-8 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "profile")}
          />

          <section className="min-w-0">
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "profile")} label="Settings" />
            </div>
            <div className="rounded-card bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <label className="block cursor-pointer" aria-label="Choose profile photo">
                      <UserAvatar
                        name={fullName || display.fullName}
                        imageUrl={avatarPreviewUrl || avatarUrl}
                        alt={`${fullName || display.fullName} profile`}
                        className="h-[84px] w-[84px] rounded-full object-cover"
                      />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null;
                          setSelectedAvatarFile(file);
                          setSelectedLogoName(file?.name || "");
                        }}
                      />
                    </label>
                  </div>
                  <div>
                    <h1 className="text-[28px] font-medium leading-tight sm:text-[32px]">{fullName || display.fullName}</h1>
                    <p className="text-[16px] text-[#8c8996]">{email || ""}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 text-center sm:gap-10">
                  {display.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[24px] sm:text-[28px]">{stat.value}</p>
                      <p className="text-[14px] text-[#8c8996] sm:text-[15px]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-[760px] max-w-full">
              <div className="mb-6 flex flex-wrap gap-3 text-[16px] sm:text-[18px]">
                <button
                  className={`whitespace-nowrap ${activeTab === "edit-profile" ? "font-medium text-ink" : "text-[#9794a1]"}`}
                  onClick={() => setActiveTab("edit-profile")}
                  type="button"
                >
                  Edit Profile
                </button>
                <button
                  className={`whitespace-nowrap ${activeTab === "company-details" ? "font-medium text-ink" : "text-[#9794a1]"}`}
                  onClick={() => setActiveTab("company-details")}
                  type="button"
                >
                  Company details
                </button>
                <button
                  className={`whitespace-nowrap ${activeTab === "chat-settings" ? "font-medium text-ink" : "text-[#9794a1]"}`}
                  onClick={() => setActiveTab("chat-settings")}
                  type="button"
                >
                  Chat settings
                </button>
              </div>

              {activeTab === "edit-profile" ? (
                <>
                  <label className="mb-2 block text-[15px] text-[#94919d]">Business Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mb-5 h-12 w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 text-[15px] outline-none" placeholder="Enter your business name" />

                  <label className="mb-2 block text-[15px] text-[#94919d]">Description</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mb-5 h-[120px] w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 py-3 text-[15px] outline-none" placeholder="What does your company do?" />

                  <label className="mb-2 block text-[15px] text-[#94919d]">Profile / Logo Upload</label>
                  <label className="mb-5 flex min-h-[52px] w-full cursor-pointer items-center justify-between rounded-[10px] border border-dashed border-[#dedde4] px-3 text-[15px] text-[#6c6a74]">
                    <span className="truncate">{selectedLogoName || "Choose a logo or profile image"}</span>
                    <span className="ml-4 shrink-0 text-[#ff7f11]">Browse</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null;
                        setSelectedAvatarFile(file);
                        setSelectedLogoName(file?.name || "");
                      }}
                    />
                  </label>

                  <label className="mb-2 block text-[15px] text-[#94919d]">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-5 h-12 w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 text-[15px] outline-none" placeholder="@mail" />

                  <label className="mb-2 block text-[15px] text-[#94919d]">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mb-5 h-12 w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 text-[15px] outline-none" placeholder="0800 000 0000" />

                  <div className="mb-5 space-y-4">
                    <DropdownSelect
                      label="State"
                      placeholder="Select your state"
                      value={locationState}
                      options={stateOptions.map((s) => ({ value: s, label: s }))}
                      onChange={(val) => { setLocationState(val); setLocationArea(""); }}
                    />
                    {locationState && areasForState ? (
                      <DropdownSelect
                        label="Area"
                        placeholder="Select your area"
                        value={locationArea}
                        options={areasForState.map((a) => ({ value: a, label: a }))}
                        onChange={setLocationArea}
                      />
                    ) : locationState ? (
                      <div>
                        <label className="mb-2 block text-[15px] text-[#94919d]">Area</label>
                        <input type="text" value={locationArea} onChange={(e) => setLocationArea(e.target.value)} className="h-12 w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 text-[15px] outline-none" placeholder="City or area (optional)" />
                      </div>
                    ) : null}
                  </div>

                  <button className="h-[50px] w-full rounded-[10px] bg-gradient-to-r from-amber to-orange text-[16px] text-white shadow-glow transition-all duration-200 hover:opacity-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white" type="button" onClick={async () => {
                    try {
                      setLoading(true);
                      let nextAvatarUrl = avatarUrl;
                      if (selectedAvatarFile) {
                        const uploadResponse = await api.uploadImages([selectedAvatarFile]);
                        nextAvatarUrl = uploadResponse.data.urls[0] || "";
                      }
                      const trimmedState = locationState.trim();
                      const trimmedArea = locationArea.trim();
                      const composedLocation = trimmedState
                        ? (trimmedArea ? `${trimmedArea}, ${trimmedState}` : trimmedState)
                        : trimmedArea;
                      const response = await api.updateMe({ fullName, bio, phone, location: composedLocation, locationState: trimmedState || undefined, locationArea: trimmedArea || undefined, ...(nextAvatarUrl ? { avatarUrl: nextAvatarUrl } : {}) });
                      setUser(response.data);
                      setAvatarUrl(response.data.profile?.avatarUrl || "");
                      setSelectedAvatarFile(null);
                      setSelectedLogoName("");
                      success("Profile updated");
                    } catch (error) {
                      showError(error instanceof Error ? error.message : "Failed to update profile");
                    } finally {
                      setLoading(false);
                    }
                  }}>
                    {loading ? "Saving..." : "Save"}
                  </button>
                </>
              ) : null}

              {activeTab === "company-details" ? (
                <>
                  <div className="mb-5 grid gap-4 sm:grid-cols-2">
                    <DetailCard label="Verification Status" value={companyDetails.verificationStatus} />
                    <DetailCard label="Active Ads" value={companyDetails.activeAds} />
                  </div>

                  <div className="space-y-4">
                    <DetailCard label="Business Type" value={companyDetails.businessType} />
                    <DetailCard label="Business Category" value={companyDetails.businessCategory} />
                    <DetailCard label="Registration Number" value={companyDetails.registrationNumber} />
                    <DetailCard label="Business Address" value={companyDetails.businessAddress} />
                    <DetailCard label="Member Since" value={companyDetails.memberSince} />
                  </div>
                </>
              ) : null}

              {activeTab === "chat-settings" ? (
                <div className="max-w-[584px] space-y-[24px]">
                  <div className="flex items-center justify-between gap-6 rounded-[14px] border border-[#eceaf0] bg-white px-4 py-4">
                    <span className="text-[16px] text-[#9c98a5]">Receive messages</span>
                    <Toggle size="sm" defaultChecked ariaLabelChecked="Disable receive messages" ariaLabelUnchecked="Enable receive messages" />
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>

      <div className="hidden md:block">
        <SiteFooter navigate={navigate} />
      </div>
    </div>
  );
}
