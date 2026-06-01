import type { ReactNode } from "react";
import { useState } from "react";

export type SettingsSidebarItem = {
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick: () => void;
};

export function MobileSettingsMenu({
  items,
  label = "Menu",
  title = "Settings",
}: {
  items: SettingsSidebarItem[];
  label?: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-[10px] border border-[#dedde4] bg-white px-3 py-2 text-[14px] text-[#1f1d27]"
      >
        <span className="text-[18px]">☰</span>
        <span>{label}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[200]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-auto rounded-t-[24px] bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[18px] font-medium text-[#1f1d27]">{title}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#e3e1e9] px-2 py-1 text-[13px] text-[#1f1d27]"
              >
                Close
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left text-[15px] ${
                    item.active ? "bg-[#efefef] text-[#1f1d27]" : "text-[#94919d]"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SettingsSidebar({
  items,
  className = "",
}: {
  items: SettingsSidebarItem[];
  className?: string;
}) {
  return (
    <aside className={`rounded-[20px] bg-white p-4 ${className}`}>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            type="button"
            className={`flex h-[58px] w-full items-center gap-3 rounded-[12px] px-4 text-left text-[16px] ${
              item.active ? "bg-[#efefef] text-[#1f1d27]" : "text-[#94919d]"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}