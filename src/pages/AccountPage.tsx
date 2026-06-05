import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { CurrentUserDisplay } from "../lib/currentUser";
import { clearAllAuthData } from "../services/auth";
import { QwikLogo } from "../components/ui/QwikLogo";
import { IconButton } from "../components/ui/IconButton";
import { UserAvatar } from "../components/ui/UserAvatar";
import { getSettingsNavItems } from "../lib/settings-nav-config";

type TabKey = "profile" | "company" | "chat";
type MenuItem = { label: string; icon: ReactNode; active?: boolean; to?: string };

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function BookmarkIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M6.5 4.8c0-1 .8-1.8 1.8-1.8h7.4c1 0 1.8.8 1.8 1.8v16.1L12 17.5l-5.5 3.4V4.8Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M18 9.5a6 6 0 0 0-12 0c0 7-2.6 7.5-2.6 7.5h17.2S18 16.5 18 9.5" />
      <path d="M14.2 20a2.4 2.4 0 0 1-4.4 0" />
    </svg>
  );
}

function MessageIcon({ className = "h-[21px] w-[21px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <path d="m7.5 9.5 4.5 3.3 4.5-3.3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M19 10c0 5.3-7 10-7 10s-7-4.7-7-10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M9 5v3h6V5" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <path d="M12 7v2M12 11v2M12 15v2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M22 16.9v2.5a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 2.1 3.7 2 2 0 0 1 4.1 1.5h2.5a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1l-1 1a16 16 0 0 0 6 6l1-1a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M14 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3" />
      <path d="M9 12h11M17 9l3 3-3 3" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
      <path d="M5 16.9V20h3.1L17.3 10.8l-3.1-3.1L5 16.9Zm14.7-8.5a.8.8 0 0 0 0-1.2l-1.9-1.9a.8.8 0 0 0-1.2 0l-1.5 1.5 3.1 3.1 1.5-1.5Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M16.5 12.8c0-2 1.7-3 1.8-3.1-1-.1-2-.6-2.6-1.3-1.1-1.1-2.7-1-3.4-.7-.7.3-1.3.7-2 .7-.8 0-1.5-.4-2.3-.7-1-.4-2.3-.1-3.2.8-1.7 1.8-1.4 5.2.3 7.9.8 1.3 1.8 2.7 3.1 2.7 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.5c.5-.7.8-1.5 1-2.1-.1-.1-2.1-.8-2.1-3.7ZM14.9 6.5c.7-.8 1.1-1.8 1-2.8-1 .1-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1.1.1 2.1-.5 2.7-1.4Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M5.5 3.6v16.8L14 12 5.5 3.6Zm1.4-.9 9.8 5.6-2 2L6.9 2.7Zm0 18.6 7.8-7.6 2 2-9.8 5.6Zm10.8-12.4 2.4 1.4c1.2.7 1.2 2.1 0 2.8l-2.4 1.4-2.2-2.8 2.2-2.8Z" />
    </svg>
  );
}

function Field({ label, placeholder, type = "text", icon, defaultValue = "" }: { label: string; placeholder: string; type?: string; icon?: ReactNode; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-[10px] block text-[16px] text-[#9c98a5]">{label}</span>
      <span className="flex h-[49px] w-full max-w-[322px] items-center rounded-[8px] border border-card bg-page px-[12px] focus-within:border-orange md:max-w-[322px]">
        <input className="min-w-0 flex-1 bg-transparent text-[17px] text-ink outline-none placeholder:text-[#a4a0aa]" type={type} placeholder={placeholder} defaultValue={defaultValue} />
        {icon ? <span className="ml-3 shrink-0 text-ink">{icon}</span> : null}
      </span>
    </label>
  );
}

function SaveButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={`h-[49px] w-full max-w-[322px] rounded-[8px] bg-gradient-to-r from-amber to-orange text-[16px] text-white shadow-glow ${className}`}>
      Save
    </button>
  );
}

function Toggle() {
  const [enabled, setEnabled] = useState(true);

  return (
    <button
      type="button"
      className={`flex h-[42px] w-[78px] items-center rounded-full p-[4px] transition ${enabled ? "justify-end bg-gradient-to-r from-amber/30 to-orange/20" : "justify-start bg-card"}`}
      onClick={() => setEnabled((value) => !value)}
      aria-label={enabled ? "Disable receive messages" : "Enable receive messages"}
    >
      <span className={`h-[34px] w-[34px] rounded-full ${enabled ? "bg-gradient-to-r from-amber to-orange" : "bg-muted"}`} />
    </button>
  );
}

function ProfileSummary({ display }: { display: CurrentUserDisplay }) {
  return (
    <section className="flex min-w-0 flex-col gap-7 rounded-[24px] bg-white px-[28px] py-[34px] sm:px-[40px] lg:h-[164px] lg:flex-row lg:items-center lg:justify-between lg:px-[40px]">
      <div className="flex min-w-0 flex-col items-start gap-[16px] sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <UserAvatar
            name={display.fullName}
            imageUrl={display.avatarUrl}
            alt={`${display.fullName} profile`}
            className="h-[84px] w-[84px] rounded-full bg-[#df8ca2] object-cover"
          />
          <button type="button" className="absolute bottom-0 right-[-2px] grid h-[28px] w-[28px] place-items-center rounded-full border border-card bg-white text-ink" aria-label="Edit profile picture">
            <PencilIcon />
          </button>
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[22px] font-normal leading-tight text-ink sm:text-[26px]">{display.fullName}</h1>
          <p className="truncate text-[14px] text-muted sm:text-[16px]">{display.email}</p>
        </div>
      </div>

      <div className="grid w-full max-w-[300px] grid-cols-3 gap-4 text-center lg:max-w-[330px]">
        {display.stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-[22px] leading-tight text-ink sm:text-[24px]">{stat.value}</p>
            <p className="text-[14px] text-muted sm:text-[16px]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tabs({ activeTab, onChange }: { activeTab: TabKey; onChange: (tab: TabKey) => void }) {
  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "profile", label: "Edit Profile" },
    { key: "company", label: "Company details" },
    { key: "chat", label: "Chat settings" }
  ];

  return (
    <div className="-mx-1 flex gap-[28px] overflow-x-auto px-1 pb-1">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.key}
          className={`shrink-0 text-[16px] leading-none sm:text-[18px] ${activeTab === tab.key ? "text-ink" : "text-[#9c98a5]"}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function EditProfileForm({ display }: { display: CurrentUserDisplay }) {
  return (
    <div className="mt-[44px] w-full max-w-[322px]">
      <div className="space-y-[24px]">
        <Field label="Full Name" placeholder="Enter your full name" defaultValue={display.fullName === "Qwik User" ? "" : display.fullName} />
        <Field label="Email" placeholder="@mail" type="email" defaultValue={display.email} />
        <Field label="Password" placeholder="*********" type="password" icon={<EyeIcon />} />
        <Field label="Phone Number" placeholder="0800 000 0000" type="tel" defaultValue={display.phone} />
        <Field label="Address" placeholder="Where do you live?" defaultValue={display.location} />
      </div>
      <button type="button" className="mt-[24px] flex w-full items-center justify-between text-left text-[16px] text-red-600 underline">
        Delete my account
        <ArrowRightIcon />
      </button>
      <SaveButton className="mt-[27px]" />
    </div>
  );
}

function CompanyDetailsForm({ display }: { display: CurrentUserDisplay }) {
  return (
    <div className="mt-[48px] w-full max-w-[584px]">
      <div className="space-y-[34px]">
        <Field label="Business Name" placeholder="Enter your full name" defaultValue={display.fullName === "Qwik User" ? "" : display.fullName} />
        <label className="block">
          <span className="mb-[10px] block text-[16px] text-[#9c98a5]">Description</span>
          <textarea
            className="h-[210px] w-full max-w-[584px] resize-none rounded-[8px] border border-card bg-page px-[20px] py-[22px] text-[17px] text-ink outline-none placeholder:text-[#a4a0aa] focus:border-orange"
            placeholder="What does your company do?"
            defaultValue={display.bio}
          />
        </label>
      </div>
      <SaveButton className="mt-[44px] max-w-[584px]" />
    </div>
  );
}

function ChatSettingsForm() {
  return (
    <div className="mt-[62px] w-full max-w-[584px]">
      <div className="space-y-[34px]">
        <div className="flex max-w-[584px] items-center justify-between gap-6">
          <span className="text-[16px] text-[#9c98a5]">Receive messages</span>
          <Toggle />
        </div>
        <div className="flex max-w-[584px] items-center justify-between gap-6">
          <span className="text-[16px] text-[#9c98a5]">Receive messages</span>
          <Toggle />
        </div>
      </div>
      <SaveButton className="mt-[44px] max-w-[584px]" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full overflow-hidden bg-deep px-[24px] py-[48px] text-[#5f5d6c] sm:px-[48px] lg:px-[70px] lg:pb-[116px] lg:pt-[112px]">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-[34px] xl:grid-cols-[minmax(80px,0.7fr)_minmax(390px,3.2fr)_minmax(140px,1fr)_minmax(300px,1.8fr)] xl:gap-[32px] 2xl:gap-[76px]">
        <div className="min-w-0 text-[38px] font-normal leading-none text-orange xl:pt-[4px]">qwik</div>

        <div className="grid min-w-0 grid-cols-3 gap-x-[14px] gap-y-7">
          <div className="min-w-0">
            <h5 className="mb-[16px] text-[14px] font-semibold text-white sm:text-[15px] xl:mb-[28px] xl:text-[17px]">About</h5>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">About Qwik</a>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Career</a>
            <a className="block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:text-[17px]">Terms</a>
          </div>

          <div className="min-w-0">
            <h5 className="mb-[16px] text-[14px] font-semibold text-white sm:text-[15px] xl:mb-[28px] xl:text-[17px]">Resources</h5>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Blog</a>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Instagram</a>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Youtube</a>
            <a className="block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:text-[17px]">Twitter</a>
          </div>

          <div className="min-w-0">
            <h5 className="mb-[16px] text-[14px] font-semibold text-white sm:text-[15px] xl:mb-[28px] xl:text-[17px]">Support</h5>
            <a className="mb-[13px] block break-words text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">help@qwik.ng</a>
            <a className="block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:text-[17px]">FAQs</a>
          </div>
        </div>

        <div className="min-w-0">
          <h5 className="mb-[16px] text-[15px] font-semibold text-white xl:mb-[24px] xl:text-[17px]">Download</h5>
          <div className="flex w-full min-w-0 flex-row gap-[10px] xl:flex-col xl:gap-0">
            <button className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[8px] bg-card/10 text-[14px] text-[#5f5d6c] sm:text-[15px] xl:mb-[24px] xl:h-[58px] xl:w-[142px] xl:flex-none xl:text-[17px]">
              <AppleIcon />
              App Store
            </button>
            <button className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[8px] bg-card/10 text-[14px] text-[#5f5d6c] sm:text-[15px] xl:h-[58px] xl:w-[142px] xl:flex-none xl:text-[17px]">
              <PlayIcon />
              Play Store
            </button>
          </div>
        </div>

        <div className="min-w-0 max-w-full">
          <h5 className="mb-[10px] text-[15px] font-semibold text-white xl:mb-[11px] xl:text-[17px]">Stay up to date</h5>
          <p className="mb-[16px] text-[14px] leading-[1.45] text-[#5f5d6c] sm:text-[15px] xl:mb-[18px] xl:text-[17px] xl:leading-[1.35]">Get news, offers, promotions & the best deals sent to your inbox.</p>
          <div className="flex w-full min-w-0 flex-col gap-[10px] xl:flex-row xl:flex-nowrap xl:gap-[8px]">
            <input className="h-[54px] min-w-0 flex-1 rounded-[8px] border border-orange bg-transparent px-[14px] text-[16px] text-muted outline-none xl:h-[48px] xl:px-[12px]" placeholder="@email" />
            <button className="h-[52px] w-full shrink-0 rounded-[8px] bg-gradient-to-r from-amber to-orange px-[18px] text-[16px] text-white shadow-glow xl:h-[48px] xl:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function AccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const { display } = useCurrentUser();

  const menuItems: MenuItem[] = [
    { label: "Profile", icon: <UserIcon />, active: true, to: "/profile-settings" },
    { label: "Ads", icon: <BoxIcon />, to: "/ads-dashboard" },
    { label: "Make money", icon: <TicketIcon />, to: "/promote-ad" },
    { label: "Notification", icon: <BellIcon />, to: "/notification-settings" },
    { label: "Help", icon: <PhoneIcon />, to: "/messages" },
    { label: "About", icon: <InfoIcon />, to: "/" },
    { label: "Log out", icon: <LogoutIcon />, to: "/signin" }
  ];

  const mobileItems = menuItems.map((item) => ({
    label: item.label,
    icon: item.icon,
    active: item.active,
    onClick: () => {
      if (item.to) {
        if (item.label === "Log out") {
          clearAllAuthData();
        }
        navigate(item.to);
      }
    },
  }));

  return (
    <div className="min-h-screen bg-page font-outfit text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto grid w-full max-w-[1512px] grid-cols-1 gap-[32px] px-[24px] pb-[60px] pt-[48px] sm:px-[60px] lg:grid-cols-[310px_1fr] lg:gap-[32px] lg:pb-[58px]">
        <aside className="hidden min-w-0 self-start rounded-[18px] bg-white p-[16px] md:block">
          <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-col lg:gap-[22px]">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (!item.to) {
                    return;
                  }

                  if (item.label === "Log out") {
                    clearAllAuthData();
                  }

                  navigate(item.to);
                }}
                className={`flex h-[72px] items-center gap-[18px] rounded-[14px] px-[18px] text-[16px] ${
                  item.active ? "bg-page text-ink" : "text-[#9c98a5]"
                } w-full`}
              >
                {item.icon}
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="mb-4">
            <MobileSettingsMenu items={mobileItems} label="Menu" title="Account" />
          </div>
          <ProfileSummary display={display} />
          <div className="mt-[42px]">
            <Tabs activeTab={activeTab} onChange={setActiveTab} />
            {activeTab === "profile" ? <EditProfileForm display={display} /> : null}
            {activeTab === "company" ? <CompanyDetailsForm display={display} /> : null}
            {activeTab === "chat" ? <ChatSettingsForm /> : null}
          </div>
        </section>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
