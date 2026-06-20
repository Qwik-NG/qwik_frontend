export type ProductCardItem = {
  title: string;
  price: string;
  location: string;
  description: string;
  image?: string;
};

type ProductCardProps = {
  item: ProductCardItem;
  onClick?: () => void;
  badgeLabel?: string;
  showBadge?: boolean;
  className?: string;
};

import { LocationPin } from "../icons/LocationPin";
import { FallbackImage } from "../ui/FallbackImage";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

export default function ProductCard({
  item,
  onClick,
  badgeLabel = "New",
  showBadge = true,
  className = "",
}: ProductCardProps) {
  return (
    <article className={`cursor-pointer rounded-[18px] bg-white p-3 ${className}`.trim()} onClick={onClick}>
      <FallbackImage
        src={item.image}
        alt={item.title}
        className="h-[180px] w-full rounded-[12px]"
        fallback={<ImagePlaceholder title="" labelClassName="hidden" className="h-[180px] rounded-[12px]" />}
      />
      <div className="pt-3">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[20px] font-semibold">{item.price}</h4>
          {showBadge && (
            <span className="rounded-[8px] bg-badge-bg px-2.5 py-1 text-[14px] text-[#ff9715]">
              {badgeLabel}
            </span>
          )}
        </div>
        <h5 className="mb-2 text-[16px] font-medium leading-tight">{item.title}</h5>
        <p className="mb-2 text-[14px] leading-[1.35] text-[#6d6a74]">{item.description}</p>
        <small className="flex items-center gap-1 text-[14px] text-[#4b4a54]">
          <LocationPin className="h-4 w-4" />
          <span>{item.location}</span>
        </small>
      </div>
    </article>
  );
}
