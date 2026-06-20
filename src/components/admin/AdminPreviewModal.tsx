import { useEffect, useRef, type ReactNode } from 'react';

type AdminPreviewModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AdminPreviewModal({ open, title, onClose, children, footer }: AdminPreviewModalProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[125] flex items-center justify-center bg-black/45 p-3 sm:p-4"
      onClick={(event) => {
        if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={cardRef}
        className="flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[16px] border border-[#e7e4ed] bg-white shadow-[0_24px_52px_rgba(31,29,39,0.22)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#ece9f1] px-4 py-3 sm:px-5 sm:py-4">
          <h3 className="text-[17px] font-semibold text-[#1f1f29] sm:text-[19px]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#d8d5de] text-[#6d6878] transition hover:bg-[#f7f5fa]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">{children}</div>

        {footer ? <div className="border-t border-[#ece9f1] px-4 py-3 sm:px-5">{footer}</div> : null}
      </div>
    </div>
  );
}
