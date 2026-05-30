import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

function IconBox({ children }: { children: ReactNode }) {
  return <button className="h-11 w-11 rounded-lg bg-[#ececec] text-[18px] text-[#2b2a34]">{children}</button>;
}

function DayPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`rounded-[10px] px-3 py-1 text-[15px] ${
        active ? "bg-[#ff9a12] text-white" : "bg-[#f5ebdc] text-[#ff9715]"
      }`}
      type="button"
    >
      {label}
    </button>
  );
}

export default function PromoteAdPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-24 pt-8">
        <div className="mx-auto w-full max-w-[430px]">
          <div className="mb-4 flex h-[44px] items-center rounded-[20px] bg-white px-6">
            <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))} className="mr-6 text-[30px] text-[#9d99a6]">
              ‹ Back
            </button>
            <h1 className="text-[39px] font-medium">Promote Ad</h1>
          </div>

          <section className="rounded-[24px] bg-white p-5">
            <p className="mb-5 text-[16px] leading-[1.45] text-[#918d99]">
              Choose one of the following options to boost your ad. Boosted ads get displayed first above others.
            </p>

            <button className="mb-5 flex h-[50px] w-full items-center justify-between rounded-[10px] border-2 border-orange px-3.5 text-[17px] text-[#8f8c98]">
              <span>Standard ad</span>
              <span className="text-[#d7d7de]">Free</span>
            </button>

            <div className="mb-5 rounded-[10px] border border-[#d8d8de] p-3">
              <p className="mb-3 text-[16px] text-[#8f8c98]">TOP</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <DayPill label="7 Days" active />
                  <DayPill label="30 Days" />
                </div>
                <span className="text-[20px] text-[#9b97a4]">₦1,500</span>
              </div>
            </div>

            <div className="mb-6 rounded-[10px] border border-[#d8d8de] p-3">
              <p className="mb-3 text-[16px] text-[#8f8c98]">Premium</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <DayPill label="7 Days" />
                  <DayPill label="30 Days" active />
                </div>
                <span className="text-[20px] text-[#9b97a4]">₦4,000</span>
              </div>
            </div>

            <button className="h-[50px] w-full rounded-[11px] bg-gradient-to-r from-amber to-orange text-[18px] text-white shadow-glow">
              Post Ad
            </button>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}




