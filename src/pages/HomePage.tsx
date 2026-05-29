import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Category = { name: string; image: string; tone: string };
type Product = { price: string; title: string; description: string; location: string; image: string };

const categories: Category[] = [
  { name: "Cars", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f697.png", tone: "#f5e8e2" },
  { name: "Phones", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f4f1.png", tone: "#e7ebfa" },
  { name: "Jobs", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f4bc.png", tone: "#ece8e8" },
  { name: "Agriculture", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f955.png", tone: "#dff1e6" },
  { name: "Sports", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/26bd.png", tone: "#ececec" },
  { name: "Fashion", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f457.png", tone: "#f3ebdd" },
  { name: "Electronics", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f5a5.png", tone: "#e8e8e8" },
  { name: "Properties", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f3e2.png", tone: "#deede5" },
  { name: "Furniture", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1fa91.png", tone: "#f2dff0" },
  { name: "Laptop", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f4bb.png", tone: "#e6e2f0" },
  { name: "Beauty", image: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f9f4.png", tone: "#e8dfeb" },
  { name: "More", image: "", tone: "#f0f0f0" }
];

const seed: Product[] = [
  {
    price: "₦ 11,000,000",
    title: "Mercedes-Benz GLA 250 2015 Blue",
    description: "Keyless entry Panoramic roof Led intelligent light Custom duty fully paid This is a very sharp...",
    location: "Abuja, Apo",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1200"
  },
  {
    price: "₦ 90,800,000",
    title: "Furnished 5bdrm Duplex in Port-Harcourt for Sale",
    description: "Superb design 5 bedroom duplex in a gated community with good road network in a serene environment",
    location: "Rivers, Port-Harcourt",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"
  },
  {
    price: "₦ 85,500,000",
    title: "4bdrm Duplex in Lekki",
    description: "A Well Built and Spacious 4bedroom Semi Detached",
    location: "Lagos, Lekki",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"
  },
  {
    price: "₦ 1,900,000",
    title: "Apple MacBook Pro",
    description: "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
    location: "Lagos, Ikeja",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200"
  }
];

const products = [...seed, ...seed, ...seed];

function IconBox({ children }: { children: ReactNode }) {
  return <button className="grid h-11 w-11 place-items-center rounded-lg bg-[#ececec] text-[#1f1d27]">{children}</button>;
}
function LocationPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="mx-auto flex w-full max-w-[1728px] items-center gap-6 px-12 pt-8">
        <button
          className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-full bg-white"
          onClick={() => navigate("/")}
        >
          <img src="/images/logo-header.png" alt="Qwik logo" className="h-full w-full object-cover" />
        </button>

        <div className="flex flex-1 items-center gap-2.5">
          <div className="flex h-14 w-[360px] items-center gap-2 rounded-[10px] border-2 border-orange px-3.5 text-[16px] text-[#b6b3bd]">
            <span className="text-lg text-[#f5932b]">⌕</span>
            <span>I am looking for ...</span>
          </div>
          <div className="flex items-center gap-1 text-[16px] text-[#9c98a5]">
            <LocationPin className="h-4 w-4" />
            <span>Nig.</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <IconBox><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path d="M15 17H9a2 2 0 0 1-2-2v-3a5 5 0 1 1 10 0v3a2 2 0 0 1-2 2Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg></IconBox>
          <IconBox><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path d="M8 4h8a1 1 0 0 1 1 1v14l-5-3-5 3V5a1 1 0 0 1 1-1Z"/><path d="M10 8h4"/></svg></IconBox>
          <IconBox><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><rect x="4" y="6.5" width="16" height="11" rx="2.5"/><path d="m5.5 8 6.5 5 6.5-5"/></svg></IconBox>
          <img className="h-11 w-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80" alt="avatar" />
          <button
            className="h-14 rounded-[11px] bg-gradient-to-r from-amber to-orange px-5 text-[16px] text-white shadow-glow"
            onClick={() => navigate("/signup")}
          >
            Post a free ad
          </button>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-[1728px] grid-cols-4 gap-3 px-12 pb-1 pt-[70px] md:grid-cols-6 xl:grid-cols-12">
        {categories.map((item) => (
          <div key={item.name} className="text-center">
            <div className="mx-auto mb-2.5 grid h-[86px] w-[86px] place-items-center overflow-hidden rounded-full" style={{ background: item.tone }}>
              {item.image ? (<img src={item.image} alt={item.name} className="h-[62px] w-[62px] object-contain" />) : (<span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-black" /><span className="h-2.5 w-2.5 rounded-full bg-black" /></span>)}
            </div>
            <p className="m-0 text-[16px]">{item.name}</p>
          </div>
        ))}
      </section>

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-24 pt-14">
        <h2 className="mb-5 text-[32px] font-medium">Top Ads</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {products.map((item, idx) => (
            <article
              key={`${item.title}-${idx}`}
              className="cursor-pointer rounded-[26px] bg-white p-4 transition hover:scale-[1.01]"
              onClick={() => window.alert(`Clicked: ${item.title}`)}
            >
              <img src={item.image} alt={item.title} className="h-[260px] w-full rounded-[18px] object-cover" />
              <div className="px-0 pb-1 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="m-0 whitespace-nowrap text-[20px] font-semibold leading-none">{item.price}</h3>
                  <span className="rounded-[12px] bg-[#f5ebdc] px-3 py-1.5 text-[15px] text-[#ff9715]">New</span>
                </div>
                <h4 className="mb-1.5 mt-4 text-[18px] font-medium leading-[1.25]">{item.title}</h4>
                <p className="mb-3 text-[15px] leading-[1.4] text-muted">{item.description}</p>
                <small className="flex items-center gap-1 text-[15px] text-[#4b4a54]">
                  <LocationPin className="h-4 w-4" />
                  <span>{item.location}</span>
                </small>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="grid grid-cols-1 gap-6 bg-[#040316] px-[70px] py-[76px] text-[#b0afbc] md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.8fr]">
        <div className="mt-2 text-[58px] leading-none text-[#ff9412]">qwik</div>
        <div>
          <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">About</h5>
          <button className="mb-2.5 block text-[14px] text-[#5f6071]" onClick={() => navigate("/signup")}>About Qwik</button>
          <a className="mb-2.5 block text-[14px] text-[#5f6071]">Career</a>
          <a className="mb-2.5 block text-[14px] text-[#5f6071]">Terms</a>
        </div>
        <div>
          <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">Resources</h5>
          <a className="mb-2.5 block text-[14px] text-[#5f6071]">Blog</a>
          <a className="mb-2.5 block text-[14px] text-[#5f6071]">Instagram</a>
          <a className="mb-2.5 block text-[14px] text-[#5f6071]">Youtube</a>
          <a className="mb-2.5 block text-[14px] text-[#5f6071]">Twitter</a>
        </div>
        <div>
          <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">Support</h5>
          <a className="mb-2.5 block text-[14px] text-[#5f6071]">help@qwik.ng</a>
          <a className="mb-2.5 block text-[14px] text-[#5f6071]">FAQs</a>
        </div>
        <div>
          <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">Download</h5>
          <button className="mb-2.5 flex h-12 w-[160px] items-center gap-3 rounded-[10px] bg-[#1b1a2f] px-4 text-[14px] text-[#76798d]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[#666877]" aria-hidden="true">
              <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.5-2.5-1.7-3.1-1.8-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.8-2.6-.8-1.4 0-2.7.8-3.4 2-.8 1.4-.2 3.5.6 4.7.4.6.9 1.4 1.7 1.3.7 0 1-.4 1.9-.4.9 0 1.2.4 1.9.4.8 0 1.3-.7 1.7-1.3.5-.8.8-1.6.8-1.7-.1 0-2.2-.8-2.2-3Zm-2.1-6.3c.3-.4.6-1.1.5-1.7-.5 0-1.2.3-1.6.7-.4.4-.7 1-.6 1.6.6 0 1.2-.3 1.7-.6Z" />
            </svg>
            <span>App Store</span>
          </button>
          <button className="flex h-12 w-[160px] items-center gap-3 rounded-[10px] bg-[#1b1a2f] px-4 text-[14px] text-[#76798d]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[#666877]" aria-hidden="true">
              <path d="M3 3.5v17l10.7-8.5L3 3.5Zm11.7 9.2 2.6 2.1 3.8-2-4.5-2.6-1.9 2.5Zm-9.8 8.8 11.8-7.5 2.4 1.4L4.9 21.5Zm0-19L19 8.6 16.7 10 4.9 2.5Z" />
            </svg>
            <span>Play Store</span>
          </button>
        </div>
        <div>
          <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">Stay up to date</h5>
          <p className="mb-2.5 text-[14px] leading-[1.38] text-[#5f6071]">Get news, offers, promotions & the best deals sent to your inbox.</p>
          <div className="mt-2 flex gap-2">
            <input className="h-[54px] flex-1 rounded-[10px] border border-[#ff9b00] bg-transparent px-3 text-[15px] text-[#b5b5c3] outline-none" placeholder="@email" />
            <button className="h-[54px] rounded-[10px] bg-gradient-to-r from-amber to-orange px-[18px] text-[15px] text-white shadow-glow">Subscribe</button>
          </div>
        </div>
      </footer>
    </div>
  );
}




