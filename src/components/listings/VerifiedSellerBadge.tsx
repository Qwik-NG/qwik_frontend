export default function VerifiedSellerBadge() {
  return (
    <span className="pointer-events-none absolute left-1.5 top-1.5 z-10 inline-flex max-w-[calc(100%-12px)] items-center gap-1 rounded-full bg-[#73b784] px-2 py-1 text-[11px] font-medium leading-none text-white sm:left-2 sm:top-2 sm:max-w-[calc(100%-16px)]">
      <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
        <path d="m9.4 12.1 1.8 1.8 3.8-4.1" />
      </svg>
      <span className="truncate">Verified Seller</span>
    </span>
  );
}
