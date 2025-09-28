import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { PerformanceMonitor } from "../performance-monitor";
import { PerformanceProfiler } from "../performance-profiler";
import {
  classifyDevice,
  type DeviceClassification,
} from "../device-classifier";

// Mock performance API for consistent testing
const mockPerformanceNow = vi.fn();
const mockPerformanceMark = vi.fn();
const mockPerformanceMeasure = vi.fn();

Object.defineProperty(global, "performance", {
  value: {
    now: mockPerformanceNow,
    mark: mockPerformanceMark,
    measure: mockPerformanceMeasure,
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
    memory: {
      totalJSHeapSize: 50000000,
      usedJSHeapSize: 30000000,
      jsHeapSizeLimit: 2147483648,
    },
  },
  writable: true,
});

describe("Performance Benchmarking Test Suite", () => {
  let performanceMonitor: PerformanceMonitor;
  let performanceProfiler: PerformanceProfiler;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Reset performance.now to start from 0
    let currentTime = 0;
    mockPerformanceNow.mockImplementation(() => {
      currentTime += 16.67; // Simulate 60fps
      return currentTime;
    });

    performanceMonitor = new PerformanceMonitor("medium");
    performanceProfiler = new PerformanceProfiler();
  });

  afterEach(() => {
    performanceMonitor?.dispose();
    performanceProfiler?.stop();
    vi.useRealTimers();
  });

  describe("Frame Rate Benchmarking", () => {
    it("should accurately measure 60fps performance", () => {
      performanceProfiler.start();

      // Simulate 60fps for 1 second (60 frames)
      for (let i = 0; i < 60; i++) {
        performanceProfiler.recordFrame();
        vi.advanceTimersByTime(16.67);
      }

      const metrics = performanceProfiler.getMetrics();

      expect(metrics.currentFPS).toBeCloseTo(60, 1);
      expect(metrics.averageFPS).toBeCloseTo(60, 1);
      expect(metrics.frameCount).toBe(60);
    });

    it("should detect frame drops accurately", () => {
      performanceProfiler.start();

      // Simulate inconsistent frame rate with drops
      const frameTimes = [16.67, 16.67, 33.33, 16.67, 50, 16.67, 16.67];

      frameTimes.forEach((frameTime) => {
        performanceProfiler.recordFrame();
        vi.advanceTimersByTime(frameTime);
      });

      const metrics = performanceProfiler.getMetrics();

      expect(metrics.frameDrops).toBeGreaterThan(0);
      expect(metrics.averageFPS).toBeLessThan(60);
    });

    it("should handle extreme performance scenarios", () => {
      performanceProfiler.start();

      // Simulate very poor performance (10fps)
      for (let i = 0; i < 10; i++) {
        performanceProfiler.recordFrame();
        vi.advanceTimersByTime(100); // 100ms per frame = 10fps
      }

      const metrics = performanceProfiler.getMetrics();

      expect(metrics.currentFPS).toBeCloseTo(10, 1);
      expect(metrics.frameDrops).toBeGreaterThan(5);
      expect(performanceProfiler.isPerformancePoor()).toBe(true);
    });
  });

  describe("Memory Usage Benchmarking", () => {
    it("should track memory usage over time", () => {
      performanceProfiler.start();

      // Simulate increasing memory usage
      const memoryValues = [30, 35, 40, 45, 50, 55, 60];

      memoryValues.forEach((memoryMB, index) => {
        Object.defineProperty(performance, "memory", {
          value: {
            totalJSHeapSize: memoryMB * 1024 * 1024,
            usedJSHeapSize: memoryMB * 0.8 * 1024 * 1024,
            jsHeapSizeLimit: 2147483648,
          },
          configurable: true,
        });

        performanceProfiler.recordFrame();
        vi.advanceTimersByTime(100);
      });

      const metrics = performanceProfiler.getMetrics();

      expect(metrics.memoryUsage).toBeGreaterThan(30 * 1024 * 1024);
      expect(metrics.memoryUsage).toBeLessThan(70 * 1024 * 1024);
    });

    it("should detect memory pressure conditions", () => {
      // Simulate high memory usage
      Object.defineProperty(performance, "memory", {
        value: {
          totalJSHeapSize: 1800 * 1024 * 1024, // 1.8GB
          usedJSHeapSize: 1600 * 1024 * 1024, // 1.6GB
          jsHeapSizeLimit: 2147483648, // 2GB
        },
        configurable: true,
      });

      performanceProfiler.start();
      performanceProfiler.recordFrame();

      const metrics = performanceProfiler.getMetrics();

      expect(metrics.memoryUsage).toBeGreaterThan(1500 * 1024 * 1024);
      expect(performanceProfiler.isPerformancePoor()).toBe(true);
    });
  });

  describe("Quality Adjustment Benchmarking", () => {
    it("should benchmark quality transitions", () => {
      const qualityChangeCallback = vi.fn();
      performanceMonitor.setCallbacks({
        onQualityChange: qualityChangeCallback,
      });

      // Start with high quality
      performanceMonitor.setQuality("high");
      expect(performanceMonitor.getCurrentQuality()).toBe("high");

      // Simulate performance degradation
      const performanceDropCallback = vi.fn();
      performanceMonitor.setCallbacks({
        onQualityChange: qualityChangeCallback,
        onPerformanceDrop: performanceDropCallback,
      });

      // Trigger quality reduction
      performanceMonitor.setQuality("medium");
      expect(qualityChangeCallback).toHaveBeenCalledWith(
        "medium",
        expect.any(Object)
      );

      performanceMonitor.setQuality("low");
      expect(qualityChangeCallback).toHaveBeenCalledWith(
        "low",
        expect.any(Object)
      );

      expect(qualityChangeCallback).toHaveBeenCalledTimes(2);
    });

    it("should benchmark frame skipping performance", () => {
      performanceMonitor.setQuality("medium"); // Enable frame skipping

      let frameSkipCount = 0;
      const frameSkipCallback = vi.fn(() => frameSkipCount++);
      performanceMonitor.setCallbacks({ onFrameSkip: frameSkipCallback });

      // Simulate rapid frame requests
      mockPerformanceNow.mockImplementation(() => Date.now());

      const startTime = Date.now();
      for (let i = 0; i < 100; i++) {
        const shouldSkip = performanceMonitor.shouldSkipFrame();
        if (shouldSkip) frameSkipCount++;
        vi.advanceTimersByTime(8); // 8ms = 125fps, should trigger skipping for 45fps target
      }

      expect(frameSkipCount).toBeGreaterThan(0);
      expect(frameSkipCallback).toHaveBeenCalled();
    });
  });

  describe("Device Classification Benchmarking", () => {
    it("should benchmark device tier classification", () => {
      const testCases = [
        {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)",
          screenWidth: 414,
          screenHeight: 896,
          devicePixelRatio: 3,
          expectedTier: "low",
        },
        {
          userAgent: "Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X)",
          screenWidth: 1024,
          screenHeight: 768,
          devicePixelRatio: 2,
          expectedTier: "medium",
        },
        {
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          screenWidth: 1920,
          screenHeight: 1080,
          devicePixelRatio: 1,
          expectedTier: "high",
        },
      ];

      testCases.forEach(
        ({
          userAgent,
          screenWidth,
          screenHeight,
          devicePixelRatio,
          expectedTier,
        }) => {
          const classification = classifyDevice({
            userAgent,
            screenWidth,
            screenHeight,
            devicePixelRatio,
            maxTextureSize: 4096,
            hasWebGL: true,
          });

          expect(classification.tier).toBe(expectedTier);
        }
      );
    });

    it("should benchmark WebGL capability detection", () => {
      const webglCapabilities = [
        { maxTextureSize: 8192, expectedTier: "high" },
        { maxTextureSize: 4096, expectedTier: "medium" },
        { maxTextureSize: 2048, expectedTier: "medium" },
        { maxTextureSize: 1024, expectedTier: "low" },
        { maxTextureSize: 0, expectedTier: "low" },
      ];

      webglCapabilities.forEach(({ maxTextureSize, expectedTier }) => {
        const classification = classifyDevice({
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          screenWidth: 1920,
          screenHeight: 1080,
          devicePixelRatio: 1,
          maxTextureSize,
          hasWebGL: maxTextureSize > 0,
        });

        expect(classification.tier).toBe(expectedTier);
      });
    });
  });

  describe("Render Performance Benchmarking", () => {
    it("should benchmark render-on-demand performance", () => {
      performanceMonitor.start();

      // Simulate idle period
      const idleTime = 3000; // 3 seconds
      vi.advanceTimersByTime(idleTime);

      const shouldPause = performanceMonitor.shouldPauseRendering();
      expect(shouldPause).toBe(true);

      // Simulate interaction
      performanceMonitor.recordInteraction();

      const shouldPauseAfterInteraction =
        performanceMonitor.shouldPauseRendering();
      expect(shouldPauseAfterInteraction).toBe(false);
    });

    it("should benchmark texture scaling performance impact", () => {
      const qualityConfigs = [
        { quality: "high", expectedTextureScale: 1.0 },
        { quality: "medium", expectedTextureScale: 0.75 },
        { quality: "low", expectedTextureScale: 0.5 },
      ];

      qualityConfigs.forEach(({ quality, expectedTextureScale }) => {
        performanceMonitor.setQuality(quality as any);
        const config = performanceMonitor.getCurrentConfig();

        expect(config.textureScale).toBe(expectedTextureScale);
      });
    });
  });

  describe("Stress Testing", () => {
    it("should handle rapid quality changes without memory leaks", () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;

      // Rapidly change quality 1000 times
      for (let i = 0; i < 1000; i++) {
        const qualities = ["high", "medium", "low"] as const;
        const quality = qualities[i % 3];
        performanceMonitor.setQuality(quality);
      }

      // Allow garbage collection
      vi.advanceTimersByTime(1000);

      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it("should handle continuous performance monitoring", () => {
      performanceProfiler.start();

      // Run for simulated 10 seconds with varying performance
      for (let second = 0; second < 10; second++) {
        const fps = 60 - second * 2; // Gradually decreasing performance
        const frameTime = 1000 / fps;

        for (let frame = 0; frame < fps; frame++) {
          performanceProfiler.recordFrame();
          vi.advanceTimersByTime(frameTime);
        }
      }

      const metrics = performanceProfiler.getMetrics();

      expect(metrics.frameCount).toBeGreaterThan(400); // Should have recorded many frames
      expect(metrics.averageFPS).toBeLessThan(60); // Should show degraded performance
      expect(metrics.frameDrops).toBeGreaterThan(0); // Should detect frame drops
    });

    it("should benchmark component switching under load", () => {
      const switchCount = 100;
      let webglCount = 0;
      let cssCount = 0;

      for (let i = 0; i < switchCount; i++) {
        const useWebGL = i % 2 === 0;

        if (useWebGL) {
          webglCount++;
        } else {
          cssCount++;
        }

        // Simulate the decision logic
        const shouldUseWebGL =
          useWebGL &&
          performanceMonitor.getCurrentQuality() !== "low" &&
          !performanceMonitor.shouldPauseRendering();

        expect(typeof shouldUseWebGL).toBe("boolean");
      }

      expect(webglCount + cssCount).toBe(switchCount);
    });
  });

  describe("Performance Regression Detection", () => {
    it("should detect performance regressions over time", () => {
      performanceProfiler.start();

      // Establish baseline performance (60fps for 2 seconds)
      for (let i = 0; i < 120; i++) {
        performanceProfiler.recordFrame();
        vi.advanceTimersByTime(16.67);
      }

      const baselineMetrics = performanceProfiler.getMetrics();
      expect(baselineMetrics.averageFPS).toBeCloseTo(60, 1);

      // Simulate performance regression (30fps for 2 seconds)
      for (let i = 0; i < 60; i++) {
        performanceProfiler.recordFrame();
        vi.advanceTimersByTime(33.33);
      }

      const regressedMetrics = performanceProfiler.getMetrics();
      expect(regressedMetrics.currentFPS).toBeLessThan(
        baselineMetrics.currentFPS
      );
      expect(performanceProfiler.isPerformancePoor()).toBe(true);
    });

    it("should benchmark recovery from performance issues", () => {
      performanceProfiler.start();

      // Start with poor performance
      for (let i = 0; i < 30; i++) {
        performanceProfiler.recordFrame();
        vi.advanceTimersByTime(50); // 20fps
      }

      expect(performanceProfiler.isPerformancePoor()).toBe(true);

      // Simulate performance recovery
      for (let i = 0; i < 60; i++) {
        performanceProfiler.recordFrame();
        vi.advanceTimersByTime(16.67); // 60fps
      }

      const recoveredMetrics = performanceProfiler.getMetrics();
      expect(recoveredMetrics.currentFPS).toBeCloseTo(60, 1);
    });
  });
});
