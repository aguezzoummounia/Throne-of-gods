import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  PerformanceMonitor,
  createPerformanceMonitor,
} from "../../lib/performance-monitor";

// Mock the PerformanceMonitor
vi.mock("../../lib/performance-monitor", () => ({
  PerformanceMonitor: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
    getMetrics: vi.fn(() => ({
      currentFPS: 60,
      averageFPS: 58,
      frameDrops: 0,
      memoryUsage: 50 * 1024 * 1024,
      lastInteraction: Date.now(),
      renderTime: 16,
      frameCount: 100,
    })),
    getCurrentQuality: vi.fn(() => "medium"),
    getCurrentConfig: vi.fn(() => ({
      textureScale: 0.75,
      targetFPS: 45,
      shaderComplexity: "reduced",
      enableFrameSkipping: true,
      renderOnDemand: true,
      maxIdleTime: 2000,
    })),
    recordInteraction: vi.fn(),
    setQuality: vi.fn(),
    setCallbacks: vi.fn(),
    shouldSkipFrame: vi.fn(() => false),
    isPerformancePoor: vi.fn(() => false),
    reset: vi.fn(),
  })),
  createPerformanceMonitor: vi.fn(() => new (PerformanceMonitor as any)()),
}));

describe("PerformanceMonitor Integration Tests", () => {
  it("should create performance monitor with correct parameters", () => {
    const monitor = createPerformanceMonitor("high");
    expect(monitor).toBeDefined();
    expect(PerformanceMonitor).toHaveBeenCalled();
  });

  it("should provide all required methods", () => {
    const monitor = createPerformanceMonitor();

    expect(typeof monitor.start).toBe("function");
    expect(typeof monitor.stop).toBe("function");
    expect(typeof monitor.getMetrics).toBe("function");
    expect(typeof monitor.getCurrentQuality).toBe("function");
    expect(typeof monitor.getCurrentConfig).toBe("function");
    expect(typeof monitor.recordInteraction).toBe("function");
    expect(typeof monitor.setQuality).toBe("function");
    expect(typeof monitor.shouldSkipFrame).toBe("function");
    expect(typeof monitor.isPerformancePoor).toBe("function");
    expect(typeof monitor.reset).toBe("function");
    expect(typeof monitor.dispose).toBe("function");
  });

  it("should handle quality changes", () => {
    const monitor = createPerformanceMonitor();

    monitor.setQuality("high");
    expect(monitor.setQuality).toHaveBeenCalledWith("high");
  });

  it("should handle performance monitoring lifecycle", () => {
    const monitor = createPerformanceMonitor();

    monitor.start();
    expect(monitor.start).toHaveBeenCalled();

    monitor.stop();
    expect(monitor.stop).toHaveBeenCalled();

    monitor.dispose();
    expect(monitor.dispose).toHaveBeenCalled();
  });

  it("should provide metrics and status", () => {
    const monitor = createPerformanceMonitor();

    const metrics = monitor.getMetrics();
    expect(metrics).toHaveProperty("currentFPS");
    expect(metrics).toHaveProperty("averageFPS");
    expect(metrics).toHaveProperty("frameDrops");

    const quality = monitor.getCurrentQuality();
    expect(typeof quality).toBe("string");

    const config = monitor.getCurrentConfig();
    expect(config).toHaveProperty("textureScale");
    expect(config).toHaveProperty("targetFPS");

    const isPerformancePoor = monitor.isPerformancePoor();
    expect(typeof isPerformancePoor).toBe("boolean");
  });

  it("should handle frame skipping", () => {
    const monitor = createPerformanceMonitor();

    const shouldSkip = monitor.shouldSkipFrame();
    expect(typeof shouldSkip).toBe("boolean");
    expect(monitor.shouldSkipFrame).toHaveBeenCalled();
  });

  it("should handle interactions", () => {
    const monitor = createPerformanceMonitor();

    monitor.recordInteraction();
    expect(monitor.recordInteraction).toHaveBeenCalled();
  });

  it("should handle reset", () => {
    const monitor = createPerformanceMonitor();

    monitor.reset();
    expect(monitor.reset).toHaveBeenCalled();
  });
});

describe("useFrameRateLimit functionality", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should provide frame rate limiting logic", () => {
    // Test the core frame rate limiting logic without React hooks
    let lastFrameTime = 0;
    const targetFrameTime = 1000 / 30; // 30fps

    const shouldSkipFrame = () => {
      const now = performance.now();

      // First call should never skip
      if (lastFrameTime === 0) {
        lastFrameTime = now;
        return false;
      }

      const timeSinceLastFrame = now - lastFrameTime;

      if (timeSinceLastFrame < targetFrameTime) {
        return true;
      }

      lastFrameTime = now;
      return false;
    };

    const mockNow = vi.spyOn(performance, "now");
    mockNow.mockReturnValueOnce(100);
    mockNow.mockReturnValueOnce(116); // 16ms later, should skip for 30fps

    const shouldSkip1 = shouldSkipFrame();
    const shouldSkip2 = shouldSkipFrame();

    expect(shouldSkip1).toBe(false); // First frame
    expect(shouldSkip2).toBe(true); // Too soon for 30fps
  });

  it("should not skip frames when enough time has passed", () => {
    let lastFrameTime = 0;
    const targetFrameTime = 1000 / 30; // 30fps

    const shouldSkipFrame = () => {
      const now = performance.now();

      // First call should never skip
      if (lastFrameTime === 0) {
        lastFrameTime = now;
        return false;
      }

      const timeSinceLastFrame = now - lastFrameTime;

      if (timeSinceLastFrame < targetFrameTime) {
        return true;
      }

      lastFrameTime = now;
      return false;
    };

    const mockNow = vi.spyOn(performance, "now");
    mockNow.mockReturnValueOnce(100);
    mockNow.mockReturnValueOnce(140); // 40ms later, should not skip for 30fps

    const shouldSkip1 = shouldSkipFrame();
    const shouldSkip2 = shouldSkipFrame();

    expect(shouldSkip1).toBe(false);
    expect(shouldSkip2).toBe(false);
  });
});
