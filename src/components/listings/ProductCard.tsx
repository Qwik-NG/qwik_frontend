export type ProductCardItem = {
  title: string;
  price: string;
  location: string;
  description: string;
  image: string;
};

type ProductCardProps = {
  item: ProductCardItem;
  onClick?: () => void;
  badgeLabel?: string;
  showBadge?: boolean;
  className?: string;
};

function LocationPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function ProductCard({
  item,
  onClick,
  badgeLabel = "New",
  showBadge = true,
  className = "",
}: ProductCardProps) {
  return (
    <article className={`cursor-pointer rounded-[18px] bg-white p-3 ${className}`.trim()} onClick={onClick}>
      <img src={item.image} alt={item.title} className="h-[180px] w-full rounded-[12px] object-cover" />
      <div className="pt-3">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[20px] font-semibold">{item.price}</h4>
          {showBadge && (
            <span className="rounded-[8px] bg-[#f5ebdc] px-2.5 py-1 text-[14px] text-[#ff9715]">
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
