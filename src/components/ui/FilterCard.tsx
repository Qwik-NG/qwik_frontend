import type { ReactNode } from "react";

export function FilterCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[16px] bg-[#efefef] p-4">
      <p className="mb-3 text-[14px] font-medium">{title}</p>
      {children}
    </div>
  );
}
