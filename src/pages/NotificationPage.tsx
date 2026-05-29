import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

function BellIcon({ small = false }: { small?: boolean }) {
  return (
    <svg width={small ? 22 : 20} height={small ? 22 : 20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 15V11C18 7.69 15.31 5 12 5C8.69 5 6 7.69 6 11V15L4 17H20L18 15Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconBox({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <button
      className={`grid h-11 w-11 place-items-center rounded-lg text-[18px] ${
        active ? "bg-[#0a0820] text-white" : "bg-[#ececec] text-[#2b2a34]"
      }`}
      type="button"
    >
      {children}
    </button>
  );
}

export default function NotificationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto min-h-[620px] w-full max-w-[1728px] px-12 pb-24 pt-6">
        <div className="mb-10 flex items-center gap-2">
          <span className="text-[#1f1d27]">
            <BellIcon small />
          </span>
          <h1 className="text-[28px] font-medium">Notification</h1>
        </div>

        <article className="flex items-start justify-between gap-4 rounded-[14px] p-2">
          <div className="flex items-start gap-4">
            <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#1877eb] text-[38px] leading-none text-white">✓</div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-[28px] font-semibold leading-none">Welcome</h2>
                <span className="text-[20px] text-[#57535f]">1 hour ago</span>
              </div>
              <p className="max-w-[900px] text-[22px] leading-[1.35]">
                We&apos;re glad to have you join us, Stay up to date with by following us on instagram, twitter & youtube.
              </p>
            </div>
          </div>

          <button className="px-2 text-[30px] text-[#22202a]" type="button">
            ⋮
          </button>
        </article>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}



