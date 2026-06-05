import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { ROUTES } from "../constants/routes";
import { getSettingsNavItems } from "../lib/settings-nav-config";

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16.5a4 4 0 0 0 3.8 3.5h8.6a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.8 1" />
      <path d="M12 13V7" />
      <path d="m9 10 3-3 3 3" />
    </svg>
  );
}

function StepDot({ label, status }: { label: string; status: "completed" | "active" | "pending" }) {
  const isActive = status !== "pending";
  const labelText = label === "1" ? "Business info" : label === "2" ? "Documents" : label === "3" ? "Review" : "Payment";
  const statusText = status === "completed" ? "Completed" : status === "active" ? "In Progress" : "Pending";
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span
        className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border ${isActive ? "border-[#ff8b2c] bg-[#ff8b2c] text-white" : "border-[#d7d5de] bg-white text-[#1f1d27]"}`}
      >
        {label}
      </span>
      <p className="text-[14px] font-medium text-[#1f1d27]">{labelText}</p>
      <p className={`text-[12px] ${isActive ? "text-[#ff8b2c]" : "text-[#8f8b98]"}`}>{statusText}</p>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

function UploadCard({ title, description }: { title: string; description: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);

  return (
    <div className="rounded-[14px] border border-dashed border-[#c9c7d2] bg-[#f8f8fa] px-5 py-6 text-center">
      <div className="mx-auto mb-3 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white">
        <UploadIcon />
      </div>
      <h4 className="text-[14px] font-semibold text-[#1f1d27]">{title}</h4>
      <p className="mt-2 text-[13px] text-[#8f8b98]">{description}</p>
      <p className="mt-1 text-[12px] text-[#9c98a5]">PDF, JPG or PNG ( Max. 10MB )</p>
      <button
        className="mt-4 h-[36px] rounded-[8px] border border-[#ff8b2c] px-4 text-[13px] font-medium text-[#ff8b2c]"
        type="button"
        aria-label={`Choose file for ${title}`}
        onClick={() => inputRef.current?.click()}
      >
        Choose File
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            setSelectedFile(null);
            return;
          }

          setSelectedFile({
            name: file.name,
            size: formatFileSize(file.size),
          });
        }}
      />
      {selectedFile ? (
        <p className="mt-3 text-[12px] text-[#1f1d27]">
          {selectedFile.name} ({selectedFile.size})
        </p>
      ) : null}
    </div>
  );
}

export default function GetVerifiedDocumentUploadPage() {
  const navigate = useNavigate();

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
              <div className="absolute left-0 top-[15px] hidden h-[2px] w-[45%] bg-[#ff8b2c] md:block" />
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <StepDot label="1" status="completed" />
                <StepDot label="2" status="active" />
                <StepDot label="3" status="pending" />
                <StepDot label="4" status="pending" />
              </div>
            </div>

            <div className="mt-6 w-full max-w-[1040px] rounded-card border border-[#e2e1e8] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex flex-wrap items-center gap-3">
                <DocumentIcon />
                <h2 className="text-[16px] font-semibold text-[#1f1d27]">Document Upload</h2>
                <p className="text-[13px] text-[#8f8b98]">Upload clear valid documents, all files are secure and encrypted</p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <UploadCard
                  title="CAC Certificate Upload"
                  description="Drag & drop your CAC certificate"
                />
                <UploadCard
                  title="Proof of Address Upload"
                  description="Drag & drop your proof of address"
                />
                <UploadCard
                  title="Storefront Photo Upload"
                  description="Drag & drop your storefront photo"
                />
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="flex h-[44px] items-center gap-3 rounded-[10px] border border-[#ff8b2c] px-4 text-[13px] font-medium text-[#ff8b2c]"
                  type="button"
                  onClick={() => navigate(ROUTES.GET_VERIFIED_BUSINESS_INFO)}
                >
                  <span className="text-[16px]">&lt;-</span>
                  <span>Back</span>
                </button>
                <button
                  className="flex h-[44px] items-center gap-3 rounded-[12px] bg-gradient-to-r from-amber to-orange px-6 text-[13px] font-medium text-white shadow-glow"
                  type="button"
                  onClick={() => navigate(ROUTES.GET_VERIFIED_REVIEW)}
                >
                  <span>Continue to Review</span>
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
