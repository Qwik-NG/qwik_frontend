import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

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
      <header className="mx-auto flex w-full max-w-[1728px] items-center gap-6 px-12 pt-8">
        <button className="h-[86px] w-[96px] shrink-0 overflow-hidden rounded-3xl bg-[#ececec]" onClick={() => navigate("/")}>
          <img src="/images/logo-header.png" alt="Qwik logo" className="h-full w-full object-cover" />
        </button>

        <div className="flex flex-1 items-center gap-2.5">
          <div className="flex h-14 w-[360px] items-center gap-2 rounded-[10px] border-2 border-orange px-3.5 text-[16px] text-[#b6b3bd]">
            <span className="text-lg text-[#f5932b]">⌕</span>
            <span>I am looking for ...</span>
          </div>
          <div className="text-[16px] text-[#9c98a5]">◉ Nig.</div>
        </div>

        <div className="flex items-center gap-2.5">
          <IconBox>◠</IconBox>
          <IconBox>⌖</IconBox>
          <IconBox>✉</IconBox>
          <img className="h-11 w-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80" alt="avatar" />
          <button className="h-14 rounded-[11px] bg-gradient-to-r from-amber to-orange px-5 text-[16px] text-white shadow-glow" onClick={() => navigate("/promote-ad")}>
            Post a free ad
          </button>
        </div>
      </header>

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

      <footer className="grid grid-cols-1 gap-6 bg-deep px-[70px] py-[84px] text-[#b0afbc] md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.8fr]">
        <div className="mt-2 text-[58px] leading-none text-[#ff9412]">qwik</div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">About</h5>
          <button className="mb-2.5 block text-[16px] text-[#5f6071]" onClick={() => navigate("/signup")}>
            About Qwik
          </button>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Career</a>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Terms</a>
        </div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">Resources</h5>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Blog</a>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Instagram</a>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Youtube</a>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Twitter</a>
        </div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">Support</h5>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">help@qwik.ng</a>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">FAQs</a>
        </div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">Download</h5>
          <button className="mb-2.5 h-14 w-full rounded-[10px] bg-[#1a1b33] text-[16px] text-[#76798d]">App Store</button>
          <button className="h-14 w-full rounded-[10px] bg-[#1a1b33] text-[16px] text-[#76798d]">Play Store</button>
        </div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">Stay up to date</h5>
          <p className="mb-2.5 text-[16px] leading-[1.38] text-[#5f6071]">Get news, offers, promotions & the best deals sent to your inbox.</p>
          <div className="mt-2 flex">
            <input className="h-[54px] flex-1 rounded-l-[10px] border border-r-0 border-[#ff9b00] bg-transparent px-3 text-[15px] text-[#b5b5c3] outline-none" placeholder="@email" />
            <button className="h-[54px] rounded-r-[10px] bg-gradient-to-r from-amber to-orange px-[18px] text-[15px] text-white shadow-glow">Subscribe</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

