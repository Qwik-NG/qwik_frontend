import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../AppShell";
import { ROUTES } from "../../constants/routes";

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto flex w-full max-w-[1728px] items-center justify-center px-4 py-12 sm:px-6 lg:min-h-[calc(100vh-360px)] lg:px-12 lg:py-20">
        <section className="w-full max-w-[760px] rounded-[28px] border border-[#e7e4ec] bg-white px-6 py-10 text-center shadow-[0_18px_45px_rgba(17,12,46,0.05)] sm:px-10 sm:py-14">
          <div className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#fff1db] text-[#ff7f1f]">
            <span className="text-[24px] font-semibold">Q</span>
          </div>
          <h1 className="mt-6 text-[30px] font-semibold text-[#1f1d27] sm:text-[40px]">{title}</h1>
          <p className="mt-4 text-[16px] font-medium text-[#1f1d27]">Coming soon.</p>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-[1.65] text-[#7d7986]">{description}</p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.HOME)}
            className="mx-auto mt-8 flex h-[50px] items-center gap-3 rounded-[14px] bg-gradient-to-r from-amber to-orange px-6 text-[15px] font-medium text-white shadow-glow"
          >
            <span>Back to Home</span>
            <ArrowRightIcon />
          </button>
        </section>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
