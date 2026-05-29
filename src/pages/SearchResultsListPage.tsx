import { useNavigate } from "react-router-dom";

type Listing = {
  price: string;
  title: string;
  description: string;
  location: string;
  image: string;
};

const listings: Listing[] = [
  {
    price: "₦ 85,500,000",
    title: "4bdrm Duplex in Lekki",
    description: "A Well Built and Spacious 4bedroom Semi Detached",
    location: "Lagos, Lekki",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"
  },
  {
    price: "₦ 85,500,000",
    title: "4bdrm Duplex in Lekki",
    description: "A Well Built and Spacious 4bedroom Semi Detached",
    location: "Lagos, Lekki",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
  },
  {
    price: "₦ 85,500,000",
    title: "4bdrm Duplex in Lekki",
    description: "A Well Built and Spacious 4bedroom Semi Detached",
    location: "Lagos, Lekki",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"
  }
];

const repeated = [...listings, ...listings];

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] bg-[#efefef] p-4">
      <p className="mb-3 text-[14px] font-medium">{title}</p>
      {children}
    </div>
  );
}

function ListCard({ item }: { item: Listing }) {
  return (
    <article className="rounded-[18px] bg-white p-3">
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[220px_1fr]">
        <img src={item.image} alt={item.title} className="h-[220px] w-full rounded-[12px] object-cover" />
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h4 className="text-[42px] font-semibold leading-none">{item.price}</h4>
            <span className="rounded-[9px] bg-[#f5ebdc] px-2.5 py-1 text-[14px] text-[#ff9715]">New</span>
          </div>
          <h5 className="mb-2 text-[18px] font-medium leading-tight">{item.title}</h5>
          <p className="mb-2 text-[16px] leading-[1.35] text-[#6d6a74]">{item.description}</p>
          <small className="text-[15px] text-[#4b4a54]">◉ {item.location}</small>
        </div>
      </div>
    </article>
  );
}

export default function SearchResultsListPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="mx-auto flex w-full max-w-[1728px] items-center gap-5 px-10 pt-6">
        <button className="text-[24px]" type="button">≡</button>
        <button className="text-[44px] text-[#ff8f0a]" onClick={() => navigate("/")} type="button">qwik</button>
        <div className="flex flex-1 items-center gap-2">
          <div className="flex h-12 w-[300px] items-center gap-2 rounded-[10px] border-2 border-orange px-3 text-[14px] text-[#b6b3bd]">
            <span className="text-[#f5932b]">⌕</span>
            <span>I am looking for ...</span>
          </div>
          <div className="text-[14px] text-[#9c98a5]">◉ Nig.</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 rounded-lg bg-[#ececec]" type="button">◠</button>
          <button className="h-10 w-10 rounded-lg bg-[#ececec]" type="button">⌖</button>
          <button className="h-10 w-10 rounded-lg bg-[#ececec]" type="button">✉</button>
          <img className="h-10 w-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80" alt="avatar" />
          <button className="h-12 rounded-[10px] bg-gradient-to-r from-amber to-orange px-4 text-[14px] text-white shadow-glow" onClick={() => navigate("/promote-ad")} type="button">
            Post a free ad
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1728px] px-10 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[220px_1fr]">
          <aside className="space-y-3">
            <FilterCard title="Region">
              <button className="flex w-full items-center justify-between text-[15px] text-[#ff9715]" type="button">
                All Nigeria <span>›</span>
              </button>
            </FilterCard>
            <FilterCard title="Sort by">
              <button className="flex w-full items-center justify-between text-[15px] text-[#ff9715]" type="button">
                Newest first <span>›</span>
              </button>
            </FilterCard>
            <FilterCard title="Categories">
              <div className="space-y-2 text-[15px]">
                <label className="flex items-center gap-2"><input checked readOnly type="checkbox" /> Apartment</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Bungalow</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Mansion</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Duplex</label>
              </div>
            </FilterCard>
            <FilterCard title="Home">
              <div className="space-y-2 text-[15px]">
                <label className="flex items-center gap-2"><input checked readOnly type="checkbox" /> 4 Bedroom</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 3 Bedrooms</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 2 Bedrooms</label>
              </div>
            </FilterCard>
            <FilterCard title="Price">
              <div className="mb-3 flex items-center justify-between text-[14px] text-[#5f5c68]">
                <span>₦ 200,000</span>
                <span>₦ 100,200,000</span>
              </div>
              <input type="range" className="w-full accent-[#ff9715]" />
            </FilterCard>
          </aside>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-[44px] font-medium">
                Found <span className="text-[#ff9715]">23,029</span> results for “Home”
              </h1>
              <div className="text-[22px] text-[#1f1c26]">▦ ☰</div>
            </div>
            <div className="space-y-3">
              {repeated.map((item, idx) => (
                <ListCard key={`${item.title}-${idx}`} item={item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="grid grid-cols-1 gap-6 bg-deep px-[70px] py-[84px] text-[#b0afbc] md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.8fr]">
        <div className="mt-2 text-[58px] leading-none text-[#ff9412]">qwik</div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">About</h5>
          <button className="mb-2.5 block text-[16px] text-[#5f6071]" onClick={() => navigate("/signup")} type="button">About Qwik</button>
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
          <button className="mb-2.5 h-14 w-full rounded-[10px] bg-[#1a1b33] text-[16px] text-[#76798d]" type="button">App Store</button>
          <button className="h-14 w-full rounded-[10px] bg-[#1a1b33] text-[16px] text-[#76798d]" type="button">Play Store</button>
        </div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">Stay up to date</h5>
          <p className="mb-2.5 text-[16px] leading-[1.38] text-[#5f6071]">Get news, offers, promotions & the best deals sent to your inbox.</p>
          <div className="mt-2 flex">
            <input className="h-[54px] flex-1 rounded-l-[10px] border border-r-0 border-[#ff9b00] bg-transparent px-3 text-[15px] text-[#b5b5c3] outline-none" placeholder="@email" />
            <button className="h-[54px] rounded-r-[10px] bg-gradient-to-r from-amber to-orange px-[18px] text-[15px] text-white shadow-glow" type="button">Subscribe</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
