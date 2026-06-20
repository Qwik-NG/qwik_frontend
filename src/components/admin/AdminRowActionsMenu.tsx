import { useEffect, useRef, useState, type ReactNode } from "react";

export type AdminRowActionItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
};

type AdminRowActionsMenuProps = {
  ariaLabel: string;
  items: AdminRowActionItem[];
};

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

export default function AdminRowActionsMenu({ ariaLabel, items }: AdminRowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative inline-flex">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#d9d6df] bg-white text-[#4f4b59] transition hover:border-[#c9c4d0] hover:bg-[#f7f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <DotsIcon />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[220px] overflow-hidden rounded-[14px] border border-[#e3e0e7] bg-white p-1 shadow-[0_16px_36px_rgba(31,29,39,0.16)]">
          {items.map((item) => {
            const baseClasses = item.danger
              ? "text-[#c73b3b] hover:bg-[#fff2f2]"
              : "text-[#1f1d27] hover:bg-[#f5f4f7]";

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.disabled) return;
                  setOpen(false);
                  item.onClick();
                }}
                disabled={item.disabled}
                className={`flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left text-[13px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${baseClasses}`}
              >
                {item.icon ? <span className="grid h-4 w-4 place-items-center">{item.icon}</span> : null}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}