import { LocationPin } from "../icons/LocationPin";
import { FallbackImage } from "../ui/FallbackImage";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import PromotedBadge from "./PromotedBadge";

export type ProductCardItem = {
  title: string;
  price: string;
  location: string;
  description: string;
  image?: string;
  condition?: string | null;
  isPromoted?: boolean;
  promotedUntil?: string;
};

type ProductCardProps = {
  item: ProductCardItem;
  onClick?: () => void;
  badgeLabel?: string;
  showBadge?: boolean;
  className?: string;
};

export default function ProductCard({
  item,
  onClick,
  badgeLabel = "New",
  showBadge = true,
  className = "",
}: ProductCardProps) {
  const label = item.condition?.trim() || badgeLabel;
  const isPromotedActive = item.isPromoted && item.promotedUntil && new Date(item.promotedUntil) > new Date();

  return (
    <article className={`cursor-pointer rounded-[18px] bg-white p-3 ${className}`.trim()} onClick={onClick}>
      <FallbackImage
        src={item.image}
        alt={item.title}
        className="h-[180px] w-full rounded-[12px]"
        fallback={<ImagePlaceholder title="" labelClassName="hidden" className="h-[180px] rounded-[12px]" />}
      />
      <div className="pt-3">
        <div className="mb-2 flex items-center gap-2">
          <h4 className="text-[20px] font-semibold">{item.price}</h4>
          {isPromotedActive ? <PromotedBadge /> : null}
        </div>
        <h5 className="mb-2 text-[16px] font-medium leading-tight">{item.title}</h5>
        <p className="mb-2 text-[14px] leading-[1.35] text-[#6d6a74]">{item.description}</p>
        <div className="flex items-end justify-between gap-2">
          <small className="flex min-w-0 items-center gap-1 text-[14px] text-[#4b4a54]">
            <LocationPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.location}</span>
          </small>
          {showBadge && label ? (
            <span className="shrink-0 rounded-[8px] bg-badge-bg px-2 py-0.5 text-[11px] font-medium text-[#c07a1f]">
              {label}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
