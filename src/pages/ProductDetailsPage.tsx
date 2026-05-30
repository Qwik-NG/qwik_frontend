import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

type SimilarAd = {
  title: string;
  price: string;
  location: string;
  description: string;
  image: string;
};

const gallery = [
  "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1200",
  "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200",
  "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1200",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200",
  "https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=1200",
  "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=1200",
  "https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=1200",
  "https://images.unsplash.com/photo-1617814065893-00757125d326?w=1200",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
];

const similarAds: SimilarAd[] = [
  {
    title: "Apple MacBook Pro",
    price: "₦ 1,900,000",
    location: "Lagos, Ikeja",
    description: "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200"
  },
  {
    title: "Mercedes-Benz GLA 250 2015 Blue",
    price: "₦ 11,000,000",
    location: "Abuja, Apo",
    description: "Keyless entry Panoramic roof Led intelligent light Custom duty fully paid",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1200"
  },
  {
    title: "4bdrm Duplex in Lekki",
    price: "₦ 85,500,000",
    location: "Lagos, Lekki",
    description: "A Well Built and Spacious 4bedroom Semi Detached",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"
  },
  {
    title: "Furnished 5bdrm Duplex in Port-Harcourt for Sale",
    price: "₦ 90,800,000",
    location: "Rivers, Port-Harcourt",
    description: "Superb design 5 bedroom duplex in a gated community with good road network",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"
  }
];

function ProductCard({ item, onClick }: { item: SimilarAd; onClick: () => void }) {
  return (
    <article className="cursor-pointer rounded-[18px] bg-white p-3" onClick={onClick}>
      <img src={item.image} alt={item.title} className="h-[180px] w-full rounded-[12px] object-cover" />
      <div className="pt-3">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[20px] font-semibold">{item.price}</h4>
          <span className="rounded-[8px] bg-[#f5ebdc] px-2.5 py-1 text-[14px] text-[#ff9715]">New</span>
        </div>
        <h5 className="mb-2 text-[16px] font-medium leading-tight">{item.title}</h5>
        <p className="mb-2 text-[14px] leading-[1.35] text-[#6d6a74]">{item.description}</p>
        <small className="text-[14px] text-[#4b4a54]">◉ {item.location}</small>
      </div>
    </article>
  );
}

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const selected = useMemo(() => gallery[activeImage], [activeImage]);

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-10 pb-20 pt-6">
        <section className="rounded-[18px] bg-[#efefef] p-6">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_1fr]">
            <div>
              <img src={selected} alt="car" className="h-[430px] w-full rounded-[14px] object-cover" />
              <div className="mt-3 grid grid-cols-10 gap-1.5">
                {gallery.map((src, idx) => (
                  <button
                    key={src}
                    className={`overflow-hidden rounded-[4px] border ${idx === activeImage ? "border-orange" : "border-transparent"}`}
                    onClick={() => setActiveImage(idx)}
                    type="button"
                  >
                    <img src={src} alt={`thumb-${idx + 1}`} className="h-[54px] w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-10">
              <p className="mb-2 text-[18px] text-[#57b77a]">◌ Verified Seller</p>
              <h1 className="text-[42px] leading-tight">Mercedes-Benz GLA 250 2015 Blue</h1>
              <p className="mb-6 mt-1 text-[18px] text-[#6d6a74]">◉ Abuja, Apo</p>
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-[54px] font-semibold">₦ 16,000,000</h2>
                <span className="rounded-[8px] bg-[#f5ebdc] px-2.5 py-1 text-[16px] text-[#ff9715]">New</span>
              </div>
              <p className="mb-6 text-[18px] text-[#57b77a]">↗ Check market price</p>
              <div className="flex items-center gap-3">
                <button className="h-[44px] rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 text-[16px] text-white shadow-glow" onClick={() => navigate("/make-offer")} type="button">
                  Chat Seller
                </button>
                <button className="h-[44px] w-[44px] rounded-[8px] bg-white text-[22px]" type="button">⌖</button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-10 xl:grid-cols-2">
          <div>
            <h3 className="mb-5 text-[40px] font-medium">Product Details</h3>
            <p className="mb-8 max-w-[540px] text-[18px] leading-[1.35] text-[#5f5c68]">
              Keyless entry Panoramic roof Led intelligent light Custom duty fully paid This is a very sharp car and drives Premium speakers Keyless entry Push start
            </p>
            <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-[16px]">
              {[
                ["Brand", "Apple"], ["Model", "iPhone 7"], ["Conditions", "Used"], ["Faults", "No faults"],
                ["Sim", "Nano-SIM"], ["Display type", "IPS LCD"], ["Resolution", "750 x 1334"], ["ROM", "128 GB"],
                ["Primary camera", "12 MP, f/1.8"], ["Selfie camera", "7 MP, f/2.2"], ["Battery", "3000 mAh"], ["Color", "Silver blue"]
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[#8f8b98]">{k}</p>
                  <p className="font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[40px] font-medium">Reviews</h3>
            <div className="mb-4 flex gap-2">
              <img src="https://images.unsplash.com/photo-1542204625-de293a53e17a?w=64" alt="user" className="h-7 w-7 rounded-full object-cover" />
              <div className="flex-1 rounded-[12px] border border-[#d9d7df] bg-white p-3">
                <input className="w-full border-none bg-transparent text-[14px] outline-none" placeholder="I noticed that..." />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[18px] text-[#ff9a00]">★★☆☆☆</span>
                  <button className="h-7 w-7 rounded-full bg-[#ff9a00] text-white" type="button">➤</button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-2.5">
                  <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=64" alt="reviewer" className="h-7 w-7 rounded-full object-cover" />
                  <div>
                    <p className="text-[14px]">
                      Oluwa pelumi <span className="text-[#8f8b98]">5 days ago</span> <span className="text-[#ff9a00]">★★★★★</span>
                    </p>
                    <p className="max-w-[500px] text-[14px] text-[#3f3c47]">Apples are nutritious. Apples may be good for weight loss. apples may be good for your heart. As part of a healthful and varied diet.</p>
                  </div>
                </div>
              ))}
              <button className="text-[16px] text-[#57b77a]" type="button">See all</button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-[18px] bg-[#efefef] p-6">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" className="h-12 w-12 rounded-full object-cover" alt="seller" />
              <div>
                <p className="text-[14px] text-[#8f8b98]">Digi x Enterprise</p>
                <p className="text-[18px]">Registered 4 years ago</p>
                <button className="text-[14px] text-[#ff9715]" type="button">See all ads</button>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="h-10 rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 text-white shadow-glow" onClick={() => navigate("/make-offer")} type="button">◍ Mak an offer</button>
              <button className="h-10 rounded-[8px] bg-[#f5ebdc] px-4 text-[#ff9715]" type="button">◡ Call</button>
            </div>
          </div>
          <div className="rounded-[18px] bg-[#efefef] p-6">
            <h4 className="mb-2 text-[20px] font-medium">Safety tips</h4>
            <ul className="list-disc pl-4 text-[14px] text-[#8f8b98]">
              <li>Remember, don&apos;t send any pre-payments</li>
              <li>Meet the seller at a safe public place</li>
              <li>Inspect the goods to make sure they meet your needs</li>
              <li>Check all documentation and only pay if you&apos;re satisfied</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <button className="rounded-[8px] bg-[#f5ebdc] px-3 py-2 text-[#ff9715]" type="button">Mark Unavailable</button>
              <button className="rounded-[8px] bg-[#ffe7e7] px-3 py-2 text-[#ff4e4e]" type="button">Report</button>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h3 className="mb-4 text-[40px] font-medium">Similar Ads</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {similarAds.map((item) => (
              <ProductCard key={item.title} item={item} onClick={() => navigate("/product-details")} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}




