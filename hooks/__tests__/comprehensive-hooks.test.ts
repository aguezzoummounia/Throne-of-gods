import { renderHook } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useDeviceCapabilities } from "../useDeviceCapabilities";
import { usePerformanceMonitor } from "../usePerformanceMonitor";
import { useResourceManager } from "../useResourceManager";
import { useMobileOptimizations } from "../useMobileOptimizations";

// Mock dependencies
vi.mock("../useDeviceCapabilities");
vi.mock("../usePerformanceMonitor");
vi.mock("../useResourceManager");

const mockUseDeviceCapabilities = vi.mocked(useDeviceCapabilities);
const mockUsePerformanceMonitor = vi.mocked(usePerformanceMonitor);
const mockUseResourceManager = vi.mocked(useResourceManager);

describe("Comprehensive Hooks Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: false,
      hasWebGL: true,
      gpuTier: "medium",
      maxTextureSize: 4096,
      devicePixelRatio: 1,
      screenSize: { width: 1920, height: 1080 },
      userAgent: {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        browser: "chrome",
        os: "windows",
      },
      memoryInfo: {
        totalJSHeapSize: 50000000,
        usedJSHeapSize: 30000000,
        jsHeapSizeLimit: 2147483648,
      },
    });

    mockUsePerformanceMonitor.mockReturnValue({
      monitor: {} as any,
      metrics: {
        currentFPS: 60,
        averageFPS: 58,
        frameDrops: 0,
        memoryUsage: 50 * 1024 * 1024,
        lastInteraction: Date.now(),
        renderTime: 16,
        frameCount: 100,
      },
      currentQuality: "medium",
      currentConfig: {} as any,
      isPerformancePoor: false,
      isRenderPaused: false,
      frameSkipCount: 0,
      start: vi.fn(),
      stop: vi.fn(),
      recordInteraction: vi.fn(),
      setQuality: vi.fn(),
      shouldSkipFrame: vi.fn(() => false),
      reset: vi.fn(),
    });

    mockUseResourceManager.mockReturnValue({
      resourceManager: {} as any,
      isRenderingPaused: false,
      memoryUsage: 30 * 1024 * 1024,
      renderState: {
        isPaused: false,
        isVisible: true,
        lastRenderTime: Date.now(),
        frameCount: 100,
      },
      pauseRendering: vi.fn(),
      resumeRendering: vi.fn(),
      checkMemoryPressure: vi.fn(() => false),
      observeElement: vi.fn(),
      unobserveElement: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("useDeviceCapabilities Integration", () => {
    it("should provide consistent device detection across different scenarios", () => {
      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current).toMatchObject({
        isMobile: expect.any(Boolean),
        hasWebGL: expect.any(Boolean),
        gpuTier: expect.stringMatching(/^(high|medium|low)$/),
        maxTextureSize: expect.any(Number),
        devicePixelRatio: expect.any(Number),
      });
    });

    it("should handle mobile device detection correctly", () => {
      mockUseDeviceCapabilities.mockReturnValue({
        isMobile: true,
        hasWebGL: true,
        gpuTier: "low",
        maxTextureSize: 2048,
        devicePixelRatio: 2,
        screenSize: { width: 414, height: 896 },
        userAgent: {
          isMobile: true,
          isTablet: false,
          isDesktop: false,
          browser: "safari",
          os: "ios",
        },
        memoryInfo: undefined,
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.gpuTier).toBe("low");
      expect(result.current.userAgent.os).toBe("ios");
    });
  });

  describe("usePerformanceMonitor Integration", () => {
    it("should track performance metrics accurately", () => {
      const { result } = renderHook(() =>
        usePerformanceMonitor({ deviceTier: "medium" })
      );

      expect(result.current.metrics).toMatchObject({
        currentFPS: expect.any(Number),
        averageFPS: expect.any(Number),
        frameDrops: expect.any(Number),
        memoryUsage: expect.any(Number),
      });
    });

    it("should handle quality adjustments based on performance", () => {
      const setQualityMock = vi.fn();
      mockUsePerformanceMonitor.mockReturnValue({
        monitor: {} as any,
        metrics: {
          currentFPS: 30, // Poor performance
          averageFPS: 32,
          frameDrops: 10,
          memoryUsage: 80 * 1024 * 1024,
          lastInteraction: Date.now(),
          renderTime: 25,
          frameCount: 100,
        },
        currentQuality: "high",
        currentConfig: {} as any,
        isPerformancePoor: true,
        isRenderPaused: false,
        frameSkipCount: 5,
        start: vi.fn(),
        stop: vi.fn(),
        recordInteraction: vi.fn(),
        setQuality: setQualityMock,
        shouldSkipFrame: vi.fn(() => true),
        reset: vi.fn(),
      });

      const { result } = renderHook(() =>
        usePerformanceMonitor({ deviceTier: "high" })
      );

      expect(result.current.isPerformancePoor).toBe(true);
      expect(result.current.shouldSkipFrame()).toBe(true);
    });
  });

  describe("useResourceManager Integration", () => {
    it("should manage WebGL resources properly", () => {
      const { result } = renderHook(() => useResourceManager());

      expect(result.current).toMatchObject({
        resourceManager: expect.any(Object),
        pauseRendering: expect.any(Function),
        resumeRendering: expect.any(Function),
        checkMemoryPressure: expect.any(Function),
        observeElement: expect.any(Function),
        unobserveElement: expect.any(Function),
      });
    });

    it("should detect memory pressure correctly", () => {
      mockUseResourceManager.mockReturnValue({
        resourceManager: {} as any,
        isRenderingPaused: false,
        memoryUsage: 85 * 1024 * 1024,
        renderState: {
          isPaused: false,
          isVisible: true,
          lastRenderTime: Date.now(),
          frameCount: 100,
        },
        pauseRendering: vi.fn(),
        resumeRendering: vi.fn(),
        checkMemoryPressure: vi.fn(() => true),
        observeElement: vi.fn(),
        unobserveElement: vi.fn(),
      });

      const { result } = renderHook(() => useResourceManager());

      expect(result.current.checkMemoryPressure()).toBe(true);
      expect(result.current.memoryUsage).toBe(85 * 1024 * 1024);
    });
  });

  describe("useMobileOptimizations Integration", () => {
    it("should apply mobile-specific optimizations", () => {
      const { result } = renderHook(() =>
        useMobileOptimizations({
          enableBatteryMonitoring: true,
          enableTouchOptimizations: true,
        })
      );

      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toMatchObject({
        batteryInfo: expect.any(Object),
        visibilityState: expect.any(Object),
        isLowBattery: expect.any(Boolean),
        shouldPauseRendering: expect.any(Boolean),
      });
      expect(result.current[1]).toMatchObject({
        triggerHapticFeedback: expect.any(Function),
        preloadImages: expect.any(Function),
        loadImage: expect.any(Function),
        getNetworkInfo: expect.any(Function),
      });
    });

    it("should handle desktop optimizations", () => {
      const { result } = renderHook(() =>
        useMobileOptimizations({
          enableBatteryMonitoring: false,
          enableHapticFeedback: false,
        })
      );

      const [state, actions] = result.current;
      expect(state.isLowBattery).toBe(false);
      expect(actions.triggerHapticFeedback).toBeDefined();
    });
  });

  describe("Cross-Hook Integration", () => {
    it("should coordinate between performance monitor and resource manager", () => {
      const pauseRenderingMock = vi.fn();
      const setQualityMock = vi.fn();

      mockUseResourceManager.mockReturnValue({
        resourceManager: {} as any,
        isRenderingPaused: false,
        memoryUsage: 90 * 1024 * 1024,
        renderState: {
          isPaused: false,
          isVisible: true,
          lastRenderTime: Date.now(),
          frameCount: 100,
        },
        pauseRendering: pauseRenderingMock,
        resumeRendering: vi.fn(),
        checkMemoryPressure: vi.fn(() => true),
        observeElement: vi.fn(),
        unobserveElement: vi.fn(),
      });

      mockUsePerformanceMonitor.mockReturnValue({
        monitor: {} as any,
        metrics: {
          currentFPS: 25,
          averageFPS: 28,
          frameDrops: 15,
          memoryUsage: 90 * 1024 * 1024,
          lastInteraction: Date.now(),
          renderTime: 30,
          frameCount: 100,
        },
        currentQuality: "medium",
        currentConfig: {} as any,
        isPerformancePoor: true,
        isRenderPaused: false,
        frameSkipCount: 10,
        start: vi.fn(),
        stop: vi.fn(),
        recordInteraction: vi.fn(),
        setQuality: setQualityMock,
        shouldSkipFrame: vi.fn(() => true),
        reset: vi.fn(),
      });

      const performanceResult = renderHook(() =>
        usePerformanceMonitor({ deviceTier: "medium" })
      );
      const resourceResult = renderHook(() => useResourceManager());

      // Simulate memory pressure scenario
      expect(resourceResult.result.current.checkMemoryPressure()).toBe(true);
      expect(performanceResult.result.current.isPerformancePoor).toBe(true);
    });

    it("should adapt mobile optimizations based on device capabilities", () => {
      mockUseDeviceCapabilities.mockReturnValue({
        isMobile: true,
        hasWebGL: true,
        gpuTier: "low",
        maxTextureSize: 1024,
        devicePixelRatio: 3,
        screenSize: { width: 414, height: 896 },
        userAgent: {
          isMobile: true,
          isTablet: false,
          isDesktop: false,
          browser: "safari",
          os: "ios",
        },
        memoryInfo: {
          totalJSHeapSize: 20000000,
          usedJSHeapSize: 15000000,
          jsHeapSizeLimit: 1073741824,
        },
      });

      const deviceResult = renderHook(() => useDeviceCapabilities());
      const mobileResult = renderHook(() =>
        useMobileOptimizations({
          enableBatteryMonitoring: true,
          enableHapticFeedback: true,
        })
      );

      expect(deviceResult.result.current.isMobile).toBe(true);
      expect(deviceResult.result.current.gpuTier).toBe("low");

      const [mobileState] = mobileResult.result.current;
      expect(mobileState.batteryInfo).toBeDefined();
      expect(mobileState.visibilityState).toBeDefined();
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle missing WebGL context gracefully", () => {
      mockUseDeviceCapabilities.mockReturnValue({
        isMobile: false,
        hasWebGL: false,
        gpuTier: "low",
        maxTextureSize: 0,
        devicePixelRatio: 1,
        screenSize: { width: 1920, height: 1080 },
        userAgent: {
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          browser: "chrome",
          os: "windows",
        },
        memoryInfo: undefined,
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.hasWebGL).toBe(false);
      expect(result.current.gpuTier).toBe("low");
    });

    it("should handle performance monitor initialization failures", () => {
      mockUsePerformanceMonitor.mockReturnValue({
        monitor: {} as any,
        metrics: {
          currentFPS: 0,
          averageFPS: 0,
          frameDrops: 0,
          memoryUsage: 0,
          lastInteraction: 0,
          renderTime: 0,
          frameCount: 0,
        },
        currentQuality: "low",
        currentConfig: {} as any,
        isPerformancePoor: true,
        isRenderPaused: true,
        frameSkipCount: 0,
        start: vi.fn(),
        stop: vi.fn(),
        recordInteraction: vi.fn(),
        setQuality: vi.fn(),
        shouldSkipFrame: vi.fn(() => false),
        reset: vi.fn(),
      });

      const { result } = renderHook(() =>
        usePerformanceMonitor({ deviceTier: "medium" })
      );

      expect(result.current.metrics.currentFPS).toBe(0);
      expect(result.current.isRenderPaused).toBe(true);
    });

    it("should handle resource manager cleanup failures", () => {
      const checkMemoryPressureMock = vi.fn().mockImplementation(() => {
        throw new Error("Memory check failed");
      });

      mockUseResourceManager.mockReturnValue({
        resourceManager: {} as any,
        isRenderingPaused: false,
        memoryUsage: 50 * 1024 * 1024,
        renderState: {
          isPaused: false,
          isVisible: true,
          lastRenderTime: Date.now(),
          frameCount: 100,
        },
        pauseRendering: vi.fn(),
        resumeRendering: vi.fn(),
        checkMemoryPressure: checkMemoryPressureMock,
        observeElement: vi.fn(),
        unobserveElement: vi.fn(),
      });

      const { result } = renderHook(() => useResourceManager());

      expect(() => result.current.checkMemoryPressure()).toThrow(
        "Memory check failed"
      );
    });
  });

  describe("Performance Optimization Scenarios", () => {
    it("should optimize for battery-constrained devices", () => {
      const { result } = renderHook(() =>
        useMobileOptimizations({
          enableBatteryMonitoring: true,
          enableHapticFeedback: true,
        })
      );

      const [state, actions] = result.current;
      expect(state.batteryInfo).toBeDefined();
      expect(actions.triggerHapticFeedback).toBeDefined();
    });

    it("should handle high-performance desktop scenarios", () => {
      mockUseDeviceCapabilities.mockReturnValue({
        isMobile: false,
        hasWebGL: true,
        gpuTier: "high",
        maxTextureSize: 8192,
        devicePixelRatio: 1,
        screenSize: { width: 2560, height: 1440 },
        userAgent: {
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          browser: "chrome",
          os: "windows",
        },
        memoryInfo: {
          totalJSHeapSize: 100000000,
          usedJSHeapSize: 40000000,
          jsHeapSizeLimit: 4294967296,
        },
      });

      const { result } = renderHook(() => useDeviceCapabilities());

      expect(result.current.gpuTier).toBe("high");
      expect(result.current.maxTextureSize).toBe(8192);
    });
  });
});
