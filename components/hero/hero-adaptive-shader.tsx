"use client";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import HeroShape from "./hero-shape";
import HeroShapeCSS from "./hero-shape-css";
import type { DeviceCapabilities } from "@/lib/device-profiler.js";
import HeroSVGs from "../svgs/hero-svgs";

interface DeviceCapabilityContextType {
  isProfiled: boolean;
  shouldUseShaders: boolean;
  capabilities: DeviceCapabilities | null;
  deviceTier: "high" | "medium" | "low" | null;
}

interface AdaptiveHeroShaderProps {
  className?: string;
  deviceCapability: DeviceCapabilityContextType;
}

/**
 * Example component that demonstrates tier-based rendering:
 * - High-tier: Full shader with ripple effects and high quality
 * - Medium-tier: Simplified shader with reduced quality
 * - Low-tier: Static image with CSS effects only
 */
export const AdaptiveHeroShader = ({
  className,
  deviceCapability,
}: AdaptiveHeroShaderProps) => {
  // Determine rendering approach based on device tier
  const renderingConfig = useMemo(() => {
    const tier = deviceCapability.deviceTier;
    const shouldUseShaders = deviceCapability.shouldUseShaders;

    if (!deviceCapability.isProfiled) {
      // While profiling, show loading state
      return {
        type: "loading",
        quality: "medium",
        useShader: false,
      };
    }

    switch (tier) {
      case "high":
        return {
          type: "shader",
          quality: "high" as const,
          useShader: shouldUseShaders,
        };
      case "medium":
        return {
          type: "shader",
          quality: "medium" as const,
          useShader: shouldUseShaders,
        };
      case "low":
      default:
        return {
          type: "static",
          quality: "low" as const,
          useShader: false,
        };
    }
  }, [deviceCapability]);

  // High and medium tier: Use shader-based rendering
  if (renderingConfig.type === "shader" && renderingConfig.useShader) {
    return (
      <div className={cn("absolute inset-0 -z-1", className)}>
        <HeroShape quality={renderingConfig.quality} />
      </div>
    );
  }

  // Low tier or shader fallback: Static image with CSS effects
  return (
    <div className={cn("absolute inset-0 -z-1", className)}>
      <HeroShapeCSS />
    </div>
  );
};

export default AdaptiveHeroShader;
