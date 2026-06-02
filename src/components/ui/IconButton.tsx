import type { ReactNode } from "react";

export function IconButton({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <button className={`grid h-[50px] w-[50px] place-items-center rounded-lg ${active ? "bg-deep text-white" : "bg-card text-ink"}`} type="button">
      {children}
    </button>
  );
}
