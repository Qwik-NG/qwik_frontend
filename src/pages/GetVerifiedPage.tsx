import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { ROUTES } from "../constants/routes";
import { api } from "../services/api";
import type { VerificationApplication } from "../types";

function BenefitIconWrapper({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#e8e7ed] bg-white text-[#ff7f1f] shadow-sm">
      {children}
    </span>
  );
}

function ShieldBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.6 12.1 1.7 1.8 3.7-4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M4 19a5 5 0 0 1 10 0" />
      <circle cx="17" cy="10" r="2" />
      <path d="M14.5 19a4 4 0 0 1 5.5-3.6" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 0 1 16 0" />
      <rect x="3" y="11" width="4" height="7" rx="2" />
      <rect x="17" y="11" width="4" height="7" rx="2" />
      <path d="M7 18c0 2.2 1.8 4 4 4h2" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 8h7v7" />
    </svg>
  );
}

function SecureIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.6 12.1 1.7 1.8 3.7-4" />
    </svg>
  );
}

function RequirementIcon({ type }: { type: "doc" | "id" | "store" | "phone" | "location" }) {
  if (type === "doc") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4" />
      </svg>
    );
  }
  if (type === "id") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="12" r="2" />
        <path d="M13 10h5M13 14h5" />
      </svg>
    );
  }
  if (type === "store") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9h18" />
        <path d="M5 9l1.5-5h11L19 9" />
        <path d="M5 9v9h14V9" />
      </svg>
    );
  }
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.9v2.5a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 2.1 3.7 2 2 0 0 1 4.1 1.5h2.5a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1l-1 1a16 16 0 0 0 6 6l1-1a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function TrustBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.6 12.1 1.7 1.8 3.7-4" />
    </svg>
  );
}

function BenefitBlock({ title, icon, align }: { title: string; icon: ReactNode; align?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 text-center ${align ?? ""}`}>
      <BenefitIconWrapper>{icon}</BenefitIconWrapper>
      <p className="text-[15px] font-medium text-[#1f1d27]">{title}</p>
    </div>
  );
}

export default function GetVerifiedPage() {
  const navigate = useNavigate();
  const [verification, setVerification] = useState<VerificationApplication | null>(null);

  useEffect(() => {
    let mounted = true;
    api.verificationMe()
      .then((response) => {
        if (mounted) setVerification(response.data);
      })
      .catch(() => {
        if (mounted) setVerification(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const requirements = [
    {
      title: "CAC Certificate",
      description: "Upload your CAC registration certificate",
      type: "doc",
    },
    {
      title: "NIN Verification",
      description: "Verify with your National ID Number",
      type: "id",
    },
    {
      title: "Business Information",
      description: "Tell us about your store and what you sell",
      type: "store",
    },
    {
      title: "Valid Phone Number",
      description: "Add a valid phone number for verification",
      type: "phone",
    },
    {
      title: "Store Address",
      description: "Provide your business address in Nigeria",
      type: "location",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr_400px]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "get-verified")}
          />

          <section className="min-w-0">
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "get-verified")} label="Settings" />
            </div>

            <div className="max-w-[520px]">
              <h1 className="text-[36px] font-semibold leading-tight sm:text-[38px]">
                Build Trust
                <br />
                Grow Your Business
              </h1>
              <p className="mt-2 text-[16px] text-[#8f8b98] sm:text-[17px]">
                Complete verification to stand out, build trust with customers and unlock exclusive benefits.
              </p>
            </div>

            <div className="mt-8 max-w-2xl mx-auto">
              <div className="grid gap-8 grid-cols-3 items-center justify-items-center">
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#e8e7ed] bg-white text-[#ff7f1f] shadow-sm">
                    <ShieldBadgeIcon />
                  </span>
                  <p className="text-[15px] font-medium text-[#1f1d27]">Verified Seller Badge</p>
                </div>

                <div className="flex flex-col items-center gap-3 text-center row-span-2">
                  <div className="h-[200px] w-[200px] overflow-hidden">
                    <img
                      src="/verify-image.PNG"
                      alt="Verified badge"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#e8e7ed] bg-white text-[#ff7f1f] shadow-sm">
                    <UsersIcon />
                  </span>
                  <p className="text-[15px] font-medium text-[#1f1d27]">Increased Customer Trust</p>
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#e8e7ed] bg-white text-[#ff7f1f] shadow-sm">
                    <HeadsetIcon />
                  </span>
                  <p className="text-[15px] font-medium text-[#1f1d27]">Priority Support</p>
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#e8e7ed] bg-white text-[#ff7f1f] shadow-sm">
                    <TrendUpIcon />
                  </span>
                  <p className="text-[15px] font-medium text-[#1f1d27]">Higher Search Visibility</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-[14px] bg-[#f2f2f5] p-4 text-[14px] text-[#8f8b98]">
              <SecureIcon />
              <div>
                <p className="font-medium text-[#1f1d27]">Your Information is secured and encrypted.</p>
                <p>We do not store your card details.</p>
              </div>
            </div>
          </section>

          <aside className="rounded-[18px] border border-[#e3e1e9] bg-white p-5 sm:p-6">
            <h2 className="text-[22px] font-semibold text-[#1f1d27]">Become a Verified Seller</h2>
            <p className="mt-2 text-[14px] text-[#8f8b98]">
              Complete the verification process to unlock all platform benefits and grow your business.
            </p>
            {verification ? (
              <p className="mt-3 rounded-[10px] bg-[#fff6e8] px-3 py-2 text-[13px] font-medium text-[#8b5a00]">
                Current status: {verification.status.replace(/_/g, " ")}
              </p>
            ) : null}

            <div className="mt-5">
              <h3 className="text-[14px] font-medium text-[#1f1d27]">Verification Requirements</h3>
              <div className="mt-3 space-y-3">
                {requirements.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-[12px] border border-[#ededf2] px-3 py-2.5">
                    <span className="mt-0.5 text-[#ff7f1f]">
                      <RequirementIcon type={item.type} />
                    </span>
                    <div>
                      <p className="text-[14px] font-medium text-[#1f1d27]">{item.title}</p>
                      <p className="text-[12px] text-[#9c98a5]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="mt-5 flex h-[52px] w-full items-center justify-between rounded-[12px] bg-gradient-to-r from-amber to-orange px-4 text-[15px] font-medium text-white shadow-glow"
              type="button"
              onClick={() => navigate(verification?.status === "SUBMITTED" || verification?.status === "IN_REVIEW" || verification?.status === "APPROVED" ? ROUTES.GET_VERIFIED_SUCCESSFUL : ROUTES.GET_VERIFIED_BUSINESS_INFO)}
            >
              <span>{verification ? "Continue Verification" : "Start Verification"}</span>
              <span className="text-[20px]">→</span>
            </button>

            <div className="mt-4 flex items-center gap-2 text-[13px] text-[#8f8b98]">
              <span className="text-[#22c55e]">
                <TrustBadgeIcon />
              </span>
              <span>Verification usually takes 24-48 hours</span>
            </div>
          </aside>
        </div>

        <div className="mt-8 rounded-card bg-[#f2f2f5] px-4 py-5 sm:px-6">
          <div className="grid gap-4 grid-cols-3">
            <div></div>
            <div className="flex items-center gap-3 justify-center">
              <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#ffe7d4] text-[#ff7f1f] flex-shrink-0">
                <TrustBadgeIcon />
              </span>
              <div>
                <p className="text-[14px] font-medium text-[#1f1d27]">Trusted by Thousands</p>
                <p className="text-[12px] text-[#8f8b98]">Join 1000+ verified sellers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#ffe7d4] text-[#ff7f1f] flex-shrink-0">
                <TrustBadgeIcon />
              </span>
              <div>
                <p className="text-[14px] font-medium text-[#1f1d27]">Bank Level Security</p>
                <p className="text-[12px] text-[#8f8b98]">All data well encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
