import type { ToastMessage } from "../../context/ToastContext";

const toastStyles: Record<ToastMessage["variant"], { accent: string; badge: string; icon: string; label: string }> = {
  success: {
    accent: "border-[#bde7ca] text-[#185b2b]",
    badge: "bg-[#e7f8ed]",
    icon: "text-[#2f8f49]",
    label: "Success",
  },
  error: {
    accent: "border-[#f4c1c1] text-[#842626]",
    badge: "bg-[#fff0f0]",
    icon: "text-[#d84e4e]",
    label: "Error",
  },
  info: {
    accent: "border-[#dcd8f4] text-[#2c3454]",
    badge: "bg-[#eef2ff]",
    icon: "text-[#3f5db2]",
    label: "Info",
  },
};

export function Toast({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4 sm:left-auto sm:right-4 sm:top-4 sm:block sm:w-[360px] sm:px-0">
      <div className="flex w-full max-w-[360px] flex-col gap-3">
        {toasts.map((toast) => {
          const styles = toastStyles[toast.variant];

          return (
            <div
              key={toast.id}
              aria-live={toast.variant === "error" ? "assertive" : "polite"}
              className={`pointer-events-auto flex items-start gap-3 rounded-[18px] border bg-white/95 p-4 shadow-[0_18px_45px_rgba(31,31,41,0.14)] backdrop-blur-sm transition-all duration-200 ${styles.accent}`}
              role={toast.variant === "error" ? "alert" : "status"}
            >
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.badge}`}>
                <span aria-hidden="true" className={`text-[16px] font-semibold ${styles.icon}`}>
                  {toast.variant === "success" ? "✓" : toast.variant === "error" ? "!" : "i"}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-none">{styles.label}</p>
                <p className="mt-1 text-[14px] leading-[1.45] text-[#4b4a54]">{toast.message}</p>
              </div>

              <button
                aria-label="Close notification"
                className="pointer-events-auto mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#7f7e88] transition-colors duration-200 hover:bg-[#f3f3f5] hover:text-[#1f1f29] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={() => onDismiss(toast.id)}
                type="button"
              >
                <span aria-hidden="true" className="text-[18px] leading-none">
                  ×
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}