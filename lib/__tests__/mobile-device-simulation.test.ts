/**
 * Mobile device simulation tests for RippleImage optimization
 * Tests Requirements: 1.1, 2.1, 3.1, 4.1
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeviceCapabilities } from "../../hooks/useDeviceCapabilities";
import { useMobileOptimizations } from "../../hooks/useMobileOptimizations";
import { usePerformanceMonitor } from "../../hooks/usePerformanceMonitor";
import { DeviceClassifier } from "../device-classifier";
import { MobileOptimizations } from "../mobile-optimizations";

// Mobile device configurations for testing
const mobileDeviceConfigs = {
  iPhone13: {
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    screenWidth: 390,
    screenHeight: 844,
    devicePixelRatio: 3,
    memory: {
      usedJSHeapSize: 30000000,
      totalJSHeapSize: 50000000,
      jsHeapSizeLimit: 1073741824,
    },
    connection: { effectiveType: "4g", downlink: 10 },
  },
  iPadPro: {
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    screenWidth: 1024,
    screenHeight: 1366,
    devicePixelRatio: 2,
    memory: {
      usedJSHeapSize: 50000000,
      totalJSHeapSize: 100000000,
      jsHeapSizeLimit: 2147483648,
    },
    connection: { effectiveType: "4g", downlink: 15 },
  },
  samsungGalaxyS21: {
    userAgent:
      "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
    screenWidth: 360,
    screenHeight: 800,
    devicePixelRatio: 3,
    memory: {
      usedJSHeapSize: 40000000,
      totalJSHeapSize: 80000000,
      jsHeapSizeLimit: 1610612736,
    },
    connection: { effectiveType: "4g", downlink: 8 },
  },
  lowEndAndroid: {
    userAgent:
      "Mozilla/5.0 (Linux; Android 9; SM-A102U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36",
    screenWidth: 320,
    screenHeight: 568,
    devicePixelRatio: 1.5,
    memory: {
      usedJSHeapSize: 20000000,
      totalJSHeapSize: 30000000,
      jsHeapSizeLimit: 536870912,
    },
    connection: { effectiveType: "3g", downlink: 2 },
  },
  oldIPhone: {
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
    screenWidth: 320,
    screenHeight: 568,
    devicePixelRatio: 2,
    memory: undefined, // Older devices might not have memory API
    connection: { effectiveType: "3g", downlink: 1.5 },
  },
};

describe("Mobile Device Simulation Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset window properties
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

    // Reset navigator
    Object.defineProperty(navigator, "userAgent", {
      writable: true,
      configurable: true,
      value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    });

    // Reset performance.memory
    Object.defineProperty(performance, "memory", {
      writable: true,
      configurable: true,
      value: {
        usedJSHeapSize: 50000000,
        totalJSHeapSize: 100000000,
        jsHeapSizeLimit: 2147483648,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const simulateDevice = (
    deviceConfig: typeof mobileDeviceConfigs.iPhone13
  ) => {
    Object.defineProperty(navigator, "userAgent", {
      value: deviceConfig.userAgent,
    });
    Object.defineProperty(window, "innerWidth", {
      value: deviceConfig.screenWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      value: deviceConfig.screenHeight,
    });
    Object.defineProperty(window, "devicePixelRatio", {
      value: deviceConfig.devicePixelRatio,
    });

    if (deviceConfig.memory) {
      Object.defineProperty(performance, "memory", {
        value: deviceConfig.memory,
      });
    } else {
      delete (performance as any).memory;
    }

    // Mock network connection
    Object.defineProperty(navigator, "connection", {
      value: deviceConfig.connection,
      writable: true,
      configurable: true,
    });
  };

  describe("Device Detection and Classification", () => {
    it("should correctly detect iPhone 13 capabilities", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.userAgent.os).toBe("ios");
      expect(result.current.userAgent.isMobile).toBe(true);
      expect(result.current.devicePixelRatio).toBe(3);
      expect(result.current.screenSize.width).toBe(390);
      expect(result.current.gpuTier).toBe("medium"); // iPhone 13 should be medium tier
    });

    it("should correctly detect iPad Pro as tablet", () => {
      simulateDevice(mobileDeviceConfigs.iPadPro);

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isMobile).toBe(false); // iPad is not mobile
      expect(result.current.userAgent.isTablet).toBe(true);
      expect(result.current.userAgent.os).toBe("ios");
      expect(result.current.gpuTier).toBe("high"); // iPad Pro should be high tier
    });

    it("should correctly detect Samsung Galaxy S21", () => {
      simulateDevice(mobileDeviceConfigs.samsungGalaxyS21);

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.userAgent.os).toBe("android");
      expect(result.current.userAgent.browser).toBe("chrome");
      expect(result.current.gpuTier).toBe("medium");
    });

    it("should correctly classify low-end Android device", () => {
      simulateDevice(mobileDeviceConfigs.lowEndAndroid);

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.userAgent.os).toBe("android");
      expect(result.current.gpuTier).toBe("low"); // Should be classified as low tier
      expect(result.current.memoryInfo?.jsHeapSizeLimit).toBe(536870912); // 512MB
    });

    it("should handle older iPhone without memory API", () => {
      simulateDevice(mobileDeviceConfigs.oldIPhone);

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.userAgent.os).toBe("ios");
      expect(result.current.memoryInfo).toBeUndefined();
      expect(result.current.gpuTier).toBe("low"); // Older device should be low tier
    });
  });

  describe("Performance Optimization for Mobile Devices", () => {
    it("should apply appropriate optimizations for iPhone 13", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      const { result } = renderHook(() => useMobileOptimizations());

      expect(result.current.shouldUseReducedQuality).toBe(false); // iPhone 13 can handle medium quality
      expect(result.current.shouldUseBatteryOptimizations).toBe(true);
      expect(result.current.shouldUseHapticFeedback).toBe(true);
      expect(result.current.recommendedQuality).toBe("medium");
    });

    it("should apply conservative optimizations for low-end Android", () => {
      simulateDevice(mobileDeviceConfigs.lowEndAndroid);

      const { result } = renderHook(() => useMobileOptimizations());

      expect(result.current.shouldUseReducedQuality).toBe(true);
      expect(result.current.shouldUseBatteryOptimizations).toBe(true);
      expect(result.current.shouldUseHapticFeedback).toBe(false); // May not be reliable
      expect(result.current.recommendedQuality).toBe("low");
    });

    it("should optimize for iPad Pro performance", () => {
      simulateDevice(mobileDeviceConfigs.iPadPro);

      const { result } = renderHook(() => useMobileOptimizations());

      expect(result.current.shouldUseReducedQuality).toBe(false);
      expect(result.current.shouldUseBatteryOptimizations).toBe(false); // iPad Pro can handle full performance
      expect(result.current.recommendedQuality).toBe("high");
    });
  });

  describe("Battery and Performance Monitoring", () => {
    it("should monitor performance on mobile devices", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      const { result } = renderHook(() => usePerformanceMonitor("medium"));

      expect(result.monitor).toBeDefined();
      expect(result.isActive).toBe(true);

      // Should use mobile-appropriate settings
      const config = result.monitor.getCurrentConfig();
      expect(config.targetFPS).toBeLessThanOrEqual(45); // Mobile should target lower FPS
      expect(config.renderOnDemand).toBe(true); // Should use render-on-demand
    });

    it("should detect battery pressure on low-end devices", () => {
      simulateDevice(mobileDeviceConfigs.lowEndAndroid);

      // Mock battery API
      Object.defineProperty(navigator, "getBattery", {
        value: vi.fn(() =>
          Promise.resolve({
            level: 0.2, // 20% battery
            charging: false,
            chargingTime: Infinity,
            dischargingTime: 3600, // 1 hour remaining
          })
        ),
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useMobileOptimizations());

      expect(result.current.shouldUseBatteryOptimizations).toBe(true);
      expect(result.current.batteryLevel).toBeLessThan(0.3); // Should detect low battery
    });

    it("should adapt to network conditions", () => {
      simulateDevice(mobileDeviceConfigs.lowEndAndroid); // Has 3G connection

      const { result } = renderHook(() => useMobileOptimizations());

      expect(result.current.networkQuality).toBe("3g");
      expect(result.current.shouldPreloadAssets).toBe(false); // Don't preload on slow connection
      expect(result.current.shouldUseProgressiveLoading).toBe(true);
    });
  });

  describe("Touch and Interaction Handling", () => {
    it("should optimize touch events for mobile devices", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      const mobileOptimizations = new MobileOptimizations();
      const touchHandler = mobileOptimizations.createOptimizedTouchHandler();

      expect(touchHandler).toBeDefined();
      expect(typeof touchHandler.handleTouchStart).toBe("function");
      expect(typeof touchHandler.handleTouchMove).toBe("function");
      expect(typeof touchHandler.handleTouchEnd).toBe("function");
    });

    it("should support haptic feedback on compatible devices", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      const mockVibrate = vi.fn();
      Object.defineProperty(navigator, "vibrate", { value: mockVibrate });

      const mobileOptimizations = new MobileOptimizations();
      mobileOptimizations.triggerHapticFeedback("light");

      expect(mockVibrate).toHaveBeenCalledWith(50);
    });

    it("should handle touch events with proper debouncing", () => {
      simulateDevice(mobileDeviceConfigs.samsungGalaxyS21);

      const mobileOptimizations = new MobileOptimizations();
      const debouncedHandler =
        mobileOptimizations.createDebouncedTouchHandler(100);

      const mockCallback = vi.fn();

      // Rapid touch events
      debouncedHandler(mockCallback);
      debouncedHandler(mockCallback);
      debouncedHandler(mockCallback);

      // Should only call once due to debouncing
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Memory Management on Mobile", () => {
    it("should detect memory pressure on low-memory devices", () => {
      simulateDevice(mobileDeviceConfigs.lowEndAndroid);

      const deviceClassifier = new DeviceClassifier();
      const isLowMemory = deviceClassifier.isLowMemoryDevice();

      expect(isLowMemory).toBe(true);
    });

    it("should trigger garbage collection on memory pressure", () => {
      simulateDevice(mobileDeviceConfigs.lowEndAndroid);

      // Mock high memory usage
      Object.defineProperty(performance, "memory", {
        value: {
          usedJSHeapSize: 450000000, // 450MB (close to 512MB limit)
          totalJSHeapSize: 500000000,
          jsHeapSizeLimit: 536870912,
        },
      });

      const mobileOptimizations = new MobileOptimizations();
      const shouldCleanup = mobileOptimizations.shouldTriggerMemoryCleanup();

      expect(shouldCleanup).toBe(true);
    });

    it("should manage texture memory efficiently on mobile", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      const deviceClassifier = new DeviceClassifier();
      const maxTextureSize = deviceClassifier.getMaxRecommendedTextureSize();

      // iPhone 13 should have reasonable texture limits
      expect(maxTextureSize).toBeLessThanOrEqual(2048);
      expect(maxTextureSize).toBeGreaterThanOrEqual(512);
    });
  });

  describe("Adaptive Quality Based on Device Capabilities", () => {
    it("should recommend appropriate quality for each device type", () => {
      const deviceQualityMap = [
        { device: mobileDeviceConfigs.iPadPro, expectedQuality: "high" },
        { device: mobileDeviceConfigs.iPhone13, expectedQuality: "medium" },
        {
          device: mobileDeviceConfigs.samsungGalaxyS21,
          expectedQuality: "medium",
        },
        { device: mobileDeviceConfigs.lowEndAndroid, expectedQuality: "low" },
        { device: mobileDeviceConfigs.oldIPhone, expectedQuality: "low" },
      ];

      deviceQualityMap.forEach(({ device, expectedQuality }) => {
        simulateDevice(device);

        const { result } = renderHook(() => useMobileOptimizations());

        expect(result.current.recommendedQuality).toBe(expectedQuality);
      });
    });

    it("should adjust quality based on thermal state", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      // Mock thermal state API (iOS specific)
      Object.defineProperty(navigator, "deviceMemory", { value: 4 }); // 4GB RAM

      const mobileOptimizations = new MobileOptimizations();

      // Simulate thermal throttling
      mobileOptimizations.setThermalState("critical");

      const shouldReduceQuality =
        mobileOptimizations.shouldReduceQualityForThermal();
      expect(shouldReduceQuality).toBe(true);
    });

    it("should consider device age in quality recommendations", () => {
      simulateDevice(mobileDeviceConfigs.oldIPhone);

      const deviceClassifier = new DeviceClassifier();
      const deviceAge = deviceClassifier.estimateDeviceAge();

      expect(deviceAge).toBeGreaterThan(3); // Older than 3 years

      const { result } = renderHook(() => useMobileOptimizations());
      expect(result.current.recommendedQuality).toBe("low");
    });
  });

  describe("Network-Aware Optimizations", () => {
    it("should optimize for slow network connections", () => {
      simulateDevice(mobileDeviceConfigs.lowEndAndroid); // Has 3G connection

      const { result } = renderHook(() => useMobileOptimizations());

      expect(result.current.shouldUseProgressiveLoading).toBe(true);
      expect(result.current.shouldPreloadAssets).toBe(false);
      expect(result.current.recommendedImageQuality).toBe("compressed");
    });

    it("should enable preloading on fast connections", () => {
      simulateDevice(mobileDeviceConfigs.iPadPro); // Has fast 4G

      const { result } = renderHook(() => useMobileOptimizations());

      expect(result.current.shouldPreloadAssets).toBe(true);
      expect(result.current.recommendedImageQuality).toBe("high");
    });

    it("should handle offline scenarios", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      // Mock offline state
      Object.defineProperty(navigator, "onLine", { value: false });

      const { result } = renderHook(() => useMobileOptimizations());

      expect(result.current.isOnline).toBe(false);
      expect(result.current.shouldUseCachedAssets).toBe(true);
    });
  });

  describe("Accessibility on Mobile Devices", () => {
    it("should respect reduced motion on mobile", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      // Mock reduced motion preference
      Object.defineProperty(window, "matchMedia", {
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useMobileOptimizations());

      expect(result.current.shouldUseReducedMotion).toBe(true);
      expect(result.current.animationDuration).toBeLessThan(300);
    });

    it("should optimize for high contrast mode", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      // Mock high contrast preference
      Object.defineProperty(window, "matchMedia", {
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(prefers-contrast: high)",
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useMobileOptimizations());

      expect(result.current.shouldUseHighContrast).toBe(true);
    });

    it("should handle voice control scenarios", () => {
      simulateDevice(mobileDeviceConfigs.iPhone13);

      const mobileOptimizations = new MobileOptimizations();
      const isVoiceControlActive = mobileOptimizations.detectVoiceControl();

      // Should provide appropriate fallbacks for voice control
      expect(typeof isVoiceControlActive).toBe("boolean");
    });
  });

  describe("Cross-Platform Consistency", () => {
    it("should maintain consistent behavior across iOS and Android", () => {
      const iosResult = (() => {
        simulateDevice(mobileDeviceConfigs.iPhone13);
        const { result } = renderHook(() => useMobileOptimizations());
        return result.current;
      })();

      const androidResult = (() => {
        simulateDevice(mobileDeviceConfigs.samsungGalaxyS21);
        const { result } = renderHook(() => useMobileOptimizations());
        return result.current;
      })();

      // Both should have similar optimization patterns for similar-tier devices
      expect(iosResult.recommendedQuality).toBe(
        androidResult.recommendedQuality
      );
      expect(iosResult.shouldUseBatteryOptimizations).toBe(
        androidResult.shouldUseBatteryOptimizations
      );
    });

    it("should handle edge cases consistently", () => {
      const edgeCases = [
        { ...mobileDeviceConfigs.iPhone13, memory: undefined }, // Missing memory API
        { ...mobileDeviceConfigs.samsungGalaxyS21, connection: undefined }, // Missing connection API
        { ...mobileDeviceConfigs.lowEndAndroid, devicePixelRatio: 0 }, // Invalid DPR
      ];

      edgeCases.forEach((edgeCase, index) => {
        simulateDevice(edgeCase);

        const { result } = renderHook(() => useDeviceCapabilities());

        // Should not crash and provide reasonable defaults
        expect(result.current).toBeDefined();
        expect(typeof result.current.isMobile).toBe("boolean");
        expect(typeof result.current.gpuTier).toBe("string");
      });
    });
  });
});
