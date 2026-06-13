import { useEffect, useState, type ReactNode } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { normalizeImageUrl } from "../../lib/imageUrls";

const failedImageUrls = new Set<string>();

type FallbackImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fit?: "cover" | "contain";
  loading?: "eager" | "lazy";
  decoding?: "async" | "auto" | "sync";
  fallback?: ReactNode;
};

export function FallbackImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  fit = "cover",
  loading = "lazy",
  decoding = "async",
  fallback,
}: FallbackImageProps) {
  const normalizedSrc = normalizeImageUrl(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(Boolean(normalizedSrc && failedImageUrls.has(normalizedSrc)));
  }, [normalizedSrc]);

  if (!normalizedSrc || failed) {
    return (
      fallback ?? (
        <ImagePlaceholder
          title="Image unavailable"
          className={fallbackClassName}
        />
      )
    );
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={`${className} ${fit === "contain" ? "object-contain" : "object-cover"}`.trim()}
      onError={() => {
        failedImageUrls.add(normalizedSrc);
        setFailed(true);
      }}
    />
  );
}
