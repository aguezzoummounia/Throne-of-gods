import { describe, it, expect, beforeEach, afterEach, vi, Mock } from "vitest";
import {
  PerformanceMonitor,
  createPerformanceMonitor,
  QualityLevel,
  DeviceTier,
} from "../performance-monitor";
import { PerformanceProfiler } from "../performance-profiler";

// Mock the PerformanceProfiler
vi.mock("../performance-profiler", () => ({
  PerformanceProfiler: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    getMetrics: vi.fn(() => ({
      currentFPS: 60,
      averageFPS: 58,
      frameDrops: 0,
      memoryUsage: 50 * 1024 * 1024,
      lastInteraction: Date.now(),
      renderTime: 16,
      frameCount: 100,
    })),
    recordInteraction: vi.fn(),
    setCallbacks: vi.fn(),
    isPerformancePoor: vi.fn(() => false),
    reset: vi.fn(),
  })),
}));

describe("PerformanceMonitor", () => {
  let monitor: PerformanceMonitor;
  let mockProfiler: any;

  beforeEach(() => {
    vi.clearAllMocks();
    monitor = new PerformanceMonitor("medium");
    mockProfiler = (monitor as any).profiler;
  });

  afterEach(() => {
    monitor.dispose();
  });

  describe("initialization", () => {
    it("should initialize with correct device tier and quality", () => {
      const highTierMonitor = new PerformanceMonitor("high");
      expect(highTierMonitor.getCurrentQuality()).toBe("high");

      const lowTierMonitor = new PerformanceMonitor("low");
      expect(lowTierMonitor.getCurrentQuality()).toBe("low");

      highTierMonitor.dispose();
      lowTierMonitor.dispose();
    });

    it("should create quality presets correctly", () => {
      const config = monitor.getCurrentConfig();
      expect(config).toHaveProperty("textureScale");
      expect(config).toHaveProperty("targetFPS");
      expect(config).toHaveProperty("shaderComplexity");
      expect(config).toHaveProperty("enableFrameSkipping");
      expect(config).toHaveProperty("renderOnDemand");
      expect(config).toHaveProperty("maxIdleTime");
    });

    it("should accept custom presets", () => {
      const customPresets = {
        high: { textureScale: 1.5, targetFPS: 120 },
      };
      const customMonitor = new PerformanceMonitor("high", customPresets);
      const config = customMonitor.getCurrentConfig();

      expect(config.textureScale).toBe(1.5);
      expect(config.targetFPS).toBe(120);

      customMonitor.dispose();
    });
  });

  describe("quality management", () => {
    it("should set quality level correctly", () => {
      const onQualityChange = vi.fn();
      monitor.setCallbacks({ onQualityChange });

      monitor.setQuality("low");
      expect(monitor.getCurrentQuality()).toBe("low");
      expect(onQualityChange).toHaveBeenCalledWith("low", expect.any(Object));
    });

    it("should not trigger callback when setting same quality", () => {
      const onQualityChange = vi.fn();
      monitor.setCallbacks({ onQualityChange });

      const currentQuality = monitor.getCurrentQuality();
      monitor.setQuality(currentQuality);
      expect(onQualityChange).not.toHaveBeenCalled();
    });

    it("should update config when quality changes", () => {
      const initialConfig = monitor.getCurrentConfig();
      monitor.setQuality("low");
      const newConfig = monitor.getCurrentConfig();

      expect(newConfig.textureScale).toBeLessThan(initialConfig.textureScale);
      expect(newConfig.targetFPS).toBeLessThanOrEqual(initialConfig.targetFPS);
    });
  });

  describe("performance monitoring", () => {
    it("should start and stop profiler correctly", () => {
      monitor.start();
      expect(mockProfiler.start).toHaveBeenCalled();

      monitor.stop();
      expect(mockProfiler.stop).toHaveBeenCalled();
    });

    it("should record interactions", () => {
      monitor.recordInteraction();
      expect(mockProfiler.recordInteraction).toHaveBeenCalled();
    });

    it("should get metrics from profiler", () => {
      const metrics = monitor.getMetrics();
      expect(mockProfiler.getMetrics).toHaveBeenCalled();
      expect(metrics).toHaveProperty("currentFPS");
      expect(metrics).toHaveProperty("averageFPS");
    });

    it("should check performance status", () => {
      const isPerformancePoor = monitor.isPerformancePoor();
      expect(mockProfiler.isPerformancePoor).toHaveBeenCalled();
      expect(typeof isPerformancePoor).toBe("boolean");
    });
  });

  describe("frame rate limiting", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should skip frames when frame rate limiting is enabled", () => {
      monitor.setQuality("medium"); // Enable frame skipping

      // Mock performance.now to simulate rapid calls
      const mockNow = vi.spyOn(performance, "now");
      mockNow.mockReturnValueOnce(100); // First call
      mockNow.mockReturnValueOnce(110); // 10ms later, should skip for 45fps (22.22ms target)

      const shouldSkip1 = monitor.shouldSkipFrame();
      const shouldSkip2 = monitor.shouldSkipFrame();

      expect(shouldSkip1).toBe(false); // First frame should not skip (sets lastFrameTime)
      expect(shouldSkip2).toBe(true); // Second frame should skip (10ms < 22.22ms)
    });

    it("should not skip frames when frame skipping is disabled", () => {
      monitor.setQuality("high"); // Disable frame skipping

      const shouldSkip1 = monitor.shouldSkipFrame();
      const shouldSkip2 = monitor.shouldSkipFrame();

      expect(shouldSkip1).toBe(false);
      expect(shouldSkip2).toBe(false);
    });

    it("should call frame skip callback", () => {
      const onFrameSkip = vi.fn();
      monitor.setCallbacks({ onFrameSkip });
      monitor.setQuality("medium"); // Enable frame skipping

      const mockNow = vi.spyOn(performance, "now");
      mockNow.mockReturnValueOnce(0);
      mockNow.mockReturnValueOnce(10);

      monitor.shouldSkipFrame(); // First call
      monitor.shouldSkipFrame(); // Second call should trigger callback

      expect(onFrameSkip).toHaveBeenCalledWith(1);
    });
  });

  describe("render on demand", () => {
    it("should pause rendering when idle", () => {
      const onRenderPause = vi.fn();
      monitor.setCallbacks({ onRenderPause });

      // Mock metrics to simulate idle state
      mockProfiler.getMetrics.mockReturnValue({
        currentFPS: 60,
        averageFPS: 58,
        frameDrops: 0,
        memoryUsage: 50 * 1024 * 1024,
        lastInteraction: Date.now() - 5000, // 5 seconds ago
        renderTime: 16,
        frameCount: 100,
      });

      const shouldPause = monitor.shouldPauseRendering();
      expect(shouldPause).toBe(true);
    });

    it("should not pause when render on demand is disabled", () => {
      const customPresets = {
        medium: { renderOnDemand: false },
      };
      const customMonitor = new PerformanceMonitor("medium", customPresets);

      const shouldPause = customMonitor.shouldPauseRendering();
      expect(shouldPause).toBe(false);

      customMonitor.dispose();
    });

    it("should resume rendering on interaction", () => {
      const onRenderResume = vi.fn();
      monitor.setCallbacks({ onRenderResume });

      // Simulate paused state
      (monitor as any).isRenderPaused = true;

      monitor.recordInteraction();
      expect(onRenderResume).toHaveBeenCalled();
    });
  });

  describe("automatic quality adjustment", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should reduce quality on performance drop", () => {
      const onQualityChange = vi.fn();
      monitor.setCallbacks({ onQualityChange });
      monitor.setQuality("high");

      // Simulate performance drop
      const performanceDropCallback =
        mockProfiler.setCallbacks.mock.calls[0][0].onPerformanceDrop;
      performanceDropCallback({
        currentFPS: 30, // Below threshold
        averageFPS: 32,
        frameDrops: 10,
        memoryUsage: 50 * 1024 * 1024,
        lastInteraction: Date.now(),
        renderTime: 25,
        frameCount: 100,
      });

      expect(onQualityChange).toHaveBeenCalledWith(
        "medium",
        expect.any(Object)
      );
    });

    it("should respect cooldown period for quality changes", () => {
      const onQualityChange = vi.fn();
      monitor.setQuality("high");
      monitor.setCallbacks({ onQualityChange }); // Set callback after initial quality change

      const performanceDropCallback =
        mockProfiler.setCallbacks.mock.calls[0][0].onPerformanceDrop;

      // First performance drop
      performanceDropCallback({
        currentFPS: 30,
        averageFPS: 32,
        frameDrops: 10,
        memoryUsage: 50 * 1024 * 1024,
        lastInteraction: Date.now(),
        renderTime: 25,
        frameCount: 100,
      });

      expect(onQualityChange).toHaveBeenCalledTimes(1);

      // Second performance drop immediately after (should be ignored)
      performanceDropCallback({
        currentFPS: 20,
        averageFPS: 22,
        frameDrops: 15,
        memoryUsage: 50 * 1024 * 1024,
        lastInteraction: Date.now(),
        renderTime: 35,
        frameCount: 100,
      });

      expect(onQualityChange).toHaveBeenCalledTimes(1); // Still only called once
    });

    it("should increase quality when performance improves", () => {
      monitor.setQuality("low");
      monitor.start();

      const onQualityChange = vi.fn();
      monitor.setCallbacks({ onQualityChange });

      // Mock good performance metrics
      mockProfiler.getMetrics.mockReturnValue({
        currentFPS: 55,
        averageFPS: 52,
        frameDrops: 1,
        memoryUsage: 40 * 1024 * 1024,
        lastInteraction: Date.now(),
        renderTime: 16,
        frameCount: 100,
      });

      // Advance time to trigger periodic check
      vi.advanceTimersByTime(3000); // 3 seconds (beyond cooldown)

      expect(onQualityChange).toHaveBeenCalledWith(
        "medium",
        expect.any(Object)
      );
    });
  });

  describe("device tier configurations", () => {
    it("should use appropriate thresholds for high-tier devices", () => {
      const highTierMonitor = new PerformanceMonitor("high");
      const config = highTierMonitor.getCurrentConfig();

      expect(config.textureScale).toBe(1.0);
      expect(config.targetFPS).toBe(60);
      expect(config.shaderComplexity).toBe("full");

      highTierMonitor.dispose();
    });

    it("should use appropriate thresholds for low-tier devices", () => {
      const lowTierMonitor = new PerformanceMonitor("low");
      const config = lowTierMonitor.getCurrentConfig();

      expect(config.textureScale).toBe(0.5);
      expect(config.targetFPS).toBe(30);
      expect(config.shaderComplexity).toBe("minimal");

      lowTierMonitor.dispose();
    });
  });

  describe("reset and cleanup", () => {
    it("should reset monitor state", () => {
      monitor.setQuality("low");
      monitor.reset();

      expect(mockProfiler.reset).toHaveBeenCalled();
      expect((monitor as any).frameSkipCounter).toBe(0);
      expect((monitor as any).isRenderPaused).toBe(false);
    });

    it("should dispose resources properly", () => {
      monitor.start();
      monitor.dispose();

      expect(mockProfiler.stop).toHaveBeenCalled();
      expect((monitor as any).callbacks).toEqual({});
    });
  });

  describe("createPerformanceMonitor factory", () => {
    it("should create monitor with default settings", () => {
      const factoryMonitor = createPerformanceMonitor();
      expect(factoryMonitor).toBeInstanceOf(PerformanceMonitor);
      expect(factoryMonitor.getCurrentQuality()).toBe("medium");

      factoryMonitor.dispose();
    });

    it("should create monitor with custom settings", () => {
      const customPresets = {
        high: { textureScale: 2.0 },
      };
      const factoryMonitor = createPerformanceMonitor("high", customPresets);

      expect(factoryMonitor.getCurrentQuality()).toBe("high");

      factoryMonitor.dispose();
    });
  });
});
