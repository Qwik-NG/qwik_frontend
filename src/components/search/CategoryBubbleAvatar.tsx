import { useEffect, useState } from "react";
import { normalizeImageUrl } from "../../lib/imageUrls";

type CategoryBubbleAvatarProps = {
  alt: string;
  className: string;
  imageSrc?: string;
  fallbackText: string;
  fallbackTextClassName?: string;
  imageClassName?: string;
};

export function CategoryBubbleAvatar({
  alt,
  className,
  imageSrc,
  fallbackText,
  fallbackTextClassName = "text-[15px] font-semibold text-[#1f1d27]",
  imageClassName = "h-full w-full object-cover",
}: CategoryBubbleAvatarProps) {
  const normalizedSrc = normalizeImageUrl(imageSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [normalizedSrc]);

  const showImage = Boolean(normalizedSrc && !failed);

  return (
    <span className={className}>
      {showImage ? (
        <img
          src={normalizedSrc}
          alt={alt}
          className={imageClassName}
          onError={() => {
            setFailed(true);
          }}
        />
      ) : (
        <span className={`text-[20px] font-semibold ${fallbackTextClassName}`}>{fallbackText}</span>
      )}
    </span>
  );
}