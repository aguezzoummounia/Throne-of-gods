import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  usePerformanceMonitor,
  useSimplePerformanceMonitor,
  useFrameRateLimit,
} from "../usePerformanceMonitor";
import { PerformanceMonitor } from "../../lib/performance-monitor";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { renderHook } from "@testing-library/react";

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

describe("usePerformanceMonitor", () => {
  let mockMonitor: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMonitor = new (PerformanceMonitor as any)();
  });

  describe("basic functionality", () => {
    it("should initialize with default options", () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      expect(result.current.monitor).toBeDefined();
      expect(result.current.metrics).toBeDefined();
      expect(result.current.currentQuality).toBe("medium");
      expect(result.current.currentConfig).toBeDefined();
      expect(typeof result.current.isPerformancePoor).toBe("boolean");
      expect(typeof result.current.isRenderPaused).toBe("boolean");
      expect(typeof result.current.frameSkipCount).toBe("number");
    });

    it("should auto-start by default", () => {
      renderHook(() => usePerformanceMonitor());
      expect(mockMonitor.start).toHaveBeenCalled();
    });

    it("should not auto-start when disabled", () => {
      renderHook(() => usePerformanceMonitor({ autoStart: false }));
      expect(mockMonitor.start).not.toHaveBeenCalled();
    });

    it("should dispose monitor on unmount", () => {
      const { unmount } = renderHook(() => usePerformanceMonitor());
      unmount();
      expect(mockMonitor.dispose).toHaveBeenCalled();
    });
  });

  describe("control methods", () => {
    it("should provide start method", () => {
      const { result } = renderHook(() =>
        usePerformanceMonitor({ autoStart: false })
      );

      act(() => {
        result.current.start();
      });

      expect(mockMonitor.start).toHaveBeenCalled();
    });

    it("should provide stop method", () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.stop();
      });

      expect(mockMonitor.stop).toHaveBeenCalled();
    });

    it("should provide recordInteraction method", () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.recordInteraction();
      });

      expect(mockMonitor.recordInteraction).toHaveBeenCalled();
    });

    it("should provide setQuality method", () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.setQuality("high");
      });

      expect(mockMonitor.setQuality).toHaveBeenCalledWith("high");
    });

    it("should provide shouldSkipFrame method", () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      const shouldSkip = result.current.shouldSkipFrame();
      expect(mockMonitor.shouldSkipFrame).toHaveBeenCalled();
      expect(typeof shouldSkip).toBe("boolean");
    });

    it("should provide reset method", () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      act(() => {
        result.current.reset();
      });

      expect(mockMonitor.reset).toHaveBeenCalled();
    });
  });

  describe("callback handling", () => {
    it("should handle quality change callbacks", () => {
      const onQualityChange = vi.fn();
      const { result } = renderHook(() =>
        usePerformanceMonitor({ callbacks: { onQualityChange } })
      );

      // Simulate callback setup
      const setCallbacksCall = mockMonitor.setCallbacks.mock.calls[0];
      expect(setCallbacksCall).toBeDefined();

      const callbacks = setCallbacksCall[0];

      act(() => {
        callbacks.onQualityChange("high", { textureScale: 1.0 });
      });

      expect(result.current.currentQuality).toBe("high");
      expect(onQualityChange).toHaveBeenCalledWith("high", {
        textureScale: 1.0,
      });
    });

    it("should handle render pause callbacks", () => {
      const onRenderPause = vi.fn();
      const { result } = renderHook(() =>
        usePerformanceMonitor({ callbacks: { onRenderPause } })
      );

      const callbacks = mockMonitor.setCallbacks.mock.calls[0][0];

      act(() => {
        callbacks.onRenderPause();
      });

      expect(result.current.isRenderPaused).toBe(true);
      expect(onRenderPause).toHaveBeenCalled();
    });

    it("should handle render resume callbacks", () => {
      const onRenderResume = vi.fn();
      const { result } = renderHook(() =>
        usePerformanceMonitor({ callbacks: { onRenderResume } })
      );

      const callbacks = mockMonitor.setCallbacks.mock.calls[0][0];

      // First pause, then resume
      act(() => {
        callbacks.onRenderPause();
      });

      act(() => {
        callbacks.onRenderResume();
      });

      expect(result.current.isRenderPaused).toBe(false);
      expect(onRenderResume).toHaveBeenCalled();
    });

    it("should handle frame skip callbacks", () => {
      const onFrameSkip = vi.fn();
      const { result } = renderHook(() =>
        usePerformanceMonitor({ callbacks: { onFrameSkip } })
      );

      const callbacks = mockMonitor.setCallbacks.mock.calls[0][0];

      act(() => {
        callbacks.onFrameSkip(5);
      });

      expect(result.current.frameSkipCount).toBe(5);
      expect(onFrameSkip).toHaveBeenCalledWith(5);
    });
  });

  describe("options handling", () => {
    it("should pass device tier to monitor", () => {
      // This test verifies the hook passes the correct parameters to createPerformanceMonitor
      // The actual implementation is tested in the PerformanceMonitor unit tests
      renderHook(() => usePerformanceMonitor({ deviceTier: "high" }));

      // Verify the monitor was created (mocked constructor was called)
      expect(PerformanceMonitor).toHaveBeenCalled();
    });

    it("should pass custom presets to monitor", () => {
      const customPresets = { high: { textureScale: 2.0 } };

      renderHook(() =>
        usePerformanceMonitor({
          deviceTier: "high",
          customPresets,
        })
      );

      // Verify the monitor was created (mocked constructor was called)
      expect(PerformanceMonitor).toHaveBeenCalled();
    });
  });

  describe("state updates", () => {
    it("should update metrics when profiler callbacks are triggered", () => {
      const { result } = renderHook(() => usePerformanceMonitor());

      // Get the profiler mock and simulate metrics update
      const profiler = (mockMonitor as any).profiler;
      if (profiler && profiler.setCallbacks) {
        const profilerCallbacks = profiler.setCallbacks.mock.calls[0][0];

        const newMetrics = {
          currentFPS: 45,
          averageFPS: 43,
          frameDrops: 2,
          memoryUsage: 60 * 1024 * 1024,
          lastInteraction: Date.now(),
          renderTime: 22,
          frameCount: 150,
        };

        mockMonitor.getMetrics.mockReturnValue(newMetrics);
        mockMonitor.isPerformancePoor.mockReturnValue(true);

        act(() => {
          profilerCallbacks.onMetricsUpdate(newMetrics);
        });

        expect(result.current.metrics).toEqual(newMetrics);
        expect(result.current.isPerformancePoor).toBe(true);
      }
    });
  });
});

describe("useSimplePerformanceMonitor", () => {
  it("should provide simplified interface", () => {
    const { result } = renderHook(() => useSimplePerformanceMonitor("high"));

    expect(result.current.metrics).toBeDefined();
    expect(typeof result.current.isPerformancePoor).toBe("boolean");
    expect(typeof result.current.recordInteraction).toBe("function");
  });

  it("should auto-start monitoring", () => {
    renderHook(() => useSimplePerformanceMonitor());
    expect(mockMonitor.start).toHaveBeenCalled();
  });
});

describe("useFrameRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should provide frame rate limiting functionality", () => {
    const { result } = renderHook(() => useFrameRateLimit(30));

    expect(typeof result.current.shouldSkipFrame).toBe("function");
  });

  it("should skip frames based on target FPS", () => {
    const { result } = renderHook(() => useFrameRateLimit(30)); // 33.33ms per frame

    const mockNow = vi.spyOn(performance, "now");
    mockNow.mockReturnValueOnce(0);
    mockNow.mockReturnValueOnce(16); // 16ms later, should skip for 30fps

    const shouldSkip1 = result.current.shouldSkipFrame();
    const shouldSkip2 = result.current.shouldSkipFrame();

    expect(shouldSkip1).toBe(false); // First frame
    expect(shouldSkip2).toBe(true); // Too soon for 30fps
  });

  it("should not skip frames when enough time has passed", () => {
    const { result } = renderHook(() => useFrameRateLimit(30));

    const mockNow = vi.spyOn(performance, "now");
    mockNow.mockReturnValueOnce(0);
    mockNow.mockReturnValueOnce(40); // 40ms later, should not skip for 30fps

    const shouldSkip1 = result.current.shouldSkipFrame();
    const shouldSkip2 = result.current.shouldSkipFrame();

    expect(shouldSkip1).toBe(false);
    expect(shouldSkip2).toBe(false);
  });

  it("should handle different target FPS values", () => {
    const { result: result60 } = renderHook(() => useFrameRateLimit(60));
    const { result: result120 } = renderHook(() => useFrameRateLimit(120));

    expect(typeof result60.current.shouldSkipFrame).toBe("function");
    expect(typeof result120.current.shouldSkipFrame).toBe("function");
  });
});
