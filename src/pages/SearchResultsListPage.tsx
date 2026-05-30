import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

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

function ListCard({ item, onClick }: { item: Listing; onClick: () => void }) {
  return (
    <article className="cursor-pointer rounded-[18px] bg-white p-3" onClick={onClick}>
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
      <SiteHeader navigate={navigate} />

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
                <ListCard key={`${item.title}-${idx}`} item={item} onClick={() => navigate("/product-details")} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}




