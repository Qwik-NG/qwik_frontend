import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { ROUTES } from "../constants/routes";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { api } from "../services/api";
import type { VerificationApplication } from "../types";

function ShieldIllustration() {
  return (
    <div className="relative mx-auto flex h-[220px] w-[220px] items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-[#f2f5f4]" />
      <svg viewBox="0 0 220 220" className="relative h-[200px] w-[200px]" aria-hidden="true">
        <defs>
          <linearGradient id="successShieldFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1fb36a" />
            <stop offset="100%" stopColor="#0f7a47" />
          </linearGradient>
          <linearGradient id="successShieldBorder" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8c9c2" />
            <stop offset="100%" stopColor="#7f9a90" />
          </linearGradient>
        </defs>
        <path
          d="M110 24l60 22v48c0 46-29 78-60 92-31-14-60-46-60-92V46l60-22Z"
          fill="url(#successShieldFill)"
          stroke="url(#successShieldBorder)"
          strokeWidth="6"
        />
        <path
          d="M82 108l18 18 40-44"
          fill="none"
          stroke="#f4fbf7"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="110" cy="190" rx="70" ry="14" fill="#dfe7e3" />
      </svg>
    </div>
  );
}

function ClockIcon() {
  return (
    <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#fff1db] text-[#ff7f1f]">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    </div>
  );
}

function BadgeClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#fff1db] text-[#ff7f1f]">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="m7.5 9.5 4.5 3.3 4.5-3.3" />
      </svg>
    </div>
  );
}

function BadgeIcon() {
  return (
    <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#fff1db] text-[#ff7f1f]">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
        <path d="m9.6 12.1 1.7 1.8 3.7-4" />
      </svg>
    </div>
  );
}

function StatusBadge({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[10px] bg-[#ffe9bf] px-3 py-2 text-[13px] font-medium text-[#8b5a00]">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default function GetVerifiedSuccessfulPage() {
  const navigate = useNavigate();
  const [verification, setVerification] = useState<VerificationApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.verificationMe()
      .then((response) => {
        if (mounted) setVerification(response.data);
      })
      .catch(() => {
        if (mounted) setVerification(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const statusLabel = verification?.status === "APPROVED"
    ? "Approved"
    : verification?.status === "REJECTED"
      ? "Rejected"
      : verification?.status === "IN_REVIEW"
        ? "In Review"
        : "Under Review";

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "get-verified")}
          />

          <section className="min-w-0">
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "get-verified")} label="Settings" />
            </div>

            <div className="mx-auto max-w-[980px] text-center">
              <ShieldIllustration />
              <h1 className="mt-2 text-[28px] font-semibold text-[#1f1d27] sm:text-[30px]">Verification Request Submitted</h1>
              <p className="mt-2 text-[14px] text-[#8f8b98]">
                Your verification request has been submitted. Approval is only granted after admin review.
              </p>
            </div>

            <div className="mx-auto mt-6 w-full max-w-[980px] rounded-card border border-[#e2e1e8] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[16px] font-semibold text-[#1f1d27]">Verification Status</h2>
                <StatusBadge icon={<BadgeClockIcon />} label={loading ? "Loading..." : statusLabel} />
              </div>

              {verification?.status === "REJECTED" && verification.rejectionReason ? (
                <p className="mt-4 rounded-[10px] bg-[#fff0f0] px-3 py-2 text-[13px] text-[#c24141]">{verification.rejectionReason}</p>
              ) : null}

              <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <ClockIcon />
                  <div>
                    <p className="text-[14px] text-[#1f1d27]">Estimated review time</p>
                    <p className="text-[15px] font-semibold text-[#1f1d27]">24 - 48 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MailIcon />
                  <div>
                    <p className="text-[14px] text-[#1f1d27]">You will be notified via email</p>
                    <p className="text-[14px] text-[#8f8b98]">and dashboard updates</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-6 w-full max-w-[980px] rounded-[16px] bg-[#fff4e6] p-5">
              <div className="flex items-center gap-4">
                <BadgeIcon />
                <div>
                  <p className="text-[14px] font-semibold text-[#1f1d27]">Thank you for choosing Qwik.NG</p>
                  <p className="text-[13px] text-[#8f8b98]">We're reviewing your information and will get back to you shortly</p>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-6 w-full max-w-[980px]">
              <button
                className="flex h-[48px] w-full items-center justify-center gap-4 rounded-[12px] bg-gradient-to-r from-amber to-orange text-[15px] font-semibold text-white shadow-glow"
                type="button"
                onClick={() => navigate(ROUTES.ADS_DASHBOARD)}
              >
                <span>Return to Dashboard</span>
                <span className="text-[18px]">-&gt;</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
