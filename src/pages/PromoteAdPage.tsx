import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

function DayPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`rounded-[10px] px-3 py-1 text-[15px] ${
        active ? "bg-[#ff9a12] text-white" : "bg-badge-bg text-[#ff9715]"
      }`}
    >
      {label}
    </span>
  );
}

export default function PromoteAdPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-24 pt-8">
        <div className="mx-auto w-full max-w-[430px]">
          <div className="mb-4 flex h-[44px] items-center rounded-card bg-white px-6">
            <button
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
              className="mr-6 text-[16px] text-[#9d99a6] sm:text-[18px]"
            >
              ‹ Back
            </button>
            <h1 className="text-[22px] font-medium sm:text-[26px]">Promote Ad</h1>
          </div>

          <section className="rounded-[24px] bg-white p-5">
            <p className="mb-5 text-[16px] leading-[1.45] text-[#918d99]">
              Choose one of the following options to boost your ad. Boosted ads get displayed first above others.
            </p>

            <button type="button" className="mb-5 flex h-[50px] w-full items-center justify-between rounded-[10px] border-2 border-orange px-3.5 text-[15px] text-[#8f8c98] sm:text-[16px]">
              <span>Standard ad</span>
              <span className="text-[#d7d7de]">Free</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/plan-payment")}
              className="mb-5 w-full rounded-[10px] border border-[#d8d8de] p-3 text-left"
            >
              <p className="mb-3 text-[14px] text-[#8f8c98] sm:text-[15px]">TOP</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <DayPill label="7 Days" active />
                  <DayPill label="30 Days" />
                </div>
                <span className="text-[18px] text-[#9b97a4] sm:text-[20px]">₦1,500</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate("/premium-plan-payment")}
              className="mb-6 w-full rounded-[10px] border border-[#d8d8de] p-3 text-left"
            >
              <p className="mb-3 text-[14px] text-[#8f8c98] sm:text-[15px]">Premium</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <DayPill label="7 Days" />
                  <DayPill label="30 Days" active />
                </div>
                <span className="text-[18px] text-[#9b97a4] sm:text-[20px]">₦4,000</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate("/post")}
              className="h-[50px] w-full rounded-[11px] bg-gradient-to-r from-amber to-orange text-[16px] text-white shadow-glow sm:text-[18px]"
            >
              Post Ad
            </button>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
