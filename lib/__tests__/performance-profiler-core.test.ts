import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  PerformanceProfiler,
  createPerformanceProfiler,
} from "../performance-profiler";

describe("PerformanceProfiler Core Functionality", () => {
  let profiler: PerformanceProfiler;
  let mockPerformanceNow: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock performance.now
    mockPerformanceNow = vi.fn();
    Object.defineProperty(performance, "now", {
      value: mockPerformanceNow,
      writable: true,
    });

    // Mock performance.memory
    Object.defineProperty(performance, "memory", {
      value: {
        totalJSHeapSize: 50000000,
        usedJSHeapSize: 30000000,
        jsHeapSizeLimit: 2147483648,
      },
      writable: true,
      configurable: true,
    });

    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      setTimeout(cb, 16);
      return 1;
    });

    global.cancelAnimationFrame = vi.fn();

    profiler = new PerformanceProfiler();
  });

  afterEach(() => {
    profiler.stop();
    vi.restoreAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with default thresholds", () => {
      const metrics = profiler.getMetrics();

      expect(metrics.currentFPS).toBe(0);
      expect(metrics.averageFPS).toBe(0);
      expect(metrics.frameDrops).toBe(0);
      expect(metrics.frameCount).toBe(0);
    });

    it("should accept custom thresholds", () => {
      const customProfiler = new PerformanceProfiler({
        minFPS: 45,
        maxFrameDrops: 10,
      });

      expect(customProfiler).toBeDefined();
    });
  });

  describe("Frame Measurement", () => {
    it("should start and stop monitoring", () => {
      expect(profiler.getMetrics().frameCount).toBe(0);

      profiler.start();
      expect(requestAnimationFrame).toHaveBeenCalled();

      profiler.stop();
      expect(cancelAnimationFrame).toHaveBeenCalled();
    });

    it("should calculate FPS correctly", async () => {
      let timeCounter = 0;
      mockPerformanceNow.mockImplementation(() => {
        timeCounter += 16.67; // ~60fps
        return timeCounter;
      });

      profiler.start();

      // Wait for a few frames
      await new Promise((resolve) => setTimeout(resolve, 100));

      const metrics = profiler.getMetrics();
      expect(metrics.currentFPS).toBeGreaterThan(50);
      expect(metrics.frameCount).toBeGreaterThan(0);
    });

    it("should detect frame drops", async () => {
      let timeCounter = 0;
      mockPerformanceNow.mockImplementation(() => {
        timeCounter += timeCounter < 100 ? 16.67 : 50; // Start normal, then drop frames
        return timeCounter;
      });

      profiler.start();

      // Wait for frame drops to be detected
      await new Promise((resolve) => setTimeout(resolve, 200));

      const metrics = profiler.getMetrics();
      expect(metrics.frameDrops).toBeGreaterThan(0);
    });
  });

  describe("Performance Monitoring", () => {
    it("should detect poor performance", () => {
      // Set up poor performance scenario
      let timeCounter = 0;
      mockPerformanceNow.mockImplementation(() => {
        timeCounter += 100; // Very slow frames
        return timeCounter;
      });

      profiler.start();

      // Simulate a few slow frames
      setTimeout(() => {
        expect(profiler.isPerformancePoor()).toBe(true);
      }, 100);
    });

    it("should call performance drop callback", async () => {
      let timeCounter = 0;
      let callbackCalled = false;

      mockPerformanceNow.mockImplementation(() => {
        timeCounter += 100; // Slow frames
        return timeCounter;
      });

      profiler.setCallbacks({
        onPerformanceDrop: (metrics) => {
          expect(metrics.currentFPS).toBeLessThan(30);
          callbackCalled = true;
        },
      });

      profiler.start();

      // Wait for callback to be called
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(callbackCalled).toBe(true);
    });
  });

  describe("Memory Monitoring", () => {
    it("should track memory usage when available", async () => {
      profiler.start();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const metrics = profiler.getMetrics();
      expect(metrics.memoryUsage).toBe(30000000);
    });

    it("should handle missing memory API gracefully", async () => {
      // Remove memory property
      delete (performance as any).memory;

      profiler.start();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const metrics = profiler.getMetrics();
      expect(metrics.memoryUsage).toBe(0);
    });
  });

  describe("Interaction Tracking", () => {
    it("should record interaction timestamps", () => {
      const beforeTime = Date.now();
      profiler.recordInteraction();
      const afterTime = Date.now();

      const metrics = profiler.getMetrics();
      expect(metrics.lastInteraction).toBeGreaterThanOrEqual(beforeTime);
      expect(metrics.lastInteraction).toBeLessThanOrEqual(afterTime);
    });
  });

  describe("Reset Functionality", () => {
    it("should reset all metrics", async () => {
      profiler.start();

      // Let it run for a bit
      await new Promise((resolve) => setTimeout(resolve, 50));

      let metrics = profiler.getMetrics();
      expect(metrics.frameCount).toBeGreaterThan(0);

      profiler.reset();

      metrics = profiler.getMetrics();
      expect(metrics.frameCount).toBe(0);
      expect(metrics.currentFPS).toBe(0);
      expect(metrics.averageFPS).toBe(0);
      expect(metrics.frameDrops).toBe(0);
    });
  });
});

describe("createPerformanceProfiler", () => {
  it("should create a profiler instance", () => {
    const profiler = createPerformanceProfiler();
    expect(profiler).toBeInstanceOf(PerformanceProfiler);
  });

  it("should create a profiler with custom thresholds", () => {
    const profiler = createPerformanceProfiler({ minFPS: 45 });
    expect(profiler).toBeInstanceOf(PerformanceProfiler);
  });
});
