import { useEffect, useState } from "react";
import { normalizeImageUrl } from "../../lib/imageUrls";

const failedImageUrls = new Set<string>();

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
  fallbackTextClassName = "text-[#1f1d27]",
  imageClassName = "h-full w-full object-cover",
}: CategoryBubbleAvatarProps) {
  const normalizedSrc = normalizeImageUrl(imageSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(Boolean(normalizedSrc && failedImageUrls.has(normalizedSrc)));
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
            if (normalizedSrc) {
              failedImageUrls.add(normalizedSrc);
            }
            setFailed(true);
          }}
        />
      ) : (
        <span className={`text-[20px] font-semibold ${fallbackTextClassName}`}>{fallbackText}</span>
      )}
    </span>
  );
}