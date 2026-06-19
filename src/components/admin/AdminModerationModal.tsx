import { useEffect } from "react";

type AdminModerationModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
  tone?: "danger" | "neutral" | "success";
  reason?: string;
  reasonRequired?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  onReasonChange?: (value: string) => void;
  maxReasonLength?: number;
};

const toneClasses: Record<NonNullable<AdminModerationModalProps["tone"]>, string> = {
  danger: "bg-[#c73b3b] hover:bg-[#af3030]",
  neutral: "bg-[#4b5563] hover:bg-[#374151]",
  success: "bg-[#1f8f5f] hover:bg-[#18744e]",
};

export default function AdminModerationModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  loading = false,
  tone = "danger",
  reason,
  reasonRequired = false,
  reasonLabel = "Reason",
  reasonPlaceholder = "Enter reason",
  onReasonChange,
  maxReasonLength = 500,
}: AdminModerationModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, loading, onClose]);

  if (!open) return null;

  const trimmedReason = reason?.trim() ?? "";
  const reasonInvalid = reasonRequired && trimmedReason.length === 0;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-[520px] rounded-[14px] border border-[#e6e4eb] bg-white p-5 shadow-[0_20px_45px_rgba(0,0,0,0.18)] sm:p-6">
        <h3 className="text-[20px] font-semibold text-[#1f1f29]">{title}</h3>
        <p className="mt-2 text-[14px] leading-[1.5] text-[#6b6875]">{description}</p>

        {typeof reason === "string" && onReasonChange ? (
          <div className="mt-4">
            <label className="mb-1 block text-[13px] font-medium text-[#3a3743]" htmlFor="admin-moderation-reason">
              {reasonLabel}
            </label>
            <textarea
              id="admin-moderation-reason"
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              rows={4}
              maxLength={maxReasonLength}
              placeholder={reasonPlaceholder}
              className={`w-full resize-y rounded-[10px] border px-3 py-2 text-[14px] text-[#1f1f29] outline-none transition ${
                reasonInvalid
                  ? "border-[#dc6b6b] focus:border-[#dc6b6b] focus:ring-2 focus:ring-[#dc6b6b]/20"
                  : "border-[#d8d5de] focus:border-[#ffb46a] focus:ring-2 focus:ring-[#ffb46a]/25"
              }`}
            />
            <div className="mt-1 flex items-center justify-between text-[12px]">
              <span className={reasonInvalid ? "text-[#c73b3b]" : "text-[#8f8b98]"}>
                {reasonInvalid ? "Reason is required" : "Provide clear moderation context"}
              </span>
              <span className="text-[#9b97a5]">{trimmedReason.length}/{maxReasonLength}</span>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-[38px] rounded-[9px] border border-[#d8d5de] px-4 text-[13px] font-medium text-[#4f4b59] transition hover:bg-[#f4f3f6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || reasonInvalid}
            className={`h-[38px] rounded-[9px] px-4 text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${toneClasses[tone]}`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
