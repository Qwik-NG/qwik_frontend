import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { ROUTES } from "../constants/routes";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { api } from "../services/api";
import type { VerificationApplication } from "../types";

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.6 12.1 1.7 1.8 3.7-4" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9h18" />
      <path d="M5 9l1.5-5h11L19 9" />
      <path d="M5 9v9h14V9" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M13 10h5M13 14h5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#8f8b98]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v10" />
      <path d="m8 9 4 4 4-4" />
      <rect x="4" y="14" width="16" height="7" rx="2" />
    </svg>
  );
}

function StepDot({ label, status }: { label: string; status: "completed" | "active" | "pending" }) {
  const isActive = status !== "pending";
  const labelText = label === "1" ? "Business info" : label === "2" ? "Documents" : label === "3" ? "Review" : "Payment";
  const statusText = status === "completed" ? "Completed" : status === "active" ? "In Progress" : "Pending";
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border ${isActive ? "border-[#ff8b2c] bg-[#ff8b2c] text-white" : "border-[#d7d5de] bg-white text-[#1f1d27]"}`}>
        {label}
      </span>
      <p className="text-[14px] font-medium text-[#1f1d27]">{labelText}</p>
      <p className={`text-[12px] ${isActive ? "text-[#ff8b2c]" : "text-[#8f8b98]"}`}>{statusText}</p>
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-center gap-4 border-b border-[#eceaf0] py-4 md:grid-cols-[240px_1fr_90px]">
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        <span className="text-[14px] font-medium text-[#1f1d27]">{label}</span>
      </div>
      <div className="text-[14px] text-[#1f1d27] md:pr-4">{value}</div>
      <div className="md:justify-self-end">
        <button
          className="h-[34px] rounded-[8px] border border-[#a5a7b2] px-5 text-[13px] font-medium text-[#1f1d27]"
          type="button"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function FileCard({ label, name, size }: { label: string; name: string; size: string }) {
  return (
    <div className="flex items-center justify-between rounded-[10px] border border-[#a5a7b2] px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-semibold text-[#ff7f1f]">{label}</span>
        <div>
          <p className="text-[13px] text-[#1f1d27]">{name}</p>
          <p className="text-[12px] text-[#9c98a5]">{size}</p>
        </div>
      </div>
      <DownloadIcon />
    </div>
  );
}

export default function GetVerifiedReviewPage() {
  const navigate = useNavigate();
  const [verification, setVerification] = useState<VerificationApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadVerification() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.verificationMe();
        if (!mounted) return;
        setVerification(response.data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load verification");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadVerification();
    return () => {
      mounted = false;
    };
  }, []);

  const businessInfo = verification?.businessInfo ?? {};
  const documents = verification?.documents ?? [];

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

            <div className="max-w-[720px]">
              <h1 className="text-[30px] font-semibold text-[#1f1d27]">Seller Verification</h1>
              <p className="mt-1 text-[14px] text-[#8f8b98]">
                Complete verification to earn a verified seller badge and unlock marketplace benefits
              </p>
            </div>

            <div className="relative mt-6">
              <div className="absolute left-0 right-0 top-[15px] hidden h-[2px] bg-[#d7d5de] md:block" />
              <div className="absolute left-0 top-[15px] hidden h-[2px] w-[72%] bg-[#ff8b2c] md:block" />
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <StepDot label="1" status="completed" />
                <StepDot label="2" status="completed" />
                <StepDot label="3" status="active" />
                <StepDot label="4" status="pending" />
              </div>
            </div>

            <div className="mt-6 w-full max-w-[1040px] rounded-card border border-[#e2e1e8] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div>
                <h2 className="text-[18px] font-semibold text-[#1f1d27]">Verification Summary</h2>
                <p className="mt-1 text-[14px] text-[#8f8b98]">Please review your details below before proceeding.</p>
              </div>
              {loading ? <p className="mt-3 text-[13px] text-[#8f8b98]">Loading verification summary...</p> : null}
              {error ? <p className="mt-3 rounded-[10px] bg-[#fff0f0] px-3 py-2 text-[13px] text-[#c24141]">{error}</p> : null}
              {!loading && !verification ? (
                <p className="mt-3 rounded-[10px] bg-[#fff6e8] px-3 py-2 text-[13px] text-[#8b5a00]">Start the verification flow before reviewing.</p>
              ) : null}

              <div className="mt-4">
                <SummaryRow icon={<BadgeIcon />} label="Business Name" value={businessInfo.businessName || "Not provided"} />
                <SummaryRow icon={<StoreIcon />} label="Store Name" value={businessInfo.storeName || "Not provided"} />
                <SummaryRow icon={<IdIcon />} label="NIN" value={businessInfo.nin || "Not provided"} />
                <SummaryRow
                  icon={<LocationIcon />}
                  label="Business Address"
                  value={businessInfo.address || "Not provided"}
                />
                {documents.length > 0 ? documents.map((document) => (
                  <SummaryRow
                    key={document.id ?? document.url}
                    icon={<FileIcon />}
                    label={document.purpose.replace(/_/g, " ")}
                    value={<FileCard label={(document.type ?? "FILE").split("/").pop()?.toUpperCase() ?? "FILE"} name={document.name ?? document.url} size={document.size ? `${Math.round(document.size / 1024)}KB` : "Uploaded"} />}
                  />
                )) : (
                  <SummaryRow icon={<FileIcon />} label="Uploaded Documents" value="No documents attached yet" />
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[4px] bg-[#ff8b2c] text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 4 4L19 7" />
                  </svg>
                </span>
                <span className="text-[13px] text-[#1f1d27]">I confirm all information provided is accurate.</span>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="flex h-[44px] items-center gap-3 rounded-[10px] border border-[#ff8b2c] px-4 text-[13px] font-medium text-[#ff8b2c]"
                  type="button"
                  onClick={() => navigate(ROUTES.GET_VERIFIED_DOCUMENT_UPLOAD)}
                >
                  <span className="text-[16px]">&lt;-</span>
                  <span>Back</span>
                </button>
                <button
                  className="flex h-[44px] items-center gap-3 rounded-[12px] bg-gradient-to-r from-amber to-orange px-6 text-[13px] font-medium text-white shadow-glow"
                  type="button"
                  onClick={() => navigate(ROUTES.GET_VERIFIED_PAYMENT)}
                  disabled={loading || !verification}
                >
                  <span>Proceed to Payment</span>
                  <span className="text-[16px]">-&gt;</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-[#1f1d27]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
                <path d="m9.6 12.1 1.7 1.8 3.7-4" />
              </svg>
              <span>Verification usually takes 24-48 hours</span>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
