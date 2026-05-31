import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

type SavedAd = {
  price: string;
  title: string;
  description: string;
  location: string;
  image: string;
  fit?: "cover" | "contain";
};

const savedAds: SavedAd[] = [
  {
    price: "₦ 1,900,000",
    title: "Apple MacBook Pro",
    description: "New Laptop Apple MacBook Pro 32GB Apple M1 SSD 1T",
    location: "Lagos, Ikeja",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200",
    fit: "contain",
  },
  {
    price: "₦ 11,000,000",
    title: "Mercedes-Benz GLA 250 2015 Blue",
    description:
      "Keyless entry Panoramic roof Led intelligent light Custom duty fully paid This is a very sharp...",
    location: "Abuja, Apo",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1200",
    fit: "cover",
  },
];

function BookmarkIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M6.5 4.8c0-1 .8-1.8 1.8-1.8h7.4c1 0 1.8.8 1.8 1.8v16.1L12 17.5l-5.5 3.4V4.8Z" />
    </svg>
  );
}

function LocationPin() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M19 10c0 5.3-7 10-7 10s-7-4.7-7-10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function SavedCard({ ad }: { ad: SavedAd }) {
  return (
    <article className="rounded-[22px] bg-white p-2.5 sm:rounded-[26px] sm:p-4">
      <div className="h-[170px] w-full overflow-hidden rounded-[14px] bg-white sm:h-[260px] sm:rounded-[18px]">
        <img
          src={ad.image}
          alt={ad.title}
          className={`h-full w-full ${ad.fit === "contain" ? "object-contain p-4" : "object-cover"}`}
        />
      </div>
      <div className="px-0 pb-1 pt-3 sm:pt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="m-0 whitespace-nowrap text-[16px] font-semibold leading-none text-ink sm:text-[20px]">{ad.price}</h3>
          <span className="rounded-[10px] bg-[#f5ebdc] px-2 py-1 text-[12px] text-[#ff9715] sm:rounded-[12px] sm:px-3 sm:py-1.5 sm:text-[15px]">New</span>
        </div>
        <h4 className="mb-1.5 mt-3 text-[15px] font-medium leading-[1.25] text-ink sm:mt-4 sm:text-[18px]">{ad.title}</h4>
        <p className="mb-2 text-[13px] leading-[1.35] text-[#6d6a74] sm:mb-3 sm:text-[15px] sm:leading-[1.4]">{ad.description}</p>
        <small className="flex items-center gap-1 text-[13px] text-[#4b4a54] sm:text-[15px]">
          <LocationPin />
          {ad.location}
        </small>
      </div>
    </article>
  );
}

export default function SavedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} activeIcon="bookmark" />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pb-24 lg:pt-14">
        <div className="mb-6 flex items-center gap-2.5">
          <BookmarkIcon />
          <h1 className="text-[34px] font-normal leading-none text-ink">Saved</h1>
        </div>

        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {savedAds.map((ad) => (
            <SavedCard key={ad.title} ad={ad} />
          ))}
        </section>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
