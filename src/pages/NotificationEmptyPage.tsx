import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

function BellIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M15 17H9a2 2 0 0 1-2-2v-3a5 5 0 1 1 10 0v3a2 2 0 0 1-2 2Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function EmptyBoxIcon() {
  return (
    <svg viewBox="0 0 120 90" className="h-[80px] w-[110px]" fill="none" aria-hidden="true">
      <path d="M10 20h100L95 5H25L10 20Z" fill="#a6a8af" />
      <rect x="25" y="20" width="70" height="50" fill="#c8c9cf" />
      <path d="M15 20h90l-12-12H27L15 20Z" fill="#b6b8bf" />
      <circle cx="50" cy="42" r="2" fill="#747780" />
      <circle cx="70" cy="42" r="2" fill="#747780" />
      <path d="M46 55c2-4 5-6 9-6s7 2 9 6" stroke="#878a93" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="80" y="54" width="10" height="12" fill="#d8d8de" />
    </svg>
  );
}

export default function NotificationEmptyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-20 pt-8">
        <div className="mb-10 flex items-center gap-3">
          <BellIcon />
          <h1 className="text-[48px] font-medium">Notification</h1>
        </div>

        <div className="flex min-h-[680px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <EmptyBoxIcon />
            </div>
            <h2 className="text-[50px] font-medium leading-none">Nothing to see here</h2>
            <p className="mt-3 text-[39px] text-[#9a98a4]">You don&apos;t have any notification yet</p>
          </div>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}

