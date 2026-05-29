import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Category = { name: string; image: string; tone: string };
type Product = { price: string; title: string; description: string; location: string; image: string };

const categories: Category[] = [
  { name: "Cars", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120", tone: "#f5e8e2" },
  { name: "Phones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120", tone: "#e7ebfa" },
  { name: "Jobs", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=120", tone: "#ece8e8" },
  { name: "Agriculture", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120", tone: "#dff1e6" },
  { name: "Sports", image: "https://images.unsplash.com/photo-1614632537423-5e9f4f103ea6?w=120", tone: "#ececec" },
  { name: "Fashion", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=120", tone: "#f3ebdd" },
  { name: "Electronics", image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=120", tone: "#e8e8e8" },
  { name: "Properties", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=120", tone: "#deede5" },
  { name: "Furniture", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=120", tone: "#f2dff0" },
  { name: "Laptop", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120", tone: "#e6e2f0" },
  { name: "Beauty", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120", tone: "#e8dfeb" },
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
  return <button className="h-11 w-11 rounded-lg bg-[#ececec] text-[18px] text-[#2b2a34]">{children}</button>;
}

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="mx-auto flex w-full max-w-[1728px] items-center gap-6 px-12 pt-8">
        <button className="relative h-[86px] w-[96px] shrink-0 rounded-3xl bg-[#ececec]" onClick={() => navigate("/")}>
          <div className="absolute left-9 top-1.5 h-4 w-10 rounded-t-full border-x-[5px] border-t-[5px] border-[#f6b100]" />
          <div className="absolute left-2.5 top-7 grid h-10 w-14 place-items-center rounded-[10px] bg-orange text-sm font-semibold text-white">Qwik</div>
          <div className="absolute right-2 top-9 grid h-8 w-10 place-items-center rounded-lg bg-[#0b6a48] text-xs text-white">ng</div>
          <span className="absolute bottom-2 left-3.5 h-2 w-2 rounded-full bg-[#ff6430]" />
          <span className="absolute bottom-2 left-11 h-2 w-2 rounded-full bg-[#ff6430]" />
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
              {item.image ? <img src={item.image} alt={item.name} className="h-[62px] w-[62px] object-contain" /> : <span className="text-[28px]">••</span>}
            </div>
            <p className="m-0 text-[16px]">{item.name}</p>
          </div>
        ))}
      </section>

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-24 pt-14">
        <h2 className="mb-5 text-[42px] font-medium">Top Ads</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {products.map((item, idx) => (
            <article
              key={`${item.title}-${idx}`}
              className="cursor-pointer rounded-[22px] bg-card p-3 transition hover:scale-[1.01]"
              onClick={() => window.alert(`Clicked: ${item.title}`)}
            >
              <img src={item.image} alt={item.title} className="aspect-square w-full rounded-[14px] object-cover" />
              <div className="px-0 pb-1 pt-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="m-0 text-[39px] font-semibold leading-tight">{item.price}</h3>
                  <span className="rounded-[9px] bg-[#f5ebdc] px-2.5 py-1.5 text-[14px] text-[#ff9715]">New</span>
                </div>
                <h4 className="mb-1 mt-2 text-[19px] font-medium leading-[1.25]">{item.title}</h4>
                <p className="mb-2 text-[16px] leading-[1.35] text-muted">{item.description}</p>
                <small className="text-[15px] text-[#4b4a54]">◉ {item.location}</small>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="grid grid-cols-1 gap-6 bg-deep px-[70px] py-[84px] text-[#b0afbc] md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.8fr]">
        <div className="mt-2 text-[58px] leading-none text-[#ff9412]">qwik</div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">About</h5>
          <button className="mb-2.5 block text-[16px] text-[#5f6071]" onClick={() => navigate("/signup")}>About Qwik</button>
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
