import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Product = {
  price: string;
  title: string;
  description: string;
  location: string;
  image: string;
  fit: "contain" | "cover";
};

const savedProducts: Product[] = [
  {
    price: "₦ 1,900,000",
    title: "Apple MacBook Pro",
    description: "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
    location: "Lagos, Ikeja",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1697311054290",
    fit: "contain"
  },
  {
    price: "₦ 11,000,000",
    title: "Mercedes-Benz GLA 250 2015 Blue",
    description: "Keyless entry Panoramic roof Led intelligent light Custom duty fully paid This is a very sharp...",
    location: "Abuja, Apo",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=900&auto=format&fit=crop",
    fit: "cover"
  }
];

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

function ProductCard({ item }: { item: Product }) {
  return (
    <article className="h-[522px] w-full rounded-[25px] bg-white px-[17px] pb-[17px] pt-[15px]">
      <div className="grid h-[303px] w-full place-items-center overflow-hidden rounded-[14px] bg-white">
        <img
          src={item.image}
          alt={item.title}
          className={`h-full w-full ${item.fit === "contain" ? "object-contain px-4 py-3" : "object-cover"}`}
        />
      </div>

      <div className="pt-[18px]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="m-0 text-[24px] font-semibold leading-none text-ink">{item.price}</h3>
          <span className="rounded-[8px] bg-amber/10 px-2.5 py-[7px] text-[14px] leading-none text-orange">New</span>
        </div>
        <h4 className="mb-[15px] mt-[21px] text-[18px] font-semibold leading-[1.18] text-ink">{item.title}</h4>
        <p className="mb-[15px] min-h-[50px] text-[17px] leading-[1.35] text-muted">{item.description}</p>
        <small className="flex items-center gap-1 text-[15px] text-muted">
          <PinIcon />
          {item.location}
        </small>
      </div>
    </article>
  );
}

export default function SavedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-page font-outfit text-ink">
      <header className="mx-auto flex w-full max-w-[1512px] flex-wrap items-center gap-4 px-[24px] pt-[16px] sm:px-[40px] lg:flex-nowrap lg:px-[50px]">
        <div onClick={() => navigate("/")}>
          <QwikLogo />
        </div>

        <div className="order-3 flex w-full items-center gap-[12px] lg:order-none lg:w-auto">
          <div className="flex h-[50px] w-full items-center gap-[10px] rounded-[8px] border border-orange bg-page px-[13px] text-[16px] text-muted sm:w-[250px]">
            <span className="text-orange">
              <SearchIcon />
            </span>
            <span className="text-[#c8c5cc]">I am looking for ...</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap text-[16px] text-muted">
            <PinIcon />
            Nig.
          </div>
        </div>

        <div className="ml-auto flex items-center gap-[10px]">
          <IconButton>
            <BellIcon />
          </IconButton>
          <IconButton active>
            <BookmarkIcon className="h-[22px] w-[22px]" />
          </IconButton>
          <IconButton>
            <MessageIcon />
          </IconButton>
          <img className="h-[50px] w-[50px] rounded-full object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop" alt="avatar" />
          <button
            className="hidden h-[50px] rounded-[8px] bg-gradient-to-r from-amber to-orange px-[18px] text-[16px] font-normal text-white shadow-glow sm:block"
            onClick={() => navigate("/signup")}
          >
            Post a free ad
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1512px] px-[24px] pb-[146px] pt-[37px] sm:px-[60px]">
        <div className="mb-[34px] flex items-center gap-[10px]">
          <BookmarkIcon className="h-[23px] w-[23px] text-ink" />
          <h1 className="text-[30px] font-normal leading-none tracking-normal">Saved</h1>
        </div>

        <div className="grid max-w-[696px] grid-cols-1 gap-[26px] md:grid-cols-2">
          {savedProducts.map((item) => (
            <ProductCard key={item.title} item={item} />
          ))}
        </div>
      </main>

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
    </div>
  );
}
