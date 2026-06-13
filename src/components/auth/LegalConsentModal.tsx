import { useEffect, useState } from "react";
import type { LegalSection } from "../layout/LegalPageLayout";
import { privacySections } from "../../pages/PrivacyPolicyPage";
import { termsSections } from "../../pages/TermsPage";

export type LegalDocumentType = "terms" | "privacy";

const LEGAL_DOCUMENTS: Record<LegalDocumentType, { title: string; intro: string; sections: LegalSection[] }> = {
  terms: {
    title: "Terms of Use",
    intro:
      "Please review the terms that govern your access to and use of Qwik.ng before continuing.",
    sections: termsSections,
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "Please review how Qwik.ng collects, uses, stores, and protects your personal information before continuing.",
    sections: privacySections,
  },
};

type LegalConsentModalProps = {
  documentType: LegalDocumentType | null;
  onClose: () => void;
  onAgree: () => void;
};

export default function LegalConsentModal({ documentType, onClose, onAgree }: LegalConsentModalProps) {
  const [checked, setChecked] = useState(false);
  const legalDocument = documentType ? LEGAL_DOCUMENTS[documentType] : null;

  useEffect(() => {
    setChecked(false);
  }, [documentType]);

  useEffect(() => {
    if (!documentType) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [documentType, onClose]);

  if (!legalDocument) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#15131d]/55 px-4 py-4 sm:px-6" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="flex max-h-[min(720px,calc(100dvh-32px))] w-full max-w-[720px] min-w-0 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#ececf0] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#ff8f00]">Qwik legal</p>
            <h2 id="legal-modal-title" className="mt-1 text-[22px] font-semibold leading-tight text-[#1f1d27] sm:text-[28px]">
              {legalDocument.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#e4e2e9] text-[22px] leading-none text-[#6f6c78] transition hover:border-[#ff8f00] hover:text-[#ff8f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357]"
            aria-label="Close legal modal"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-[14px] leading-[1.65] text-[#64636d] sm:text-[15px]">{legalDocument.intro}</p>
          <div className="mt-5 space-y-5">
            {legalDocument.sections.map((section) => (
              <section key={section.title} className="min-w-0">
                <h3 className="text-[17px] font-semibold leading-[1.3] text-[#1f1d27] sm:text-[19px]">{section.title}</h3>
                <div className="mt-2 space-y-2 text-[14px] leading-[1.65] text-[#5f5d6c] sm:text-[15px]">
                  {section.body.map((paragraph, index) => (
                    <p key={`${section.title}-${index}`} className="break-words">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className="shrink-0 border-t border-[#ececf0] px-5 py-4 sm:px-6">
          <label className="flex items-start gap-2.5 text-[13px] leading-[1.4] text-[#5f5d6c]">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              className="mt-[1px] h-[16px] w-[16px] shrink-0 rounded-[4px] border border-[#acabb6] bg-transparent accent-[#ff8f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            />
            <span>I have read and agree</span>
          </label>
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-[44px] rounded-[10px] border border-[#d8d7de] px-5 text-[14px] font-medium text-[#5f5d6c] transition hover:border-[#ff8f00] hover:text-[#ff8f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357]"
            >
              Close
            </button>
            <button
              type="button"
              disabled={!checked}
              onClick={() => {
                onAgree();
                onClose();
              }}
              className="h-[44px] rounded-[10px] bg-gradient-to-r from-amber to-orange px-5 text-[14px] font-semibold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Agree and continue
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}