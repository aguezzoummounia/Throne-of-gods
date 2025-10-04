/**
 * Utility functions for selecting appropriate component variants based on device tier
 */

export interface ComponentVariants<T> {
  high: T;
  medium: T;
  low: T;
}

/**
 * Selects the appropriate component variant based on device tier
 * @param variants Object containing component variants for each tier
 * @param deviceTier Current device tier classification
 * @returns The appropriate component variant
 */
export function selectComponent<T>(
  variants: ComponentVariants<T>,
  deviceTier: "high" | "medium" | "low" | null
): T {
  if (!deviceTier) {
    // Default to low-tier if device tier is not available
    return variants.low;
  }

  return variants[deviceTier];
}

/**
 * Determines if shader components should be rendered based on device tier
 * @param deviceTier Current device tier classification
 * @returns True if shaders should be enabled, false otherwise
 */
export function shouldRenderShader(
  deviceTier: "high" | "medium" | "low" | null
): boolean {
  if (!deviceTier) {
    return false;
  }

  // Enable shaders for high and medium tier devices
  return deviceTier === "high" || deviceTier === "medium";
}

/**
 * Gets quality setting for shader components based on device tier
 * @param deviceTier Current device tier classification
 * @returns Quality setting string
 */
export function getShaderQuality(
  deviceTier: "high" | "medium" | "low" | null
): "high" | "medium" | "low" {
  if (!deviceTier) {
    return "low";
  }

  return deviceTier;
}

/**
 * Determines animation duration based on device tier for performance optimization
 * @param deviceTier Current device tier classification
 * @param baselineMs Base animation duration in milliseconds
 * @returns Adjusted animation duration
 */
export function getAnimationDuration(
  deviceTier: "high" | "medium" | "low" | null,
  baselineMs: number = 2500
): number {
  if (!deviceTier) {
    return baselineMs * 0.6; // Shorter for unknown devices
  }

  switch (deviceTier) {
    case "high":
      return baselineMs; // Full duration
    case "medium":
      return baselineMs * 0.8; // Slightly reduced
    case "low":
      return baselineMs * 0.6; // Significantly reduced
    default:
      return baselineMs * 0.6;
  }
}

/**
 * Gets appropriate image quality/size based on device tier
 * @param deviceTier Current device tier classification
 * @returns Image quality configuration
 */
export function getImageQuality(deviceTier: "high" | "medium" | "low" | null): {
  quality: number;
  priority: boolean;
  sizes: string;
} {
  if (!deviceTier) {
    return {
      quality: 60,
      priority: false,
      sizes: "(max-width: 768px) 50vw, 25vw",
    };
  }

  switch (deviceTier) {
    case "high":
      return {
        quality: 90,
        priority: false,
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw",
      };
    case "medium":
      return {
        quality: 75,
        priority: false,
        sizes: "(max-width: 768px) 75vw, (max-width: 1200px) 50vw, 33vw",
      };
    case "low":
      return {
        quality: 60,
        priority: true, // Prioritize loading for low-tier devices
        sizes: "(max-width: 768px) 50vw, 25vw",
      };
    default:
      return {
        quality: 60,
        priority: false,
        sizes: "(max-width: 768px) 50vw, 25vw",
      };
  }
}

/**
 * Type-safe component selection with fallback handling
 * @param components Object containing component options
 * @param deviceTier Current device tier
 * @param fallback Fallback component if tier-specific component is not available
 * @returns Selected component
 */
export function selectComponentWithFallback<T>(
  components: Partial<ComponentVariants<T>>,
  deviceTier: "high" | "medium" | "low" | null,
  fallback: T
): T {
  if (!deviceTier) {
    return components.low || fallback;
  }

  return components[deviceTier] || components.low || fallback;
}

/**
 * Determines if complex animations should be enabled based on device tier
 * @param deviceTier Current device tier classification
 * @returns True if complex animations should be enabled
 */
export function shouldEnableComplexAnimations(
  deviceTier: "high" | "medium" | "low" | null
): boolean {
  return deviceTier === "high";
}

/**
 * Gets frame rate target for animations based on device tier
 * @param deviceTier Current device tier classification
 * @returns Target frame rate
 */
export function getTargetFrameRate(
  deviceTier: "high" | "medium" | "low" | null
): number {
  if (!deviceTier) {
    return 30;
  }

  switch (deviceTier) {
    case "high":
      return 60;
    case "medium":
      return 45;
    case "low":
      return 30;
    default:
      return 30;
  }
}
