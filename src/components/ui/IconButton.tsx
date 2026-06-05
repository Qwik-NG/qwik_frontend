import type { ReactNode } from "react";

export function IconButton({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <button
      className={`grid h-[50px] w-[50px] place-items-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] ${active ? "bg-deep text-white" : "bg-card text-ink hover:bg-[#ececee]"}`}
      type="button"
    >
      {children}
    </button>
  );
}
