import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useResourceManager,
  useResourceCleanup,
  useRenderLoop,
} from "../useResourceManager";
import { ResourceManager } from "../../lib/resource-manager";

// Mock ResourceManager
vi.mock("../../lib/resource-manager", () => ({
  ResourceManager: vi.fn().mockImplementation(() => ({
    dispose: vi.fn(),
    setMemoryPressureCallback: vi.fn(),
    setVisibilityChangeCallback: vi.fn(),
    observeElement: vi.fn(),
    unobserveElement: vi.fn(),
    getEstimatedMemoryUsage: vi.fn().mockReturnValue(50),
    getRenderState: vi.fn().mockReturnValue({
      isPaused: false,
      isVisible: true,
      lastRenderTime: 1000,
      frameCount: 100,
    }),
    isRenderingPaused: vi.fn().mockReturnValue(false),
    pauseRendering: vi.fn(),
    resumeRendering: vi.fn(),
    checkMemoryPressure: vi.fn().mockReturnValue(false),
    updateRenderState: vi.fn(),
    registerTexture: vi.fn(),
    registerBuffer: vi.fn(),
    registerProgram: vi.fn(),
    addEventListener: vi.fn(),
  })),
}));

describe("useResourceManager", () => {
  let mockResourceManager: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockResourceManager = new ResourceManager();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize ResourceManager with options", () => {
    const mockGL = {} as WebGLRenderingContext;
    const memoryConfig = { maxMemoryMB: 200 };
    const onMemoryPressure = vi.fn();
    const onVisibilityChange = vi.fn();

    renderHook(() =>
      useResourceManager(undefined, {
        gl: mockGL,
        memoryConfig,
        onMemoryPressure,
        onVisibilityChange,
      })
    );

    expect(ResourceManager).toHaveBeenCalledWith(mockGL, memoryConfig);
    expect(mockResourceManager.setMemoryPressureCallback).toHaveBeenCalledWith(
      onMemoryPressure
    );
    expect(
      mockResourceManager.setVisibilityChangeCallback
    ).toHaveBeenCalledWith(onVisibilityChange);
  });

  it("should dispose ResourceManager on unmount", () => {
    const { unmount } = renderHook(() => useResourceManager());

    unmount();

    expect(mockResourceManager.dispose).toHaveBeenCalled();
  });

  it("should auto-observe element when provided", () => {
    const element = document.createElement("div");
    const elementRef = { current: element };

    renderHook(() =>
      useResourceManager(elementRef, { autoObserveElement: true })
    );

    expect(mockResourceManager.observeElement).toHaveBeenCalledWith(element);
  });

  it("should not auto-observe when autoObserveElement is false", () => {
    const element = document.createElement("div");
    const elementRef = { current: element };

    renderHook(() =>
      useResourceManager(elementRef, { autoObserveElement: false })
    );

    expect(mockResourceManager.observeElement).not.toHaveBeenCalled();
  });

  it("should unobserve element on cleanup", () => {
    const element = document.createElement("div");
    const elementRef = { current: element };

    const { unmount } = renderHook(() => useResourceManager(elementRef));

    unmount();

    expect(mockResourceManager.unobserveElement).toHaveBeenCalledWith(element);
  });

  it("should update metrics periodically", () => {
    const { result } = renderHook(() => useResourceManager());

    // Fast-forward time to trigger metric updates
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockResourceManager.getEstimatedMemoryUsage).toHaveBeenCalled();
    expect(mockResourceManager.getRenderState).toHaveBeenCalled();
    expect(result.current.memoryUsage).toBe(50);
  });

  it("should provide control methods", () => {
    const { result } = renderHook(() => useResourceManager());

    act(() => {
      result.current.pauseRendering();
    });
    expect(mockResourceManager.pauseRendering).toHaveBeenCalled();

    act(() => {
      result.current.resumeRendering();
    });
    expect(mockResourceManager.resumeRendering).toHaveBeenCalled();

    act(() => {
      const pressure = result.current.checkMemoryPressure();
      expect(pressure).toBe(false);
    });
    expect(mockResourceManager.checkMemoryPressure).toHaveBeenCalled();

    const element = document.createElement("div");
    act(() => {
      result.current.observeElement(element);
    });
    expect(mockResourceManager.observeElement).toHaveBeenCalledWith(element);

    act(() => {
      result.current.unobserveElement(element);
    });
    expect(mockResourceManager.unobserveElement).toHaveBeenCalledWith(element);
  });

  it("should return current state", () => {
    const { result } = renderHook(() => useResourceManager());

    expect(result.current.isRenderingPaused).toBe(false);
    expect(result.current.renderState).toEqual({
      isPaused: false,
      isVisible: true,
      lastRenderTime: 1000,
      frameCount: 100,
    });
  });
});

describe("useResourceCleanup", () => {
  let mockResourceManager: any;

  beforeEach(() => {
    mockResourceManager = new ResourceManager();
  });

  it("should register resources with ResourceManager", () => {
    const texture = {} as WebGLTexture;
    const buffer = {} as WebGLBuffer;
    const program = {} as WebGLProgram;
    const eventListener = {
      target: document,
      type: "click",
      listener: vi.fn(),
      options: { passive: true },
    };

    renderHook(() =>
      useResourceCleanup(mockResourceManager, {
        textures: [texture],
        buffers: [buffer],
        programs: [program],
        eventListeners: [eventListener],
      })
    );

    expect(mockResourceManager.registerTexture).toHaveBeenCalledWith(texture);
    expect(mockResourceManager.registerBuffer).toHaveBeenCalledWith(buffer);
    expect(mockResourceManager.registerProgram).toHaveBeenCalledWith(program);
    expect(mockResourceManager.addEventListener).toHaveBeenCalledWith(
      document,
      "click",
      eventListener.listener,
      { passive: true }
    );
  });

  it("should handle null ResourceManager", () => {
    expect(() => {
      renderHook(() =>
        useResourceCleanup(null, {
          textures: [{}] as WebGLTexture[],
        })
      );
    }).not.toThrow();
  });

  it("should handle empty resources", () => {
    expect(() => {
      renderHook(() => useResourceCleanup(mockResourceManager, {}));
    }).not.toThrow();
  });
});

describe("useRenderLoop", () => {
  let mockResourceManager: any;
  let mockRenderCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockResourceManager = new ResourceManager();
    mockRenderCallback = vi.fn();

    // Mock requestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = vi.fn((callback) => {
      setTimeout(callback, 16); // ~60fps
      return 1;
    });
    global.cancelAnimationFrame = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should start render loop", () => {
    renderHook(() => useRenderLoop(mockResourceManager, mockRenderCallback));

    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  it("should call render callback when not paused", async () => {
    mockResourceManager.isRenderingPaused.mockReturnValue(false);

    renderHook(() => useRenderLoop(mockResourceManager, mockRenderCallback));

    // Wait for the first frame
    await vi.runOnlyPendingTimersAsync();

    expect(mockRenderCallback).toHaveBeenCalled();
    expect(mockResourceManager.updateRenderState).toHaveBeenCalled();
  });

  it("should not call render callback when paused", async () => {
    mockResourceManager.isRenderingPaused.mockReturnValue(true);

    renderHook(() => useRenderLoop(mockResourceManager, mockRenderCallback));

    // Wait for the first frame
    await vi.runOnlyPendingTimersAsync();

    expect(mockRenderCallback).not.toHaveBeenCalled();
    expect(mockResourceManager.updateRenderState).not.toHaveBeenCalled();
  });

  it("should cancel animation frame on unmount", () => {
    const { unmount } = renderHook(() =>
      useRenderLoop(mockResourceManager, mockRenderCallback)
    );

    unmount();

    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("should handle null ResourceManager", () => {
    expect(() => {
      renderHook(() => useRenderLoop(null, mockRenderCallback));
    }).not.toThrow();
  });

  it("should restart render loop on visibility change", () => {
    const { rerender } = renderHook(() =>
      useRenderLoop(mockResourceManager, mockRenderCallback)
    );

    // Simulate visibility change callback setup
    const visibilityCallback =
      mockResourceManager.setVisibilityChangeCallback.mock.calls[0]?.[0];

    if (visibilityCallback) {
      // Simulate becoming visible
      visibilityCallback(true);
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    }

    rerender();
  });

  it("should update render loop when dependencies change", () => {
    let dependency = 1;
    const { rerender } = renderHook(() =>
      useRenderLoop(mockResourceManager, mockRenderCallback, [dependency])
    );

    const initialCallCount = (global.requestAnimationFrame as any).mock.calls
      .length;

    dependency = 2;
    rerender();

    expect(
      (global.requestAnimationFrame as any).mock.calls.length
    ).toBeGreaterThan(initialCallCount);
  });
});
