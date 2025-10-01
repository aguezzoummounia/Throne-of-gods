"use client";

import Image, { ImageProps } from "next/image";
import { forwardRef } from "react";
import { usePreloader } from "@/context/asset-loader-provider";

interface SmartImageProps extends Omit<ImageProps, "src"> {
  src: string;
  alt: string;
  fallbackToOptimized?: boolean;
}

/**
 * Smart Image component that uses preloaded images when available,
 * falling back to Next.js Image optimization for non-preloaded images.
 *
 * This component maintains all Next.js Image features while leveraging
 * the preloader cache to avoid duplicate network requests.
 */
const SmartImage = forwardRef<HTMLImageElement, SmartImageProps>(
  ({ src, alt, fallbackToOptimized = true, ...props }, ref) => {
    const { isImagePreloaded } = usePreloader();

    // Check if the image was preloaded
    const isPreloaded = isImagePreloaded(src);

    // If image is preloaded, use unoptimized version to avoid additional requests
    // If not preloaded and fallback is enabled, use Next.js optimization
    const shouldUseUnoptimized = isPreloaded || !fallbackToOptimized;

    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        unoptimized={shouldUseUnoptimized}
        {...props}
      />
    );
  }
);

SmartImage.displayName = "SmartImage";

export default SmartImage;
