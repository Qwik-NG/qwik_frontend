import { useEffect, useState, type ReactNode } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
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
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={`${className} ${fit === "contain" ? "object-contain" : "object-cover"}`.trim()}
      onError={() => setFailed(true)}
    />
  );
}
