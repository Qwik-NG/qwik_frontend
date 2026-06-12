import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { LocationPin } from "./icons/LocationPin";
import { ROUTES } from "../constants/routes";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { UserAvatar } from "./ui/UserAvatar";

type NavigateTo = (to: string) => void;
type HeaderIcon = "bell" | "bookmark" | "mail";

function FooterDisabledButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className="mb-2.5 block cursor-not-allowed text-[14px] text-[#5f6071]/70"
    >
      {children}
    </button>
  );
}

function IconBox({
  children,
  onClick,
  active = false,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`grid h-10 w-10 place-items-center rounded-lg lg:h-[42px] lg:w-[42px] ${active ? "bg-[#0a0820] text-white" : "bg-[#ececec] text-[#1f1d27]"}`}
    >
      {children}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

const MARKETPLACE_SEARCH_PATHS = [ROUTES.HOME, ROUTES.SEARCH, ROUTES.SEARCH_RESULTS, ROUTES.SEARCH_RESULTS_LIST];
const MOBILE_CHROME_HIDDEN_PATHS = [ROUTES.MESSAGES];
const LOCATION_OPTIONS = [
  "All Nigeria",
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Kano",
  "Ibadan",
  "Enugu",
  "Kaduna",
  "Benin City",
];

function shouldShowHeaderSearch(pathname: string) {
  return (
    MARKETPLACE_SEARCH_PATHS.includes(pathname) ||
    pathname.startsWith("/product-details/") ||
    pathname.startsWith("/products/")
  );
}

export function SiteHeader({
  navigate,
  activeIcon,
}: {
  navigate: NavigateTo;
  activeIcon?: HeaderIcon;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Nigeria");
  const [locationOpen, setLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const { display: currentUser } = useCurrentUser();
  const showSearch = shouldShowHeaderSearch(location.pathname);
  const hideOnMobile = MOBILE_CHROME_HIDDEN_PATHS.includes(location.pathname);
  const locationLabel = selectedLocation === "All Nigeria" ? "Nig." : selectedLocation;

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const query = searchQuery.trim();
    if (query) params.set("q", query);
    if (selectedLocation !== "All Nigeria") params.set("location", selectedLocation);
    navigate(`${ROUTES.SEARCH}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleLocationSelect = (option: string) => {
    setSelectedLocation(option);
    setLocationOpen(false);

    if (!showSearch) return;

    // TODO: remove this frontend URL-state bridge once every category search view consumes backend location filters.
    const params = new URLSearchParams(location.search);
    if (option === "All Nigeria") {
      params.delete("location");
    } else {
      params.set("location", option);
    }
    navigate(`${location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  useEffect(() => {
    const nextLocation = new URLSearchParams(location.search).get("location");
    setSelectedLocation(nextLocation || "All Nigeria");
  }, [location.search]);

  useEffect(() => {
    if (!locationOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setLocationOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLocationOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [locationOpen]);

  return (
    <header className={`${hideOnMobile ? "hidden md:flex" : "flex"} relative z-[100] mx-auto w-full max-w-[1728px] flex-wrap items-center gap-2 bg-page/95 px-4 py-0.5 backdrop-blur-sm md:sticky md:top-0 sm:px-6 lg:gap-4 lg:px-12 lg:py-1`}>
      <button
        className="relative h-[54px] w-[54px] shrink-0 overflow-hidden rounded-full bg-white lg:h-[58px] lg:w-[58px]"
        onClick={() => navigate("/")}
      >
        <img
          src="/images/logo-header.png"
          alt="Qwik logo"
          className="h-full w-full object-cover"
        />
      </button>

      <div className="order-3 mt-1.5 flex w-full min-w-0 items-center gap-1.5 md:mt-2.5 md:gap-2.5 lg:order-2 lg:mt-0 lg:flex-1">
        {showSearch ? (
          <form
            onSubmit={handleSearchSubmit}
            className="flex h-10 min-w-0 max-w-[280px] flex-1 items-center gap-1.5 rounded-[9px] border-2 border-orange px-2 text-left text-[13px] text-[#b6b3bd] md:h-11 md:max-w-none md:gap-2 md:rounded-[10px] md:px-3 md:text-[14px] lg:h-[42px] lg:w-[250px] lg:flex-initial lg:rounded-[8px] lg:px-[13px] lg:text-[16px]"
          >
            <button type="submit" className="text-[#f5932b]" aria-label="Search">
              <SearchIcon />
            </button>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-transparent text-[#1f1d27] outline-none placeholder:text-[#b6b3bd]"
              placeholder="I am looking for ..."
              aria-label="Search listings"
            />
          </form>
        ) : null}
        <div ref={locationRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setLocationOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={locationOpen}
            className="flex h-10 max-w-[104px] items-center gap-0.5 rounded-lg px-1.5 text-[13px] text-[#6f6c78] transition hover:bg-white hover:text-[#1f1d27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9715] focus-visible:ring-offset-2 focus-visible:ring-offset-page active:scale-[0.98] md:max-w-[190px] md:gap-1 md:px-2 md:text-[16px]"
          >
            <LocationPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{locationLabel}</span>
            <span className={`text-[12px] transition ${locationOpen ? "rotate-180" : ""}`} aria-hidden="true">⌄</span>
          </button>
          {locationOpen ? (
            <div
              role="listbox"
              aria-label="Choose location"
              className="absolute left-0 top-[calc(100%+8px)] z-[120] w-[210px] overflow-hidden rounded-[14px] border border-[#e8e5df] bg-white py-2 shadow-[0_18px_50px_rgba(31,29,39,0.16)]"
            >
              {LOCATION_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selectedLocation === option}
                  onClick={() => handleLocationSelect(option)}
                  className={`block w-full px-4 py-2.5 text-left text-[14px] transition hover:bg-[#fff3e5] focus:bg-[#fff3e5] focus:outline-none ${
                    selectedLocation === option ? "font-semibold text-[#ff9715]" : "text-[#3f3c48]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-30 ml-auto flex flex-nowrap items-center justify-end gap-1.5 pointer-events-auto lg:order-3 lg:w-auto lg:gap-2">
        <IconBox
          onClick={() => navigate("/notification-empty")}
          active={activeIcon === "bell"}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 9.5a6 6 0 0 0-12 0c0 7-2.6 7.5-2.6 7.5h17.2S18 16.5 18 9.5" />
            <path d="M14.2 20a2.4 2.4 0 0 1-4.4 0" />
          </svg>
        </IconBox>
        <IconBox
          onClick={() => navigate("/saved")}
          active={activeIcon === "bookmark"}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6.5 4.8c0-1 .8-1.8 1.8-1.8h7.4c1 0 1.8.8 1.8 1.8v16.1L12 17.5l-5.5 3.4V4.8Z" />
          </svg>
        </IconBox>
        <IconBox
          onClick={() => navigate("/messages")}
          active={activeIcon === "mail"}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="4" y="6" width="16" height="12" rx="3" />
            <path d="m7.5 9.5 4.5 3.3 4.5-3.3" />
          </svg>
        </IconBox>
        <button
          onClick={() => navigate("/profile-settings")}
          className="cursor-pointer rounded-full"
          type="button"
        >
          <UserAvatar
            name={currentUser.fullName}
            imageUrl={currentUser.avatarUrl}
            alt={`${currentUser.fullName} profile`}
            className="h-10 w-10 rounded-full object-cover lg:h-[42px] lg:w-[42px]"
          />
        </button>
        <button
          className="h-10 cursor-pointer rounded-[11px] bg-gradient-to-r from-amber to-orange px-3 text-[13px] text-white shadow-glow lg:h-[42px] lg:rounded-[8px] lg:px-[16px] lg:text-[16px]"
          onClick={() => navigate("/promote-ad")}
        >
          Post a free ad
        </button>
      </div>
    </header>
  );
}

export function SiteFooter({ navigate }: { navigate: NavigateTo }) {
  const location = useLocation();
  const hideOnMobile = MOBILE_CHROME_HIDDEN_PATHS.includes(location.pathname);

  return (
    <footer className={`${hideOnMobile ? "hidden md:grid" : "grid"} grid-cols-3 gap-4 bg-[#040316] px-4 py-10 text-[#b0afbc] sm:gap-6 sm:px-6 lg:px-10 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.8fr] xl:px-[70px] xl:py-[76px]`}>
      <button
        onClick={() => navigate("/")}
        className="col-span-3 mt-2 text-left text-[40px] leading-none text-[#ff9412] sm:col-span-1 sm:text-[58px]"
      >
        qwik
      </button>
      <div className="col-span-1">
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">About</h5>
        <button
          className="mb-2.5 block text-[14px] text-[#5f6071]"
          onClick={() => navigate(ROUTES.ABOUT)}
        >
          About Qwik
        </button>
        <button onClick={() => navigate(ROUTES.CAREER)} className="mb-2.5 block text-[14px] text-[#5f6071]">Career</button>
        <button onClick={() => navigate(ROUTES.TERMS)} className="mb-2.5 block text-[14px] text-[#5f6071]">Terms</button>
        <button onClick={() => navigate(ROUTES.PRIVACY_POLICY)} className="mb-2.5 block text-[14px] text-[#5f6071]">Privacy Policy</button>
      </div>
      <div className="col-span-1">
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Resources
        </h5>
        <button onClick={() => navigate(ROUTES.BLOG)} className="mb-2.5 block text-[14px] text-[#5f6071]">Blog</button>
        <FooterDisabledButton>Instagram</FooterDisabledButton>
        <FooterDisabledButton>Youtube</FooterDisabledButton>
        <FooterDisabledButton>Twitter</FooterDisabledButton>
      </div>
      <div className="col-span-1">
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Support
        </h5>
        <button onClick={() => navigate(ROUTES.SUPPORT)} className="mb-2.5 block text-[14px] text-[#5f6071]">help@qwik.ng</button>
        <button onClick={() => navigate(ROUTES.FAQS)} className="mb-2.5 block text-[14px] text-[#5f6071]">FAQs</button>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Download
        </h5>
        <div className="flex gap-2.5 sm:flex-col sm:gap-2.5">
          <button disabled aria-disabled="true" type="button" className="flex h-12 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-[10px] bg-[#1b1a2f] px-2 text-[13px] text-[#76798d]/80 sm:w-[160px] sm:flex-none sm:justify-start sm:px-4 sm:text-[14px]">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current text-[#666877]"
              aria-hidden="true"
            >
              <path d="M16.5 12.8c0-2 1.7-3 1.8-3.1-1-.1-2-.6-2.6-1.3-1.1-1.1-2.7-1-3.4-.7-.7.3-1.3.7-2 .7-.8 0-1.5-.4-2.3-.7-1-.4-2.3-.1-3.2.8-1.7 1.8-1.4 5.2.3 7.9.8 1.3 1.8 2.7 3.1 2.7 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.5c.5-.7.8-1.5 1-2.1-.1-.1-2.1-.8-2.1-3.7ZM14.9 6.5c.7-.8 1.1-1.8 1-2.8-1 .1-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1.1.1 2.1-.5 2.7-1.4Z" />
            </svg>
            <span>App Store</span>
          </button>
          <button disabled aria-disabled="true" type="button" className="flex h-12 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-[10px] bg-[#1b1a2f] px-2 text-[13px] text-[#76798d]/80 sm:w-[160px] sm:flex-none sm:justify-start sm:px-4 sm:text-[14px]">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current text-[#666877]"
              aria-hidden="true"
            >
              <path d="M5.5 3.6v16.8L14 12 5.5 3.6Zm1.4-.9 9.8 5.6-2 2L6.9 2.7Zm0 18.6 7.8-7.6 2 2-9.8 5.6Zm10.8-12.4 2.4 1.4c1.2.7 1.2 2.1 0 2.8l-2.4 1.4-2.2-2.8 2.2-2.8Z" />
            </svg>
            <span>Play Store</span>
          </button>
        </div>
      </div>
      <div className="col-span-3 sm:col-span-3 xl:col-span-1">
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Stay up to date
        </h5>
        <p className="mb-2.5 text-[14px] leading-[1.38] text-[#5f6071]">
          Get news, offers, promotions & the best deals sent to your inbox.
        </p>
        <div className="mt-2 flex flex-row gap-2">
          <input
            className="h-[54px] flex-1 rounded-[10px] border border-[#ff9b00] bg-transparent px-3 text-[15px] text-[#b5b5c3] outline-none"
            placeholder="@email"
          />
          <button className="h-[54px] shrink-0 rounded-[10px] bg-gradient-to-r from-amber to-orange px-[18px] text-[15px] text-white shadow-glow">
            Subscribe
          </button>
        </div>
      </div>
    </footer>
  );
}
