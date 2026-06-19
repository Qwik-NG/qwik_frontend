import { useEffect, useId, useRef, useState } from "react";

export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
  helperText?: string;
};

type DropdownSelectProps = {
  label?: string;
  placeholder: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  helperText?: string;
};

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 shrink-0 text-[#9a96a3] transition ${open ? "rotate-180 text-[#ff7f1f]" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function DropdownSelect({ label, placeholder, value, options, onChange, disabled = false, helperText }: DropdownSelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // Scroll the currently selected option into view when the menu opens.
    const node = selectedItemRef.current;
    const list = listRef.current;
    if (node && list) {
      const nodeTop = node.offsetTop;
      const nodeBottom = nodeTop + node.offsetHeight;
      if (nodeTop < list.scrollTop || nodeBottom > list.scrollTop + list.clientHeight) {
        list.scrollTo({ top: Math.max(0, nodeTop - 8), behavior: "auto" });
      }
    }
  }, [open]);

  const chooseOption = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  const hasLabel = Boolean(label && label.trim().length > 0);
  const labelId = `${id}-label`;

  return (
    <div ref={rootRef} className={`relative block ${open ? "z-[150]" : ""}`}>
      {hasLabel ? (
        <label id={labelId} className="mb-2 block text-[15px] font-medium text-[#27242d]">
          {label}
        </label>
      ) : null}
      <button
        type="button"
        aria-labelledby={hasLabel ? labelId : undefined}
        aria-label={hasLabel ? undefined : placeholder}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if ((event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={`flex min-h-[54px] w-full items-center justify-between gap-3 rounded-[12px] border bg-white px-4 text-left text-[16px] shadow-[0_1px_0_rgba(17,16,24,0.02)] outline-none transition focus-visible:border-orange focus-visible:ring-2 focus-visible:ring-orange/20 ${
          open ? "border-orange ring-2 ring-orange/15" : "border-[#dddbe4] hover:border-[#f3a040]"
        } ${disabled ? "cursor-not-allowed bg-[#f5f4f7] text-[#9c98a5]" : "text-[#201d27]"}`}
      >
        <span className={selectedOption ? "truncate text-[#201d27]" : "truncate text-[#a4a0aa]"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDownIcon open={open} />
      </button>
      {helperText ? <p className="mt-1.5 text-[13px] leading-snug text-[#8f8a98]">{helperText}</p> : null}

      {open ? (
        <div
          id={`${id}-listbox`}
          ref={listRef}
          role="listbox"
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-label={hasLabel ? undefined : placeholder}
          onPointerDown={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            overscrollBehaviorY: "contain",
          }}
          className="absolute left-0 right-0 z-[120] mt-2 max-h-[min(44dvh,260px)] overflow-x-hidden overflow-y-scroll rounded-[14px] border border-[#eee3d6] bg-white p-1.5 shadow-[0_18px_44px_rgba(34,25,16,0.16)] sm:max-h-[280px] sm:overflow-y-auto"
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                ref={selected ? selectedItemRef : undefined}
                type="button"
                role="option"
                aria-selected={selected}
                aria-disabled={option.disabled}
                disabled={option.disabled}
                onClick={() => chooseOption(option.value)}
                className={`flex min-h-[42px] w-full touch-pan-y items-center justify-between gap-3 rounded-[10px] px-3 text-left text-[15px] transition ${
                  option.disabled
                    ? "cursor-not-allowed text-[#b2aeba] opacity-70"
                    : selected
                      ? "bg-[#fff4e8] font-semibold text-[#ff6c1c]"
                      : "text-[#282530] hover:bg-[#fff8ef]"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate">{option.label}</span>
                  {option.helperText ? <span className="block text-[12px] font-normal text-[#9c98a5]">{option.helperText}</span> : null}
                </span>
                {selected ? <span className="text-[#ff6c1c]">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}