"use client";

import Image, { ImageProps } from "next/image";
import { usePreloader } from "@/context/asset-loader-provider";

interface SmartImageProps extends ImageProps {
  src: string;
  fallbackToOptimized?: boolean;
}

/**
 * Smart Image component that uses preloaded images when available,
 * falling back to Next.js Image optimization for non-preloaded images.
 *
 * This component maintains all Next.js Image features while leveraging
 * the preloader cache to avoid duplicate network requests.
 */
export default function SmartImage({
  src,
  fallbackToOptimized = true,
  ...props
}: SmartImageProps) {
  const { isImagePreloaded } = usePreloader();

  // Check if the image was preloaded
  const isPreloaded = isImagePreloaded(src);

  // If image is preloaded, use unoptimized version to avoid additional requests
  // If not preloaded and fallback is enabled, use Next.js optimization
  const shouldUseUnoptimized = isPreloaded || !fallbackToOptimized;

  return <Image src={src} unoptimized={shouldUseUnoptimized} {...props} />;
}
