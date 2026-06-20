import type { CSSProperties } from "react";
import { LocationPin } from "../icons/LocationPin";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { FallbackImage } from "../ui/FallbackImage";

export type ListingCardItem = {
  price: string;
  title: string;
  description: string;
  location: string;
  image?: string;
  imageFit?: "cover" | "contain";
  verifiedSeller?: boolean;
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
  imageHeightClassName?: string;
};

const clampStyle = (lines?: number): CSSProperties | undefined =>
  lines
    ? { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }
    : undefined;

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
  imageHeightClassName = "h-[170px] sm:h-[260px]",
}: ListingCardProps) {
  const interactiveClasses = interactive ? "cursor-pointer transition hover:scale-[1.01]" : "";

  return (
    <article
      className={`rounded-[24px] border border-[#ddd9d2] bg-white p-3 shadow-[0_8px_24px_rgba(31,29,39,0.05)] sm:rounded-[28px] sm:p-4 ${interactiveClasses} ${className}`.trim()}
      onClick={onClick}
    >
      <div className={`relative w-full overflow-hidden rounded-[18px] bg-white sm:rounded-[22px] ${imageHeightClassName}`.trim()}>
        {item.verifiedSeller ? (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-[8px] bg-[#73b784] px-2.5 py-1 text-[11px] font-medium text-white sm:left-4 sm:top-4">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
              <path d="m9.4 12.1 1.8 1.8 3.8-4.1" />
            </svg>
            <span>Verified Seller</span>
          </span>
        ) : null}
        {item.image ? (
          <FallbackImage
            src={item.image}
            alt={item.title}
            fit={item.imageFit === "contain" ? "contain" : "cover"}
            className={`h-full w-full ${item.imageFit === "contain" ? "p-4" : ""}`}
            fallback={<ImagePlaceholder title="" labelClassName="hidden" className="rounded-[14px] sm:rounded-[18px]" />}
          />
        ) : (
          <ImagePlaceholder title="" labelClassName="hidden" className="rounded-[14px] sm:rounded-[18px]" />
        )}
      </div>
      <div className="px-0 pb-1 pt-4 sm:pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="m-0 min-w-0 text-[18px] font-semibold leading-none text-[#1f1d27] sm:text-[20px]">{item.price}</h3>
          {showBadge && (
            <span className="shrink-0 rounded-[10px] bg-badge-bg px-2 py-1 text-[12px] text-[#ff9715] sm:rounded-[12px] sm:px-3 sm:py-1.5 sm:text-[14px]">
              {badgeLabel}
            </span>
          )}
        </div>
        <h4
          className="mb-2 mt-4 text-[15px] font-medium leading-[1.32] text-[#1f1d27] sm:text-[18px]"
          style={clampStyle(clampTitleLines)}
        >
          {item.title}
        </h4>
        <p
          className={`mb-3 text-[13px] leading-[1.45] sm:mb-4 sm:text-[15px] ${descriptionClassName}`}
          style={clampStyle(clampDescriptionLines)}
        >
          {item.description}
        </p>
        <small className="flex items-center gap-1 text-[13px] text-[#5f5d6c] sm:text-[15px]">
          <LocationPin className="h-4 w-4" />
          <span style={clampStyle(clampLocationLines)}>{item.location}</span>
        </small>
      </div>
    </article>
  );
}
