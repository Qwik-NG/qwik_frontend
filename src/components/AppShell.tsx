import type { ReactNode } from "react";

type NavigateTo = (to: string) => void;
type HeaderIcon = "bell" | "bookmark" | "mail";

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

function LocationPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
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

export function SiteHeader({
  navigate,
  activeIcon,
}: {
  navigate: NavigateTo;
  activeIcon?: HeaderIcon;
}) {
  return (
    <header className="sticky top-0 z-[100] mx-auto flex w-full max-w-[1728px] flex-wrap items-center gap-2 bg-page/95 px-4 py-0.5 backdrop-blur-sm sm:px-6 lg:gap-4 lg:px-12 lg:py-1">
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

      <div className="order-3 mt-2.5 flex w-full items-center gap-2.5 lg:order-2 lg:mt-0 lg:flex-1">
        <button
          type="button"
          onClick={() => navigate("/search-results")}
          className="flex h-11 w-full items-center gap-2 rounded-[10px] border-2 border-orange px-3 text-left text-[14px] text-[#b6b3bd] lg:h-[42px] lg:w-[250px] lg:rounded-[8px] lg:px-[13px] lg:text-[16px]"
        >
          <span className="text-[#f5932b]">
            <SearchIcon />
          </span>
          <span>I am looking for ...</span>
        </button>
        <div className="flex shrink-0 items-center gap-1 text-[15px] text-[#9c98a5] sm:text-[16px]">
          <LocationPin className="h-4 w-4" />
          <span>Nig.</span>
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
          <img
            className="h-10 w-10 rounded-full object-cover lg:h-[42px] lg:w-[42px]"
            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80"
            alt="avatar"
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
  return (
    <footer className="grid grid-cols-3 gap-4 bg-[#040316] px-4 py-10 text-[#b0afbc] sm:gap-6 sm:px-6 lg:px-10 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.8fr] xl:px-[70px] xl:py-[76px]">
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
          onClick={() => navigate("/signup")}
        >
          About Qwik
        </button>
        <button onClick={() => navigate("/messages")} className="mb-2.5 block text-[14px] text-[#5f6071]">Career</button>
        <button onClick={() => navigate("/signin")} className="mb-2.5 block text-[14px] text-[#5f6071]">Terms</button>
      </div>
      <div className="col-span-1">
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Resources
        </h5>
        <button onClick={() => navigate("/search-results")} className="mb-2.5 block text-[14px] text-[#5f6071]">Blog</button>
        <button onClick={() => navigate("/profile-settings")} className="mb-2.5 block text-[14px] text-[#5f6071]">Instagram</button>
        <button onClick={() => navigate("/messages")} className="mb-2.5 block text-[14px] text-[#5f6071]">Youtube</button>
        <button onClick={() => navigate("/notifications")} className="mb-2.5 block text-[14px] text-[#5f6071]">Twitter</button>
      </div>
      <div className="col-span-1">
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Support
        </h5>
        <button onClick={() => navigate("/messages")} className="mb-2.5 block text-[14px] text-[#5f6071]">help@qwik.ng</button>
        <button onClick={() => navigate("/notifications")} className="mb-2.5 block text-[14px] text-[#5f6071]">FAQs</button>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Download
        </h5>
        <div className="flex gap-2.5 sm:flex-col sm:gap-2.5">
          <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#1b1a2f] px-2 text-[13px] text-[#76798d] sm:w-[160px] sm:flex-none sm:justify-start sm:px-4 sm:text-[14px]">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current text-[#666877]"
              aria-hidden="true"
            >
              <path d="M16.5 12.8c0-2 1.7-3 1.8-3.1-1-.1-2-.6-2.6-1.3-1.1-1.1-2.7-1-3.4-.7-.7.3-1.3.7-2 .7-.8 0-1.5-.4-2.3-.7-1-.4-2.3-.1-3.2.8-1.7 1.8-1.4 5.2.3 7.9.8 1.3 1.8 2.7 3.1 2.7 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.5c.5-.7.8-1.5 1-2.1-.1-.1-2.1-.8-2.1-3.7ZM14.9 6.5c.7-.8 1.1-1.8 1-2.8-1 .1-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1.1.1 2.1-.5 2.7-1.4Z" />
            </svg>
            <span>App Store</span>
          </button>
          <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#1b1a2f] px-2 text-[13px] text-[#76798d] sm:w-[160px] sm:flex-none sm:justify-start sm:px-4 sm:text-[14px]">
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
