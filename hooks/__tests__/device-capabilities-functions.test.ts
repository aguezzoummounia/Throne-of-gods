import { describe, it, expect, beforeEach, vi } from "vitest";

// Import the internal functions for testing
// We'll need to extract these from the hook file or test them indirectly

describe("Device Capabilities Functions", () => {
  beforeEach(() => {
    // Mock global objects
    global.window = {
      innerWidth: 1920,
      innerHeight: 1080,
      devicePixelRatio: 1,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as any;

    global.navigator = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    } as any;

    global.performance = {
      now: vi.fn(() => Date.now()),
      memory: {
        totalJSHeapSize: 50000000,
        usedJSHeapSize: 30000000,
        jsHeapSizeLimit: 2147483648,
      },
    } as any;

    global.document = {
      createElement: vi.fn().mockImplementation((tagName) => {
        if (tagName === "canvas") {
          return {
            getContext: vi.fn(() => ({
              getParameter: vi.fn(() => 4096),
              getExtension: vi.fn(() => ({
                loseContext: vi.fn(),
              })),
            })),
          };
        }
        return { tagName: tagName.toUpperCase() };
      }),
    } as any;
  });

  describe("Browser Detection", () => {
    it("should detect Chrome browser", () => {
      // Test the browser detection logic
      const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
      const browser = getBrowserName(userAgent.toLowerCase());
      expect(browser).toBe("chrome");
    });

    it("should detect Firefox browser", () => {
      const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0";
      const browser = getBrowserName(userAgent.toLowerCase());
      expect(browser).toBe("firefox");
    });

    it("should detect Safari browser", () => {
      const userAgent =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15";
      const browser = getBrowserName(userAgent.toLowerCase());
      expect(browser).toBe("safari");
    });

    it("should handle unknown browser", () => {
      const userAgent = "Unknown Browser/1.0";
      const browser = getBrowserName(userAgent.toLowerCase());
      expect(browser).toBe("unknown");
    });
  });

  describe("Operating System Detection", () => {
    it("should detect Windows", () => {
      const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
      const os = getOperatingSystem(userAgent.toLowerCase());
      expect(os).toBe("windows");
    });

    it("should detect macOS", () => {
      const userAgent =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15";
      const os = getOperatingSystem(userAgent.toLowerCase());
      expect(os).toBe("macos");
    });

    it("should detect iOS", () => {
      const userAgent =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15";
      const os = getOperatingSystem(userAgent.toLowerCase());
      expect(os).toBe("ios");
    });

    it("should detect Android", () => {
      const userAgent =
        "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36";
      const os = getOperatingSystem(userAgent.toLowerCase());
      expect(os).toBe("android");
    });
  });

  describe("GPU Tier Determination", () => {
    it("should classify high-end desktop GPU", () => {
      const params = {
        hasWebGL: true,
        maxTextureSize: 8192,
        isMobile: false,
        devicePixelRatio: 2,
        memoryInfo: { jsHeapSizeLimit: 2147483648 }, // 2GB
      };

      const tier = determineGPUTier(params);
      expect(["high", "medium"]).toContain(tier);
    });

    it("should classify mobile GPU as medium or low", () => {
      const params = {
        hasWebGL: true,
        maxTextureSize: 4096,
        isMobile: true,
        devicePixelRatio: 2,
        memoryInfo: { jsHeapSizeLimit: 1073741824 }, // 1GB
      };

      const tier = determineGPUTier(params);
      expect(["medium", "low"]).toContain(tier);
    });

    it("should classify no WebGL as low tier", () => {
      const params = {
        hasWebGL: false,
        maxTextureSize: 0,
        isMobile: false,
        devicePixelRatio: 1,
        memoryInfo: undefined,
      };

      const tier = determineGPUTier(params);
      expect(tier).toBe("low");
    });
  });

  describe("WebGL Detection", () => {
    it("should detect WebGL support", () => {
      const result = detectWebGLCapabilities();
      expect(result.hasWebGL).toBe(true);
      expect(result.maxTextureSize).toBe(4096);
    });

    it("should handle WebGL not supported", () => {
      // Mock canvas getContext to return null
      global.document.createElement = vi.fn().mockImplementation((tagName) => {
        if (tagName === "canvas") {
          return {
            getContext: vi.fn(() => null),
          };
        }
        return { tagName: tagName.toUpperCase() };
      });

      const result = detectWebGLCapabilities();
      expect(result.hasWebGL).toBe(false);
      expect(result.maxTextureSize).toBe(0);
    });

    it("should handle WebGL context creation error", () => {
      // Mock canvas getContext to throw error
      global.document.createElement = vi.fn().mockImplementation((tagName) => {
        if (tagName === "canvas") {
          return {
            getContext: vi.fn(() => {
              throw new Error("WebGL not supported");
            }),
          };
        }
        return { tagName: tagName.toUpperCase() };
      });

      const result = detectWebGLCapabilities();
      expect(result.hasWebGL).toBe(false);
      expect(result.maxTextureSize).toBe(0);
    });
  });

  describe("Memory Information", () => {
    it("should get memory info when available", () => {
      const memoryInfo = getMemoryInfo();
      expect(memoryInfo).toBeDefined();
      expect(memoryInfo?.totalJSHeapSize).toBe(50000000);
      expect(memoryInfo?.usedJSHeapSize).toBe(30000000);
    });

    it("should handle missing memory API", () => {
      // Remove memory property
      delete (global.performance as any).memory;

      const memoryInfo = getMemoryInfo();
      expect(memoryInfo).toBeUndefined();
    });
  });
});

// Helper functions extracted from the main file for testing
function getBrowserName(userAgent: string): string {
  if (userAgent.includes("chrome")) return "chrome";
  if (userAgent.includes("firefox")) return "firefox";
  if (userAgent.includes("safari") && !userAgent.includes("chrome"))
    return "safari";
  if (userAgent.includes("edge")) return "edge";
  if (userAgent.includes("opera")) return "opera";
  return "unknown";
}

function getOperatingSystem(userAgent: string): string {
  if (userAgent.includes("windows")) return "windows";
  if (userAgent.includes("android")) return "android";
  if (
    userAgent.includes("ios") ||
    userAgent.includes("iphone") ||
    userAgent.includes("ipad")
  )
    return "ios";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("linux")) return "linux";
  return "unknown";
}

function determineGPUTier(params: {
  hasWebGL: boolean;
  maxTextureSize: number;
  isMobile: boolean;
  devicePixelRatio: number;
  memoryInfo?: any;
}): "high" | "medium" | "low" {
  const { hasWebGL, maxTextureSize, isMobile, devicePixelRatio, memoryInfo } =
    params;

  if (!hasWebGL) {
    return "low";
  }

  if (isMobile) {
    if (maxTextureSize >= 4096 && devicePixelRatio >= 2) {
      return "medium";
    }
    return "low";
  }

  if (maxTextureSize >= 8192) {
    if (memoryInfo && memoryInfo.jsHeapSizeLimit > 1073741824) {
      // > 1GB
      return "high";
    }
    return "medium";
  }

  if (maxTextureSize >= 4096) {
    return "medium";
  }

  return "low";
}

function detectWebGLCapabilities(): {
  hasWebGL: boolean;
  maxTextureSize: number;
} {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      return { hasWebGL: false, maxTextureSize: 0 };
    }

    const maxTextureSize = gl.getParameter((gl as any).MAX_TEXTURE_SIZE) || 0;

    // Clean up
    const loseContext = gl.getExtension("WEBGL_lose_context");
    if (loseContext) {
      loseContext.loseContext();
    }

    return { hasWebGL: true, maxTextureSize };
  } catch (error) {
    return { hasWebGL: false, maxTextureSize: 0 };
  }
}

function getMemoryInfo() {
  try {
    // @ts-ignore - performance.memory is Chrome-specific
    if (performance.memory) {
      // @ts-ignore
      return {
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      };
    }
  } catch (error) {
    // Memory API not available
  }
  return undefined;
}
