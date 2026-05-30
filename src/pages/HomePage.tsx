import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

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
      <SiteHeader navigate={navigate} />

      <section className="mx-auto grid w-full max-w-[1728px] grid-cols-4 gap-3 px-4 pb-1 pt-8 sm:px-6 sm:pt-[50px] md:grid-cols-6 lg:px-12 xl:grid-cols-12 xl:pt-[70px]">
        {categories.map((item) => (
          <button
            key={item.name}
            className="text-center"
            onClick={() => navigate(item.name === "More" ? "/search-results-list" : "/search-results")}
            type="button"
          >
            <div className="mx-auto mb-2.5 grid h-[86px] w-[86px] place-items-center overflow-hidden rounded-full" style={{ background: item.tone }}>
              {item.image ? (<img src={item.image} alt={item.name} className="h-[62px] w-[62px] object-contain" />) : (<span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-black" /><span className="h-2.5 w-2.5 rounded-full bg-black" /></span>)}
            </div>
            <p className="m-0 text-[16px]">{item.name}</p>
          </button>
        ))}
      </section>

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pb-24 lg:pt-14">
        <h2 className="mb-5 text-[26px] font-medium sm:text-[32px]">Top Ads</h2>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {products.map((item, idx) => (
            <article
              key={`${item.title}-${idx}`}
              className="cursor-pointer rounded-[22px] bg-white p-2.5 transition hover:scale-[1.01] sm:rounded-[26px] sm:p-4"
              onClick={() => navigate("/product-details")}
            >
              <img src={item.image} alt={item.title} className="h-[170px] w-full rounded-[14px] object-cover sm:h-[260px] sm:rounded-[18px]" />
              <div className="px-0 pb-1 pt-3 sm:pt-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="m-0 whitespace-nowrap text-[16px] font-semibold leading-none sm:text-[20px]">{item.price}</h3>
                  <span className="rounded-[10px] bg-[#f5ebdc] px-2 py-1 text-[12px] text-[#ff9715] sm:rounded-[12px] sm:px-3 sm:py-1.5 sm:text-[15px]">New</span>
                </div>
                <h4 className="mb-1.5 mt-3 text-[15px] font-medium leading-[1.25] sm:mt-4 sm:text-[18px]" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</h4>
                <p className="mb-2 text-[13px] leading-[1.35] text-muted sm:mb-3 sm:text-[15px] sm:leading-[1.4]" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
                <small className="flex items-center gap-1 text-[13px] text-[#4b4a54] sm:text-[15px]">
                  <LocationPin className="h-4 w-4" />
                  <span style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.location}</span>
                </small>
              </div>
            </article>
          ))}
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
