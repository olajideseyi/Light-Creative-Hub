"use client";

import { useEffect, useState } from "react";

type SafeImageProps = {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  priority?: boolean;
  objectPosition?: string;
};

export function SafeImage({ src, alt, fallbackSrc, className, priority = false, objectPosition }: SafeImageProps) {
  const initial = src || fallbackSrc || "";
  const [currentSrc, setCurrentSrc] = useState(initial);
  const [failed, setFailed] = useState(!initial);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc || "");
    setFailed(!(src || fallbackSrc));
  }, [src, fallbackSrc]);

  if (failed) {
    return <div className={`safe-image-placeholder ${className || ""}`} role="img" aria-label={alt}><span>LIGHT CREATIVE HUB</span></div>;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      style={objectPosition ? { objectPosition } : undefined}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
        else setFailed(true);
      }}
    />
  );
}
