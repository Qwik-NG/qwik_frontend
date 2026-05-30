import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

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
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
  }
];

const repeated = [...listings, ...listings, ...listings];


function LocationPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] bg-[#efefef] p-4">
      <p className="mb-3 text-[14px] font-medium">{title}</p>
      {children}
    </div>
  );
}

function ListingCard({ item, onClick }: { item: Listing; onClick: () => void }) {
  return (
    <article className="cursor-pointer rounded-[22px] bg-white p-2.5 transition hover:scale-[1.01] sm:rounded-[26px] sm:p-4" onClick={onClick}>
      <img src={item.image} alt={item.title} className="h-[170px] w-full rounded-[14px] object-cover sm:h-[260px] sm:rounded-[18px]" />
      <div className="px-0 pb-1 pt-3 sm:pt-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="m-0 whitespace-nowrap text-[16px] font-semibold leading-none sm:text-[20px]">{item.price}</h4>
          <span className="rounded-[10px] bg-[#f5ebdc] px-2 py-1 text-[12px] text-[#ff9715] sm:rounded-[12px] sm:px-3 sm:py-1.5 sm:text-[15px]">New</span>
        </div>
        <h5 className="mb-1.5 mt-3 text-[15px] font-medium leading-[1.25] sm:mt-4 sm:text-[18px]" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</h5>
        <p className="mb-2 text-[13px] leading-[1.35] text-[#6d6a74] sm:mb-3 sm:text-[15px] sm:leading-[1.4]" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
        <small className="flex items-center gap-1 text-[13px] text-[#4b4a54] sm:text-[15px]">
          <LocationPin className="h-4 w-4" />
          <span style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.location}</span>
        </small>
      </div>
    </article>
  );
}

export default function SearchResultsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-10 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_1fr]">
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
              <div className="text-[24px] text-[#1f1c26]">◫ ☰</div>
            </div>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {repeated.map((item, idx) => (
                <ListingCard key={`${item.title}-${idx}`} item={item} onClick={() => navigate("/product-details")} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}





