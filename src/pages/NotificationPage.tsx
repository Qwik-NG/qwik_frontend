import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

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
          <IconBox active>
            <BellIcon />
          </IconBox>
          <IconBox>⌖</IconBox>
          <IconBox>✉</IconBox>
          <img className="h-11 w-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80" alt="avatar" />
          <button className="h-14 rounded-[11px] bg-gradient-to-r from-amber to-orange px-5 text-[16px] text-white shadow-glow" onClick={() => navigate("/promote-ad")}>
            Post a free ad
          </button>
        </div>
      </header>

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
