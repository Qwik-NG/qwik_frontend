import { getUserInitials } from "../../lib/currentUser";
import { normalizeImageUrl } from "../../lib/imageUrls";
import { useEffect, useState } from "react";

type UserAvatarProps = {
  name: string;
  imageUrl?: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
};

export function UserAvatar({
  name,
  imageUrl,
  alt,
  className = "",
  fallbackClassName = "",
}: UserAvatarProps) {
  const normalizedImageUrl = normalizeImageUrl(imageUrl);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [normalizedImageUrl]);

  if (normalizedImageUrl && !imageFailed) {
    return <img src={normalizedImageUrl} alt={alt ?? name} className={className} onError={() => setImageFailed(true)} />;
  }

  return (
    <div
      aria-label={alt ?? name}
      className={`grid place-items-center rounded-full bg-[#ececee] text-[15px] font-semibold uppercase tracking-[0.08em] text-[#6d6a74] ${className} ${fallbackClassName}`.trim()}
      role="img"
    >
      <span aria-hidden="true">{getUserInitials(name)}</span>
    </div>
  );
}
