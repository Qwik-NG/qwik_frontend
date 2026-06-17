import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { CurrentUserDisplay } from "../lib/currentUser";
import { api } from "../services/api";
import { clearAllAuthData } from "../services/auth";
import { disconnectRealtimeSocket } from "../services/realtime";
import { QwikLogo } from "../components/ui/QwikLogo";
import { IconButton } from "../components/ui/IconButton";
import Toggle from "../components/ui/Toggle";
import { UserAvatar } from "../components/ui/UserAvatar";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { useToast } from "../context/ToastContext";

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

function Field({
  label,
  placeholder,
  type = "text",
  icon,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  icon?: ReactNode;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-[10px] block text-[16px] text-[#9c98a5]">{label}</span>
      <span className="flex h-[49px] w-full max-w-[322px] items-center rounded-[8px] border border-card bg-page px-[12px] focus-within:border-orange md:max-w-[322px]">
        <input
          className="min-w-0 flex-1 bg-transparent text-[17px] text-ink outline-none placeholder:text-[#a4a0aa] read-only:text-[#6f6b78]"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          readOnly={readOnly}
        />
        {icon ? <span className="ml-3 shrink-0 text-ink">{icon}</span> : null}
      </span>
    </label>
  );
}

function SaveButton({ className = "", disabled = false, loading = false, type = "button" }: { className?: string; disabled?: boolean; loading?: boolean; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`flex h-[49px] w-full max-w-[322px] items-center justify-center gap-2 rounded-[8px] bg-gradient-to-r from-amber to-orange text-[16px] text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> : null}
      {loading ? "Saving..." : "Save"}
    </button>
  );
}

function SummaryItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`min-w-0 rounded-[14px] border border-[#eceaf0] bg-[#faf9fc] px-4 py-3 ${className}`}>
      <p className="text-[13px] text-[#94919d]">{label}</p>
      <p className="mt-1 break-words text-[15px] font-medium leading-snug text-ink">{value || "Not added yet"}</p>
    </div>
  );
}

function ProfileSummary({
  display,
  avatarImageUrl,
  avatarFileName,
  savingAvatar,
  onAvatarFileChange,
  onSaveAvatar,
}: {
  display: CurrentUserDisplay;
  avatarImageUrl: string;
  avatarFileName: string;
  savingAvatar: boolean;
  onAvatarFileChange: (file: File | null) => void;
  onSaveAvatar: () => void;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-7 rounded-[24px] bg-white px-[28px] py-[34px] sm:px-[40px] lg:h-[164px] lg:flex-row lg:items-center lg:justify-between lg:px-[40px]">
      <div className="flex min-w-0 flex-col items-start gap-[16px] sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <label className="block cursor-pointer" aria-label="Choose profile photo">
            <UserAvatar
              name={display.fullName}
              imageUrl={avatarImageUrl}
              alt={`${display.fullName} profile`}
              className="h-[84px] w-[84px] rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(event) => onAvatarFileChange(event.target.files?.[0] ?? null)}
            />
          </label>
          <label className="absolute bottom-0 right-[-2px] grid h-[28px] w-[28px] cursor-pointer place-items-center rounded-full border border-card bg-white text-ink" aria-label="Edit profile picture">
            <PencilIcon />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(event) => onAvatarFileChange(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[22px] font-normal leading-tight text-ink sm:text-[26px]">{display.fullName}</h1>
          <p className="truncate text-[14px] text-muted sm:text-[16px]">{display.email}</p>
          {avatarFileName ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="max-w-[220px] truncate text-[13px] text-muted">{avatarFileName}</span>
              <button
                type="button"
                onClick={onSaveAvatar}
                disabled={savingAvatar}
                className="h-[34px] rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 text-[13px] font-medium text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingAvatar ? "Saving..." : "Save photo"}
              </button>
            </div>
          ) : null}
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

function EditProfilePanel({
  display,
  isEditing,
  fullName,
  bio,
  email,
  phone,
  location,
  avatarImageUrl,
  selectedAvatarFileName,
  saving,
  onEdit,
  onSubmit,
  onAvatarFileChange,
  onFullNameChange,
  onBioChange,
  onPhoneChange,
  onLocationChange,
}: {
  display: CurrentUserDisplay;
  isEditing: boolean;
  fullName: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatarImageUrl: string;
  selectedAvatarFileName: string;
  saving: boolean;
  onEdit: () => void;
  onSubmit: () => void;
  onAvatarFileChange: (file: File | null) => void;
  onFullNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}) {
  if (!isEditing) {
    return (
      <div className="mt-[34px] w-full max-w-[720px] rounded-[22px] bg-white p-5 shadow-[0_18px_48px_rgba(24,20,31,0.06)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <UserAvatar
              name={display.fullName}
              imageUrl={avatarImageUrl}
              alt={`${display.fullName} profile`}
              className="h-[76px] w-[76px] shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="text-[13px] uppercase tracking-[0.12em] text-[#94919d]">Saved profile</p>
              <h2 className="mt-1 break-words text-[24px] font-medium leading-tight text-ink">{display.fullName}</h2>
              <p className="mt-1 break-words text-[15px] text-[#7d7986]">{email || "No email added"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="h-[44px] shrink-0 rounded-[10px] border border-[#eceaf0] px-4 text-[15px] font-medium text-ink transition hover:border-orange hover:text-orange"
          >
            Edit Profile
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <SummaryItem label="Business/Profile name" value={display.fullName} />
          <SummaryItem label="Phone" value={phone} />
          <SummaryItem label="Email" value={email} />
          <SummaryItem label="Address" value={location} />
          <SummaryItem label="Description" value={bio} className="sm:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <form
      className="mt-[44px] w-full max-w-[584px]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-[24px]">
        <Field label="Business/Profile Name" placeholder="Enter your business or profile name" value={fullName} onChange={onFullNameChange} />
        <label className="block">
          <span className="mb-[10px] block text-[16px] text-[#9c98a5]">Description</span>
          <textarea
            className="h-[150px] w-full max-w-[584px] resize-none rounded-[8px] border border-card bg-page px-[20px] py-[18px] text-[17px] text-ink outline-none placeholder:text-[#a4a0aa] focus:border-orange"
            placeholder="What should buyers know about you or your business?"
            value={bio}
            onChange={(event) => onBioChange(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-[10px] block text-[16px] text-[#9c98a5]">Profile / Logo Image</span>
          <span className="flex min-h-[54px] w-full max-w-[584px] cursor-pointer items-center justify-between gap-4 rounded-[8px] border border-dashed border-card bg-page px-[16px] text-[15px] text-[#6c6a74]">
            <span className="min-w-0 truncate">{selectedAvatarFileName || (avatarImageUrl ? "Current profile image saved" : "Choose a logo or profile image")}</span>
            <span className="shrink-0 text-orange">Browse</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(event) => onAvatarFileChange(event.target.files?.[0] ?? null)}
            />
          </span>
        </label>
        <Field label="Email" placeholder="@mail" type="email" value={email} readOnly />
        <Field label="Phone Number" placeholder="0800 000 0000" type="tel" value={phone} onChange={onPhoneChange} />
        <Field label="Address" placeholder="Where do you live?" value={location} onChange={onLocationChange} />
      </div>
      <button type="button" className="mt-[24px] flex w-full max-w-[322px] items-center justify-between text-left text-[16px] text-red-600 underline">
        Delete my account
        <ArrowRightIcon />
      </button>
      <SaveButton className="mt-[27px] max-w-[584px]" type="submit" loading={saving} disabled={saving || fullName.trim().length < 2} />
    </form>
  );
}

function CompanyDetailsForm({ display }: { display: CurrentUserDisplay }) {
  return (
    <div className="mt-[48px] w-full max-w-[584px]">
      <div className="space-y-[34px]">
        <Field label="Business Name" placeholder="Enter your full name" value={display.fullName === "Qwik User" ? "" : display.fullName} readOnly />
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
          <Toggle size="lg" defaultChecked ariaLabelChecked="Disable receive messages" ariaLabelUnchecked="Enable receive messages" className="bg-card" />
        </div>
        <div className="flex max-w-[584px] items-center justify-between gap-6">
          <span className="text-[16px] text-[#9c98a5]">Receive messages</span>
          <Toggle size="lg" defaultChecked ariaLabelChecked="Disable receive messages" ariaLabelUnchecked="Enable receive messages" className="bg-card" />
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
  const { display, setUser, loading: loadingUser } = useCurrentUser();
  const { success, error: showError } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileModeInitialized, setProfileModeInitialized] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setFullName(display.fullName === "Qwik User" ? "" : display.fullName);
    setBio(display.bio);
    setPhone(display.phone);
    setLocation(display.location);
    if (!loadingUser && !profileModeInitialized) {
      setIsEditingProfile(!(display.fullName !== "Qwik User" || display.bio || display.phone || display.location || display.avatarUrl));
      setProfileModeInitialized(true);
    }
  }, [display.avatarUrl, display.bio, display.fullName, display.location, display.phone, loadingUser, profileModeInitialized]);

  useEffect(() => {
    if (!selectedAvatarFile) {
      setAvatarPreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedAvatarFile);
    setAvatarPreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedAvatarFile]);

  const saveAvatar = async () => {
    if (!selectedAvatarFile || savingAvatar) return;

    try {
      setSavingAvatar(true);
      const uploadResponse = await api.uploadImages([selectedAvatarFile]);
      const avatarUrl = uploadResponse.data.urls[0] || "";
      const response = await api.updateMe({ avatarUrl });
      setUser(response.data);
      setSelectedAvatarFile(null);
      success("Profile photo updated");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to update profile photo");
    } finally {
      setSavingAvatar(false);
    }
  };

  const saveProfile = async () => {
    if (savingProfile) return;

    try {
      setSavingProfile(true);
      let nextAvatarUrl = display.avatarUrl;
      if (selectedAvatarFile) {
        const uploadResponse = await api.uploadImages([selectedAvatarFile]);
        nextAvatarUrl = uploadResponse.data.urls[0] || "";
      }

      const response = await api.updateMe({
        fullName: fullName.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
        location: location.trim(),
        avatarUrl: nextAvatarUrl,
      });
      setUser(response.data);
      setSelectedAvatarFile(null);
      setIsEditingProfile(false);
      success("Profile updated");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Profile", icon: <UserIcon />, active: true, to: "/profile-settings" },
    { label: "Ads", icon: <BoxIcon />, to: "/ads-dashboard" },
    { label: "Start selling", icon: <TicketIcon />, to: "/promote-ad" },
    { label: "Notification", icon: <BellIcon />, to: "/notification-settings" },
    { label: "Help", icon: <PhoneIcon />, to: "/messages" },
    { label: "About", icon: <InfoIcon />, to: "/" },
    { label: "Log out", icon: <LogoutIcon />, to: "/login" }
  ];

  const mobileItems = menuItems.map((item) => ({
    label: item.label,
    icon: item.icon,
    active: item.active,
    onClick: () => {
      if (item.to) {
        if (item.label === "Log out") {
          clearAllAuthData();
            disconnectRealtimeSocket();
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
                    disconnectRealtimeSocket();
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
          <ProfileSummary
            display={display}
            avatarImageUrl={avatarPreviewUrl || display.avatarUrl}
            avatarFileName={selectedAvatarFile?.name ?? ""}
            savingAvatar={savingAvatar}
            onAvatarFileChange={setSelectedAvatarFile}
            onSaveAvatar={saveAvatar}
          />
          <div className="mt-[42px]">
            <Tabs activeTab={activeTab} onChange={setActiveTab} />
            {activeTab === "profile" ? (
              <EditProfilePanel
                display={display}
                isEditing={isEditingProfile}
                fullName={fullName}
                bio={bio}
                email={display.email}
                phone={phone}
                location={location}
                avatarImageUrl={avatarPreviewUrl || display.avatarUrl}
                selectedAvatarFileName={selectedAvatarFile?.name ?? ""}
                saving={savingProfile}
                onEdit={() => setIsEditingProfile(true)}
                onSubmit={saveProfile}
                onAvatarFileChange={setSelectedAvatarFile}
                onFullNameChange={setFullName}
                onBioChange={setBio}
                onPhoneChange={setPhone}
                onLocationChange={setLocation}
              />
            ) : null}
            {activeTab === "company" ? <CompanyDetailsForm display={display} /> : null}
            {activeTab === "chat" ? <ChatSettingsForm /> : null}
          </div>
        </section>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
