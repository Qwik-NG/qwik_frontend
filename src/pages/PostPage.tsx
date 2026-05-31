import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

function QwikLogo() {
  return (
    <button className="relative h-[92px] w-[92px] shrink-0 rounded-full bg-white" aria-label="Qwik home">
      <span className="absolute left-[33px] top-[12px] h-[17px] w-[29px] rounded-t-full border-x-[5px] border-t-[5px] border-amber" />
      <span className="absolute left-[14px] top-[35px] grid h-[20px] w-[51px] place-items-center rounded-[8px] bg-orange text-[10px] font-semibold text-white">
        Qwik
      </span>
      <span className="absolute right-[19px] top-[52px] grid h-[31px] w-[31px] rotate-[-22deg] place-items-center rounded-[8px] bg-[#0b6a48] text-[9px] text-white">
        .ng
      </span>
      <span className="absolute bottom-[13px] left-[28px] h-2.5 w-2.5 rounded-full bg-orange" />
      <span className="absolute bottom-[13px] left-[54px] h-2.5 w-2.5 rounded-full bg-orange" />
    </button>
  );
}

function IconButton({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <button className={`grid h-[50px] w-[50px] place-items-center rounded-lg ${active ? "bg-deep text-white" : "bg-card text-ink"}`}>
      {children}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function BookmarkIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M6.5 4.8c0-1 .8-1.8 1.8-1.8h7.4c1 0 1.8.8 1.8 1.8v16.1L12 17.5l-5.5 3.4V4.8Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M18 9.5a6 6 0 0 0-12 0c0 7-2.6 7.5-2.6 7.5h17.2S18 16.5 18 9.5" />
      <path d="M14.2 20a2.4 2.4 0 0 1-4.4 0" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <path d="m7.5 9.5 4.5 3.3 4.5-3.3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M19 10c0 5.3-7 10-7 10s-7-4.7-7-10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[30px] w-[30px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.8">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M16.5 12.8c0-2 1.7-3 1.8-3.1-1-.1-2-.6-2.6-1.3-1.1-1.1-2.7-1-3.4-.7-.7.3-1.3.7-2 .7-.8 0-1.5-.4-2.3-.7-1-.4-2.3-.1-3.2.8-1.7 1.8-1.4 5.2.3 7.9.8 1.3 1.8 2.7 3.1 2.7 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.5c.5-.7.8-1.5 1-2.1-.1-.1-2.1-.8-2.1-3.7ZM14.9 6.5c.7-.8 1.1-1.8 1-2.8-1 .1-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1.1.1 2.1-.5 2.7-1.4Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M5.5 3.6v16.8L14 12 5.5 3.6Zm1.4-.9 9.8 5.6-2 2L6.9 2.7Zm0 18.6 7.8-7.6 2 2-9.8 5.6Zm10.8-12.4 2.4 1.4c1.2.7 1.2 2.1 0 2.8l-2.4 1.4-2.2-2.8 2.2-2.8Z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="w-full overflow-hidden bg-deep px-[24px] py-[48px] text-[#5f5d6c] sm:px-[48px] lg:px-[70px] lg:pb-[116px] lg:pt-[112px]">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-[34px] xl:grid-cols-[minmax(80px,0.7fr)_minmax(390px,3.2fr)_minmax(140px,1fr)_minmax(300px,1.8fr)] xl:gap-[32px] 2xl:gap-[76px]">
        <div className="min-w-0 text-[38px] font-normal leading-none text-orange xl:pt-[4px]">qwik</div>

        <div className="grid min-w-0 grid-cols-3 gap-x-[14px] gap-y-7">
          <div className="min-w-0">
            <h5 className="mb-[16px] text-[14px] font-semibold text-white sm:text-[15px] xl:mb-[28px] xl:text-[17px]">About</h5>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">About Qwik</a>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Career</a>
            <a className="block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:text-[17px]">Terms</a>
          </div>

          <div className="min-w-0">
            <h5 className="mb-[16px] text-[14px] font-semibold text-white sm:text-[15px] xl:mb-[28px] xl:text-[17px]">Resources</h5>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Blog</a>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Instagram</a>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Youtube</a>
            <a className="block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:text-[17px]">Twitter</a>
          </div>

          <div className="min-w-0">
            <h5 className="mb-[16px] text-[14px] font-semibold text-white sm:text-[15px] xl:mb-[28px] xl:text-[17px]">Support</h5>
            <a className="mb-[13px] block break-words text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">help@qwik.ng</a>
            <a className="block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:text-[17px]">FAQs</a>
          </div>
        </div>

        <div className="min-w-0">
          <h5 className="mb-[16px] text-[15px] font-semibold text-white xl:mb-[24px] xl:text-[17px]">Download</h5>
          <div className="flex w-full min-w-0 flex-row gap-[10px] xl:flex-col xl:gap-0">
            <button className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[8px] bg-card/10 text-[14px] text-[#5f5d6c] sm:text-[15px] xl:mb-[24px] xl:h-[58px] xl:w-[142px] xl:flex-none xl:text-[17px]">
              <AppleIcon />
              App Store
            </button>
            <button className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[8px] bg-card/10 text-[14px] text-[#5f5d6c] sm:text-[15px] xl:h-[58px] xl:w-[142px] xl:flex-none xl:text-[17px]">
              <PlayIcon />
              Play Store
            </button>
          </div>
        </div>

        <div className="min-w-0 max-w-full">
          <h5 className="mb-[10px] text-[15px] font-semibold text-white xl:mb-[11px] xl:text-[17px]">Stay up to date</h5>
          <p className="mb-[16px] text-[14px] leading-[1.45] text-[#5f5d6c] sm:text-[15px] xl:mb-[18px] xl:text-[17px] xl:leading-[1.35]">Get news, offers, promotions & the best deals sent to your inbox.</p>
          <div className="flex w-full min-w-0 flex-col gap-[10px] xl:flex-row xl:flex-nowrap xl:gap-[8px]">
            <input className="h-[54px] min-w-0 flex-1 rounded-[8px] border border-orange bg-transparent px-[14px] text-[16px] text-muted outline-none xl:h-[48px] xl:px-[12px]" placeholder="@email" />
            <button className="h-[52px] w-full shrink-0 rounded-[8px] bg-gradient-to-r from-amber to-orange px-[18px] text-[16px] text-white shadow-glow xl:h-[48px] xl:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TextField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-[10px] block text-[16px] leading-none text-[#9c98a5]">{label}</span>
      <input
        className="h-[54px] w-full rounded-[9px] border-2 border-card bg-white px-[16px] text-[17px] text-ink outline-none placeholder:text-[#a4a0aa] focus:border-orange"
        placeholder={placeholder}
      />
    </label>
  );
}

export default function PostPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page font-outfit text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto flex w-full max-w-[1512px] flex-col items-center px-[20px] pb-[80px] pt-[36px] sm:px-[40px] lg:pb-[100px]">
        <div className="mb-[18px] grid h-[54px] w-full max-w-[420px] place-items-center rounded-[28px] bg-white px-6">
          <h1 className="text-center text-[24px] font-normal leading-none text-ink sm:text-[26px]">New advert</h1>
        </div>

        <section className="w-full max-w-[420px] rounded-[28px] bg-white px-[20px] pb-[24px] pt-[24px] sm:px-[24px]">
          <h2 className="text-[22px] font-semibold leading-none text-ink">Add pictures</h2>
          <p className="mt-[18px] max-w-[360px] text-[18px] leading-[1.45] text-[#9c98a5]">
            Add a minimum of 6 pictures - your first picture will be used as the cover
          </p>

          <button className="mt-[18px] grid h-[104px] w-[104px] place-items-center rounded-[12px] border-2 border-card text-[#b9b6be]">
            <PlusIcon />
          </button>

          <p className="mt-[20px] text-[17px] leading-none text-[#b9b6be]">jpg, gif & png, 5MB max</p>

          <div className="mt-[34px] space-y-[28px]">
            <TextField label="Title" placeholder="What are you selling?" />
            <label className="block">
              <span className="mb-[10px] block text-[16px] leading-none text-[#9c98a5]">Description</span>
              <textarea
                className="h-[92px] w-full resize-none rounded-[9px] border-2 border-card bg-white px-[16px] py-[14px] text-[17px] leading-[1.45] text-ink outline-none placeholder:text-[#a4a0aa] focus:border-orange"
                placeholder="A brief description of what it is that you’re selling..."
              />
            </label>
          </div>

          <button className="mt-[26px] h-[56px] w-full rounded-[9px] bg-card text-[18px] text-[#b9b6be]" disabled>
            Next
          </button>
        </section>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
