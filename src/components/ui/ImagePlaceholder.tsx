type ImagePlaceholderProps = {
  title?: string;
  className?: string;
  labelClassName?: string;
};

export function ImagePlaceholder({
  title = "Image unavailable",
  className = "",
  labelClassName = "",
}: ImagePlaceholderProps) {
  return (
    <div className={`grid h-full w-full place-items-center bg-[#f3f3f5] text-[#8c8996] ${className}`.trim()} role="img" aria-label={title}>
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
          <path d="M8 14l2.5-2.5a1.5 1.5 0 0 1 2.1 0L16 15l1.5-1.5a1.5 1.5 0 0 1 2.1 0l.9.9" />
          <circle cx="9" cy="10" r="1.5" />
        </svg>
        <span className={`text-center text-[12px] leading-none ${labelClassName}`.trim()}>{title}</span>
      </div>
    </div>
  );
}