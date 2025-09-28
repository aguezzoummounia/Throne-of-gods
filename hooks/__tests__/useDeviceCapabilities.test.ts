import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useDeviceCapabilities } from "../useDeviceCapabilities";

describe("useDeviceCapabilities", () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Set up default window properties
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });

    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1080,
    });

    Object.defineProperty(window, "devicePixelRatio", {
      writable: true,
      configurable: true,
      value: 1,
    });

    // Set up default navigator
    Object.defineProperty(navigator, "userAgent", {
      writable: true,
      configurable: true,
      value:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    });

    // Set up default performance.memory
    Object.defineProperty(performance, "memory", {
      writable: true,
      configurable: true,
      value: {
        totalJSHeapSize: 50000000,
        usedJSHeapSize: 30000000,
        jsHeapSizeLimit: 2147483648,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Basic Functionality", () => {
    it("should return device capabilities object", () => {
      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current).toBeDefined();
      expect(typeof result.current.isMobile).toBe("boolean");
      expect(typeof result.current.hasWebGL).toBe("boolean");
      expect(typeof result.current.gpuTier).toBe("string");
      expect(typeof result.current.maxTextureSize).toBe("number");
      expect(typeof result.current.devicePixelRatio).toBe("number");
      expect(result.current.screenSize).toBeDefined();
      expect(result.current.userAgent).toBeDefined();
    });

    it("should detect desktop device correctly", () => {
      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.userAgent.isDesktop).toBe(true);
      expect(result.current.screenSize.width).toBe(1920);
    });

    it("should detect mobile device from screen size", () => {
      Object.defineProperty(window, "innerWidth", { value: 600 });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.screenSize.width).toBe(600);
    });
  });

  describe("Mobile Detection", () => {
    it("should detect mobile device from user agent", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.userAgent.isMobile).toBe(true);
      expect(result.current.userAgent.os).toBe("ios");
    });

    it("should detect Android device", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36",
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.userAgent.isMobile).toBe(true);
      expect(result.current.userAgent.os).toBe("android");
    });
  });

  describe("Tablet Detection", () => {
    it("should detect iPad", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.userAgent.isTablet).toBe(true);
      expect(result.current.userAgent.isMobile).toBe(false);
    });
  });

  describe("Browser Detection", () => {
    it("should detect Chrome browser", () => {
      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.userAgent.browser).toBe("chrome");
    });

    it("should detect Firefox browser", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.userAgent.browser).toBe("firefox");
    });

    it("should detect Safari browser", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.userAgent.browser).toBe("safari");
    });
  });

  describe("Memory Detection", () => {
    it("should detect memory information when available", () => {
      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.memoryInfo).toBeDefined();
      expect(result.current.memoryInfo?.totalJSHeapSize).toBe(50000000);
      expect(result.current.memoryInfo?.usedJSHeapSize).toBe(30000000);
    });

    it("should handle missing memory API", () => {
      // Remove memory property
      delete (performance as any).memory;

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.memoryInfo).toBeUndefined();
    });
  });

  describe("WebGL Detection", () => {
    it("should detect WebGL support", () => {
      const { result } = renderHook(() => useDeviceCapabilities());

      // WebGL detection depends on the mocked canvas context
      expect(typeof result.current.hasWebGL).toBe("boolean");
      expect(typeof result.current.maxTextureSize).toBe("number");
    });
  });

  describe("Responsive Updates", () => {
    it("should update screen size on window resize", () => {
      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.screenSize.width).toBe(1920);

      // Simulate window resize
      act(() => {
        Object.defineProperty(window, "innerWidth", { value: 768 });
        Object.defineProperty(window, "innerHeight", { value: 1024 });
        window.dispatchEvent(new Event("resize"));
      });

      expect(result.current.screenSize.width).toBe(768);
      expect(result.current.screenSize.height).toBe(1024);
    });
  });

  describe("GPU Tier Classification", () => {
    it("should classify GPU tier based on capabilities", () => {
      const { result } = renderHook(() => useDeviceCapabilities());

      expect(["high", "medium", "low"]).toContain(result.current.gpuTier);
    });

    it("should classify mobile devices appropriately", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)",
      });
      Object.defineProperty(window, "innerWidth", { value: 414 });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isMobile).toBe(true);
      expect(["medium", "low"]).toContain(result.current.gpuTier);
    });
  });

  describe("SSR Safety", () => {
    it("should provide safe defaults", () => {
      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current).toBeDefined();
      expect(typeof result.current.isMobile).toBe("boolean");
      expect(typeof result.current.hasWebGL).toBe("boolean");
      expect(typeof result.current.gpuTier).toBe("string");
      expect(typeof result.current.devicePixelRatio).toBe("number");
    });
  });
});
