import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import { ROUTES } from "../constants/routes";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { api } from "../services/api";

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
    <div className="relative z-10 flex flex-col items-center gap-2 text-center">
      <span
        className={`relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full border ${isActive ? "border-[#ff8b2c] bg-[#ff8b2c] text-white" : "border-[#d7d5de] bg-white text-[#1f1d27]"}`}
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

function UploadCard({
  title,
  description,
  file,
  error,
  onFileChange,
}: {
  title: string;
  description: string;
  file: File | null;
  error?: string;
  onFileChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

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
          onFileChange(file ?? null);
        }}
      />
      {file ? (
        <p className="mt-3 text-[12px] text-[#1f1d27]">
          {file.name} ({formatFileSize(file.size)})
        </p>
      ) : null}
      {error ? <p className="mt-2 text-[12px] text-[#d14343]">{error}</p> : null}
    </div>
  );
}

export default function GetVerifiedDocumentUploadPage() {
  const navigate = useNavigate();
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({
    cac_certificate: null,
    proof_of_address: null,
    storefront_photo: null,
  });
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadingRef = useRef(false);

  const requiredDocuments: Array<{ key: keyof typeof files; label: string; title: string; description: string }> = [
    { key: "cac_certificate", label: "CAC Certificate", title: "CAC Certificate Upload", description: "Drag & drop your CAC certificate" },
    { key: "proof_of_address", label: "Proof of Address", title: "Proof of Address Upload", description: "Drag & drop your proof of address" },
    { key: "storefront_photo", label: "Storefront Photo", title: "Storefront Photo Upload", description: "Drag & drop your storefront photo" },
  ];

  useEffect(() => {
    let mounted = true;
    async function loadVerification() {
      try {
        setLoading(true);
        setError(null);
        const current = await api.verificationMe();
        const verification = current.data ?? (await api.createVerification()).data;
        if (mounted) setVerificationId(verification.id);
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

  const setFile = (purpose: string, file: File | null) => {
    setFiles((current) => ({ ...current, [purpose]: file }));
    setFileErrors((current) => {
      if (!current[purpose]) return current;
      const next = { ...current };
      delete next[purpose];
      return next;
    });
  };

  const handleContinue = async () => {
    if (uploadingRef.current) return;

    const nextErrors = requiredDocuments.reduce<Record<string, string>>((accumulator, document) => {
      if (!files[document.key]) {
        accumulator[document.key] = `${document.label} is required.`;
      }
      return accumulator;
    }, {});

    setFileErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError("Please upload CAC Certificate, Proof of Address, and Storefront Photo before continuing.");
      return;
    }

    try {
      uploadingRef.current = true;
      setUploading(true);
      setError(null);
      const id = verificationId ?? (await api.createVerification()).data.id;
      setVerificationId(id);
      const selected = Object.entries(files).filter((entry): entry is [string, File] => Boolean(entry[1]));
      const uploadedDocuments = [];
      for (const [purpose, file] of selected) {
        const upload = await api.uploadDocuments([file], purpose);
        uploadedDocuments.push(...upload.data.documents);
      }
      await api.addVerificationDocuments(id, uploadedDocuments);
      navigate(ROUTES.GET_VERIFIED_REVIEW);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload documents");
    } finally {
      uploadingRef.current = false;
      setUploading(false);
    }
  };

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
              <div className="absolute left-0 right-0 top-[15px] z-0 hidden h-[2px] bg-[#d7d5de] md:block" />
              <div className="absolute left-0 top-[15px] z-0 hidden h-[2px] w-[45%] bg-[#ff8b2c] md:block" />
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
              {loading ? <p className="mt-3 text-[13px] text-[#8f8b98]">Loading verification draft...</p> : null}
              {error ? <p className="mt-3 rounded-[10px] bg-[#fff0f0] px-3 py-2 text-[13px] text-[#c24141]">{error}</p> : null}

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {requiredDocuments.map((document) => (
                  <UploadCard
                    key={document.key}
                    title={document.title}
                    description={document.description}
                    file={files[document.key]}
                    error={fileErrors[document.key]}
                    onFileChange={(file) => setFile(document.key, file)}
                  />
                ))}
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
                  className="flex h-[44px] items-center gap-3 rounded-[12px] bg-gradient-to-r from-amber to-orange px-6 text-[13px] font-medium text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
                  type="button"
                  onClick={handleContinue}
                  disabled={loading || uploading}
                >
                  <span>{uploading ? "Processing..." : "Continue to Review"}</span>
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
