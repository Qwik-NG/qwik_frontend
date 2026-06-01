import type { CSSProperties } from "react";

export type ListingCardItem = {
  price: string;
  title: string;
  description: string;
  location: string;
  image: string;
  imageFit?: "cover" | "contain";
};

type ListingCardProps = {
  item: ListingCardItem;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
  showBadge?: boolean;
  badgeLabel?: string;
  descriptionClassName?: string;
  clampTitleLines?: number;
  clampDescriptionLines?: number;
  clampLocationLines?: number;
};

const clampStyle = (lines?: number): CSSProperties | undefined =>
  lines
    ? { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }
    : undefined;

function LocationPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function ListingCard({
  item,
  onClick,
  className = "",
  interactive = false,
  showBadge = true,
  badgeLabel = "New",
  descriptionClassName = "text-[#6d6a74]",
  clampTitleLines,
  clampDescriptionLines,
  clampLocationLines,
}: ListingCardProps) {
  const interactiveClasses = interactive ? "cursor-pointer transition hover:scale-[1.01]" : "";

  return (
    <article
      className={`rounded-[22px] bg-white p-2.5 sm:rounded-[26px] sm:p-4 ${interactiveClasses} ${className}`.trim()}
      onClick={onClick}
    >
      <div className="h-[170px] w-full overflow-hidden rounded-[14px] bg-white sm:h-[260px] sm:rounded-[18px]">
        <img
          src={item.image}
          alt={item.title}
          className={`h-full w-full ${item.imageFit === "contain" ? "object-contain p-4" : "object-cover"}`}
        />
      </div>
      <div className="px-0 pb-1 pt-3 sm:pt-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="m-0 whitespace-nowrap text-[16px] font-semibold leading-none sm:text-[20px]">{item.price}</h3>
          {showBadge && (
            <span className="rounded-[10px] bg-[#f5ebdc] px-2 py-1 text-[12px] text-[#ff9715] sm:rounded-[12px] sm:px-3 sm:py-1.5 sm:text-[15px]">
              {badgeLabel}
            </span>
          )}
        </div>
        <h4
          className="mb-1.5 mt-3 text-[15px] font-medium leading-[1.25] sm:mt-4 sm:text-[18px]"
          style={clampStyle(clampTitleLines)}
        >
          {item.title}
        </h4>
        <p
          className={`mb-2 text-[13px] leading-[1.35] sm:mb-3 sm:text-[15px] sm:leading-[1.4] ${descriptionClassName}`}
          style={clampStyle(clampDescriptionLines)}
        >
          {item.description}
        </p>
        <small className="flex items-center gap-1 text-[13px] text-[#4b4a54] sm:text-[15px]">
          <LocationPin className="h-4 w-4" />
          <span style={clampStyle(clampLocationLines)}>{item.location}</span>
        </small>
      </div>
    </article>
  );
}
