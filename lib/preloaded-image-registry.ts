/**
 * PreloadedImageRegistry - Singleton service for tracking preloaded images
 *
 * This service maintains a registry of images that have been preloaded by the
 * asset loader, enabling Smart Image components to determine whether to use
 * cached images or fall back to Next.js optimization.
 */
class PreloadedImageRegistry {
  private static instance: PreloadedImageRegistry;
  private preloadedImages = new Set<string>();

  private constructor() {}

  /**
   * Get the singleton instance of the registry
   */
  static getInstance(): PreloadedImageRegistry {
    if (!PreloadedImageRegistry.instance) {
      PreloadedImageRegistry.instance = new PreloadedImageRegistry();
    }
    return PreloadedImageRegistry.instance;
  }

  /**
   * Register an image as preloaded
   * @param src - The image source URL to register
   */
  registerPreloadedImage(src: string): void {
    if (!src) return;
    const normalizedSrc = this.normalizeSrc(src);
    this.preloadedImages.add(normalizedSrc);
  }

  /**
   * Check if an image has been preloaded
   * @param src - The image source URL to check
   * @returns true if the image has been preloaded, false otherwise
   */
  isPreloaded(src: string): boolean {
    if (!src) return false;
    const normalizedSrc = this.normalizeSrc(src);
    return this.preloadedImages.has(normalizedSrc);
  }

  /**
   * Get the normalized URL for a preloaded image
   * @param src - The image source URL
   * @returns the normalized URL if preloaded, null otherwise
   */
  getPreloadedImageUrl(src: string): string | null {
    if (!src) return null;
    const normalizedSrc = this.normalizeSrc(src);
    return this.preloadedImages.has(normalizedSrc) ? normalizedSrc : null;
  }

  /**
   * Clear all registered images (useful for testing)
   */
  clear(): void {
    this.preloadedImages.clear();
  }

  /**
   * Get the count of registered images (useful for debugging)
   */
  getRegisteredCount(): number {
    return this.preloadedImages.size;
  }

  /**
   * Normalize image source paths to handle relative/absolute paths consistently
   * @param src - The raw image source URL
   * @returns normalized source path
   */
  private normalizeSrc(src: string): string {
    // Handle empty or invalid sources
    if (!src || typeof src !== "string") {
      return "";
    }

    // Remove query parameters and fragments for consistent comparison
    const cleanSrc = src.split("?")[0].split("#")[0];

    // Handle absolute URLs (http/https)
    if (cleanSrc.startsWith("http://") || cleanSrc.startsWith("https://")) {
      return cleanSrc;
    }

    // Handle data URLs
    if (cleanSrc.startsWith("data:")) {
      return cleanSrc;
    }

    // Handle absolute paths (starting with /)
    if (cleanSrc.startsWith("/")) {
      return cleanSrc;
    }

    // Convert relative paths to absolute paths
    return `/${cleanSrc}`;
  }
}

export default PreloadedImageRegistry;
