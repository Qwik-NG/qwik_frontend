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
      className={`grid h-11 w-11 place-items-center rounded-lg ${active ? "bg-[#0a0820] text-white" : "bg-[#ececec] text-[#1f1d27]"}`}
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
    <header className="relative z-20 mx-auto flex w-full max-w-[1728px] items-center gap-6 px-12 pt-8">
      <button
        className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-full bg-white"
        onClick={() => navigate("/")}
      >
        <img
          src="/images/logo-header.png"
          alt="Qwik logo"
          className="h-full w-full object-cover"
        />
      </button>

      <div className="flex flex-1 items-center gap-2.5">
        <div className="flex h-14 w-[360px] items-center gap-2 rounded-[10px] border-2 border-orange px-3.5 text-[16px] text-[#b6b3bd]">
          <span className="text-[#f5932b]">
            <SearchIcon />
          </span>
          <span>I am looking for ...</span>
        </div>
        <div className="flex items-center gap-1 text-[16px] text-[#9c98a5]">
          <LocationPin className="h-4 w-4" />
          <span>Nig.</span>
        </div>
      </div>

      <div className="relative z-30 flex items-center gap-2.5 pointer-events-auto">
        <IconBox
          onClick={() => navigate("/notification-empty")}
          active={activeIcon === "bell"}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            aria-hidden="true"
          >
            <path d="M15 17H9a2 2 0 0 1-2-2v-3a5 5 0 1 1 10 0v3a2 2 0 0 1-2 2Z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
        </IconBox>
        <IconBox
          onClick={() => navigate("/ads-dashboard")}
          active={activeIcon === "bookmark"}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            aria-hidden="true"
          >
            <path d="M8 4h8a1 1 0 0 1 1 1v14l-5-3-5 3V5a1 1 0 0 1 1-1Z" />
            <path d="M10 8h4" />
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
            strokeWidth="1.9"
            aria-hidden="true"
          >
            <rect x="4" y="6.5" width="16" height="11" rx="2.5" />
            <path d="m5.5 8 6.5 5 6.5-5" />
          </svg>
        </IconBox>
        <button
          onClick={() => navigate("/profile-settings")}
          className="cursor-pointer rounded-full"
          type="button"
        >
          <img
            className="h-11 w-11 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80"
            alt="avatar"
          />
        </button>
        <button
          className="h-14 cursor-pointer rounded-[11px] bg-gradient-to-r from-amber to-orange px-5 text-[16px] text-white shadow-glow"
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
    <footer className="grid grid-cols-1 gap-6 bg-[#040316] px-[70px] py-[76px] text-[#b0afbc] md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.8fr]">
      <div className="mt-2 text-[58px] leading-none text-[#ff9412]">qwik</div>
      <div>
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">About</h5>
        <button
          className="mb-2.5 block text-[14px] text-[#5f6071]"
          onClick={() => navigate("/signup")}
        >
          About Qwik
        </button>
        <a className="mb-2.5 block text-[14px] text-[#5f6071]">Career</a>
        <a className="mb-2.5 block text-[14px] text-[#5f6071]">Terms</a>
      </div>
      <div>
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Resources
        </h5>
        <a className="mb-2.5 block text-[14px] text-[#5f6071]">Blog</a>
        <a className="mb-2.5 block text-[14px] text-[#5f6071]">Instagram</a>
        <a className="mb-2.5 block text-[14px] text-[#5f6071]">Youtube</a>
        <a className="mb-2.5 block text-[14px] text-[#5f6071]">Twitter</a>
      </div>
      <div>
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Support
        </h5>
        <a className="mb-2.5 block text-[14px] text-[#5f6071]">help@qwik.ng</a>
        <a className="mb-2.5 block text-[14px] text-[#5f6071]">FAQs</a>
      </div>
      <div>
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Download
        </h5>
        <button className="mb-2.5 flex h-12 w-[160px] items-center gap-3 rounded-[10px] bg-[#1b1a2f] px-4 text-[14px] text-[#76798d]">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-current text-[#666877]"
            aria-hidden="true"
          >
            <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.5-2.5-1.7-3.1-1.8-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.8-2.6-.8-1.4 0-2.7.8-3.4 2-.8 1.4-.2 3.5.6 4.7.4.6.9 1.4 1.7 1.3.7 0 1-.4 1.9-.4.9 0 1.2.4 1.9.4.8 0 1.3-.7 1.7-1.3.5-.8.8-1.6.8-1.7-.1 0-2.2-.8-2.2-3Zm-2.1-6.3c.3-.4.6-1.1.5-1.7-.5 0-1.2.3-1.6.7-.4.4-.7 1-.6 1.6.6 0 1.2-.3 1.7-.6Z" />
          </svg>
          <span>App Store</span>
        </button>
        <button className="flex h-12 w-[160px] items-center gap-3 rounded-[10px] bg-[#1b1a2f] px-4 text-[14px] text-[#76798d]">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-current text-[#666877]"
            aria-hidden="true"
          >
            <path d="M3 3.5v17l10.7-8.5L3 3.5Zm11.7 9.2 2.6 2.1 3.8-2-4.5-2.6-1.9 2.5Zm-9.8 8.8 11.8-7.5 2.4 1.4L4.9 21.5Zm0-19L19 8.6 16.7 10 4.9 2.5Z" />
          </svg>
          <span>Play Store</span>
        </button>
      </div>
      <div>
        <h5 className="mb-3.5 text-[18px] font-medium text-[#efeff5]">
          Stay up to date
        </h5>
        <p className="mb-2.5 text-[14px] leading-[1.38] text-[#5f6071]">
          Get news, offers, promotions & the best deals sent to your inbox.
        </p>
        <div className="mt-2 flex gap-2">
          <input
            className="h-[54px] flex-1 rounded-[10px] border border-[#ff9b00] bg-transparent px-3 text-[15px] text-[#b5b5c3] outline-none"
            placeholder="@email"
          />
          <button className="h-[54px] rounded-[10px] bg-gradient-to-r from-amber to-orange px-[18px] text-[15px] text-white shadow-glow">
            Subscribe
          </button>
        </div>
      </div>
    </footer>
  );
}
