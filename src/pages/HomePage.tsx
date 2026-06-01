import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import ListingCard, { type ListingCardItem } from "../components/listings/ListingCard";

type Category = { name: string; image: string; tone: string };
type Product = ListingCardItem;

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
            <div className="mx-auto mb-1.5 grid h-[68px] w-[68px] place-items-center overflow-hidden rounded-full" style={{ background: item.tone }}>
              {item.image ? (<img src={item.image} alt={item.name} className="h-[46px] w-[46px] object-contain" />) : (<span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-black" /><span className="h-1.5 w-1.5 rounded-full bg-black" /></span>)}
            </div>
            <p className="m-0 text-[13px]">{item.name}</p>
          </button>
        ))}
      </section>

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pb-24 lg:pt-14">
        <h2 className="mb-5 text-[26px] font-medium sm:text-[32px]">Top Ads</h2>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {products.map((item, idx) => (
            <ListingCard
              key={`${item.title}-${idx}`}
              item={item}
              interactive
              descriptionClassName="text-muted"
              clampTitleLines={2}
              clampDescriptionLines={2}
              clampLocationLines={1}
              onClick={() => navigate("/product-details")}
            />
          ))}
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
