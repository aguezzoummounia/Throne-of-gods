"use client";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import { useRef, useMemo } from "react";
import { RippleImage } from "./ripple-image.jsx";
import { usePreloader } from "@/context/asset-loader-provider";
import {
  selectComponent,
  getShaderQuality,
  shouldRenderShader,
  getAnimationDuration,
  type ComponentVariants,
} from "@/lib/component-selection-utils";
import { FooterSVG } from "./svgs/footer-svg";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface AdaptiveRippleImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  animationDuration?: number;
}

/**
 * Adaptive version of RippleImage that demonstrates tier-based component selection
 * This shows how to integrate device capability detection into existing shader components
 */
export const AdaptiveRippleImage: React.FC<AdaptiveRippleImageProps> = ({
  src = "/images/static/footer-image.png",
  alt = "Glassy vertical-slit 'eye' and a small central flame",
  className,
  fallbackSrc,
  animationDuration = 2500,
}) => {
  const { deviceCapability } = usePreloader();
  const imageRef = useRef<HTMLImageElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(svgRef.current, {
        scale: 0.5,
        delay: 0.6,
        rotation: 90,
        autoAlpha: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 80%",
        },
      });
      // Image animation - different for mobile and desktop
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          y: 50,
          autoAlpha: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
          },
        });
      }
    },
    {
      scope: container,
      dependencies: [deviceCapability.capabilities?.isMobile],
    }
  );

  // Define component variants for each tier
  const componentVariants = useMemo((): ComponentVariants<React.ReactNode> => {
    const adjustedDuration = getAnimationDuration(
      deviceCapability.deviceTier,
      animationDuration
    );

    return {
      high: (
        <RippleImage
          {...({
            src,
            alt,
            quality: "high" as const,
            animationDuration: adjustedDuration,
            className: "w-full h-full",
          } as any)}
        />
      ),
      medium: (
        <RippleImage
          {...({
            src,
            alt,
            quality: "medium" as const,
            animationDuration: adjustedDuration,
            className: "w-full h-full",
          } as any)}
        />
      ),
      low: (
        <img
          ref={imageRef}
          src={src}
          className="w-full h-full object-cover"
          alt={alt}
        />
      ),
    };
  }, [src, alt, fallbackSrc, animationDuration, deviceCapability.deviceTier]);

  // Show loading state while device profiling is in progress
  if (!deviceCapability.isProfiled) {
    return (
      <div
        className={cn(
          "relative w-full h-full bg-gray-100 animate-pulse",
          className
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Select appropriate component based on device tier and shader support
  const shouldUseShader =
    shouldRenderShader(deviceCapability.deviceTier) &&
    deviceCapability.shouldUseShaders;
  const selectedComponent = shouldUseShader
    ? selectComponent(componentVariants, deviceCapability.deviceTier)
    : componentVariants.low;

  return (
    <div
      ref={container}
      className={cn(
        "absolute md:bottom-[0%] md:translate-y-[50%] md:left-[50%] md:-translate-x-[50%] max-md:h-[70%] max-md:aspect-square max-md:w-auto xl:w-[45%] lg:w-[60%] md:w-[60%] aspect-square image-ripple-container",
        className
      )}
    >
      <FooterSVG
        ref={svgRef}
        className="svg-footer-element pointer-events-none"
      />
      {selectedComponent}
    </div>
  );
};

export default AdaptiveRippleImage;
