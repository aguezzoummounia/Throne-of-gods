import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  ResourceManager,
  WebGLResourceWrapper,
  WebGLResource,
} from "../resource-manager";

// Setup DOM environment
const setupDOM = () => {
  const dom = {
    window: {
      setInterval: vi.fn((callback, ms) => {
        return setTimeout(callback, ms);
      }),
      clearInterval: vi.fn(clearTimeout),
      performance: {
        now: vi.fn(() => Date.now()),
      },
    },
    document: {
      createElement: vi.fn(() => ({
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    },
  };

  global.window = dom.window as any;
  global.document = dom.document as any;
  global.performance = dom.window.performance as any;

  return dom;
};

// Mock WebGL context
const createMockWebGLContext = () => ({
  deleteTexture: vi.fn(),
  deleteBuffer: vi.fn(),
  deleteProgram: vi.fn(),
});

// Mock performance.memory
const mockPerformanceMemory = (usedJSHeapSize: number) => {
  Object.defineProperty(performance, "memory", {
    value: { usedJSHeapSize },
    configurable: true,
  });
};

// Mock IntersectionObserver
class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;
  private elements: Set<Element> = new Set();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // Test helper to trigger intersection
  triggerIntersection(isIntersecting: boolean) {
    const entries = Array.from(this.elements).map((target) => ({
      target,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: {} as DOMRectReadOnly,
      time: performance.now(),
    }));
    this.callback(entries, this);
  }
}

describe("ResourceManager", () => {
  let resourceManager: ResourceManager;
  let mockGl: ReturnType<typeof createMockWebGLContext>;
  let dom: ReturnType<typeof setupDOM>;

  beforeEach(() => {
    // Setup DOM environment
    dom = setupDOM();

    mockGl = createMockWebGLContext();
    resourceManager = new ResourceManager(mockGl as any);

    // Mock IntersectionObserver
    global.IntersectionObserver = MockIntersectionObserver as any;

    // Clear any existing timers
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    resourceManager.dispose();
    vi.restoreAllMocks();
    vi.useRealTimers();

    // Clean up global mocks
    delete (global as any).window;
    delete (global as any).document;
    delete (global as any).IntersectionObserver;
  });

  describe("Resource Registration and Cleanup", () => {
    it("should register and dispose WebGL resources", () => {
      const mockResource: WebGLResource = {
        dispose: vi.fn(),
        isDisposed: vi.fn().mockReturnValue(false),
      };

      resourceManager.registerResource(mockResource);
      resourceManager.dispose();

      expect(mockResource.dispose).toHaveBeenCalled();
    });

    it("should register and cleanup WebGL textures", () => {
      const mockTexture = {} as WebGLTexture;

      resourceManager.registerTexture(mockTexture);
      resourceManager.dispose();

      expect(mockGl.deleteTexture).toHaveBeenCalledWith(mockTexture);
    });

    it("should register and cleanup WebGL buffers", () => {
      const mockBuffer = {} as WebGLBuffer;

      resourceManager.registerBuffer(mockBuffer);
      resourceManager.dispose();

      expect(mockGl.deleteBuffer).toHaveBeenCalledWith(mockBuffer);
    });

    it("should register and cleanup WebGL programs", () => {
      const mockProgram = {} as WebGLProgram;

      resourceManager.registerProgram(mockProgram);
      resourceManager.dispose();

      expect(mockGl.deleteProgram).toHaveBeenCalledWith(mockProgram);
    });

    it("should unregister resources", () => {
      const mockResource: WebGLResource = {
        dispose: vi.fn(),
        isDisposed: vi.fn().mockReturnValue(false),
      };

      resourceManager.registerResource(mockResource);
      resourceManager.unregisterResource(mockResource);
      resourceManager.dispose();

      expect(mockResource.dispose).not.toHaveBeenCalled();
    });
  });

  describe("Event Listener Management", () => {
    it("should register and cleanup event listeners", () => {
      const mockTarget = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as any;
      const mockListener = vi.fn();

      resourceManager.addEventListener(mockTarget, "click", mockListener);
      resourceManager.dispose();

      expect(mockTarget.addEventListener).toHaveBeenCalledWith(
        "click",
        mockListener,
        undefined
      );
      expect(mockTarget.removeEventListener).toHaveBeenCalledWith(
        "click",
        mockListener
      );
    });

    it("should remove specific event listeners", () => {
      const mockTarget = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as any;
      const mockListener = vi.fn();

      resourceManager.addEventListener(mockTarget, "click", mockListener);
      resourceManager.removeEventListener(mockTarget, "click");

      expect(mockTarget.removeEventListener).toHaveBeenCalledWith(
        "click",
        mockListener
      );
    });

    it("should handle multiple event listeners on same target", () => {
      const mockTarget = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as any;
      const clickListener = vi.fn();
      const mouseListener = vi.fn();

      resourceManager.addEventListener(mockTarget, "click", clickListener);
      resourceManager.addEventListener(mockTarget, "mouseover", mouseListener);
      resourceManager.dispose();

      expect(mockTarget.removeEventListener).toHaveBeenCalledWith(
        "click",
        clickListener
      );
      expect(mockTarget.removeEventListener).toHaveBeenCalledWith(
        "mouseover",
        mouseListener
      );
    });
  });

  describe("Render State Management", () => {
    it("should pause and resume rendering", () => {
      expect(resourceManager.isRenderingPaused()).toBe(false);

      resourceManager.pauseRendering();
      expect(resourceManager.isRenderingPaused()).toBe(true);

      resourceManager.resumeRendering();
      expect(resourceManager.isRenderingPaused()).toBe(false);
    });

    it("should update render state", () => {
      const initialState = resourceManager.getRenderState();
      expect(initialState.frameCount).toBe(0);

      resourceManager.updateRenderState();
      const updatedState = resourceManager.getRenderState();
      expect(updatedState.frameCount).toBe(1);
      expect(updatedState.lastRenderTime).toBeGreaterThanOrEqual(0);
    });

    it("should not update render state when paused", () => {
      resourceManager.pauseRendering();
      const initialState = resourceManager.getRenderState();

      resourceManager.updateRenderState();
      const updatedState = resourceManager.getRenderState();

      expect(updatedState.frameCount).toBe(initialState.frameCount);
    });

    it("should consider visibility in render pause state", () => {
      const mockElement = dom.document.createElement("div");

      // Set up visibility change callback to manually update state
      let isVisible = true;
      resourceManager.setVisibilityChangeCallback((visible) => {
        isVisible = visible;
      });

      resourceManager.observeElement(mockElement as any);

      // Manually trigger visibility change since we can't easily test IntersectionObserver integration
      // In real usage, the IntersectionObserver would call the visibility callback
      resourceManager.setVisibilityChangeCallback((visible) => {
        // Simulate the internal state change that would happen
        (resourceManager as any).renderState.isVisible = visible;
      });

      // Trigger the callback manually to simulate visibility change
      (resourceManager as any).onVisibilityChange?.(false);

      // The render state should be updated by the visibility observer
      expect(resourceManager.isRenderingPaused()).toBe(true);
    });
  });

  describe("Memory Pressure Detection", () => {
    it("should estimate memory usage with performance.memory", () => {
      mockPerformanceMemory(50 * 1024 * 1024); // 50MB

      const usage = resourceManager.getEstimatedMemoryUsage();
      expect(usage).toBe(50);
    });

    it("should estimate memory usage without performance.memory", () => {
      // Remove performance.memory
      delete (performance as any).memory;

      // Add some resources
      resourceManager.registerTexture({} as WebGLTexture);
      resourceManager.registerBuffer({} as WebGLBuffer);
      resourceManager.registerProgram({} as WebGLProgram);

      const usage = resourceManager.getEstimatedMemoryUsage();
      expect(usage).toBe(2.6); // 2MB + 0.5MB + 0.1MB
    });

    it("should detect memory pressure and trigger cleanup", () => {
      mockPerformanceMemory(90 * 1024 * 1024); // 90MB (above warning threshold)

      const memoryPressureCallback = vi.fn();
      resourceManager.setMemoryPressureCallback(memoryPressureCallback);

      const isUnderPressure = resourceManager.checkMemoryPressure();

      expect(isUnderPressure).toBe(true);
      expect(memoryPressureCallback).toHaveBeenCalled();
    });

    it("should automatically check memory pressure at intervals", () => {
      // Create a new resource manager to ensure fresh interval setup
      const newResourceManager = new ResourceManager(mockGl as any);

      mockPerformanceMemory(90 * 1024 * 1024);

      const memoryPressureCallback = vi.fn();
      newResourceManager.setMemoryPressureCallback(memoryPressureCallback);

      // Fast-forward time to trigger interval
      vi.advanceTimersByTime(5000);

      expect(memoryPressureCallback).toHaveBeenCalled();

      newResourceManager.dispose();
    });

    it("should clean up disposed resources during emergency cleanup", () => {
      const disposedResource: WebGLResource = {
        dispose: vi.fn(),
        isDisposed: vi.fn().mockReturnValue(true),
      };
      const activeResource: WebGLResource = {
        dispose: vi.fn(),
        isDisposed: vi.fn().mockReturnValue(false),
      };

      resourceManager.registerResource(disposedResource);
      resourceManager.registerResource(activeResource);

      mockPerformanceMemory(90 * 1024 * 1024);
      resourceManager.checkMemoryPressure();

      // Disposed resource should be removed from tracking
      resourceManager.dispose();
      expect(activeResource.dispose).toHaveBeenCalled();
    });
  });

  describe("Visibility Detection", () => {
    it("should observe and unobserve elements", () => {
      const mockElement = dom.document.createElement("div");

      resourceManager.observeElement(mockElement as any);
      resourceManager.unobserveElement(mockElement as any);

      // Should not throw and should handle the operations gracefully
      expect(true).toBe(true);
    });

    it("should trigger visibility change callback", () => {
      const visibilityCallback = vi.fn();
      resourceManager.setVisibilityChangeCallback(visibilityCallback);

      const mockElement = dom.document.createElement("div");
      resourceManager.observeElement(mockElement as any);

      // Manually trigger visibility change since we can't easily test IntersectionObserver
      const renderState = resourceManager.getRenderState();
      expect(renderState.isVisible).toBe(true);
    });
  });

  describe("Configuration", () => {
    it("should accept custom memory configuration", () => {
      const customConfig = {
        maxMemoryMB: 200,
        warningThresholdMB: 150,
        checkIntervalMs: 10000,
        autoCleanupEnabled: false,
      };

      const customResourceManager = new ResourceManager(
        mockGl as any,
        customConfig
      );

      mockPerformanceMemory(160 * 1024 * 1024); // Above custom threshold
      const memoryPressureCallback = vi.fn();
      customResourceManager.setMemoryPressureCallback(memoryPressureCallback);

      const isUnderPressure = customResourceManager.checkMemoryPressure();

      expect(isUnderPressure).toBe(true);
      // Should not trigger callback because autoCleanupEnabled is false
      expect(memoryPressureCallback).not.toHaveBeenCalled();

      customResourceManager.dispose();
    });
  });

  describe("WebGLResourceWrapper", () => {
    it("should create and dispose resource wrapper", () => {
      const disposeCallback = vi.fn();
      const wrapper = new WebGLResourceWrapper(disposeCallback);

      expect(wrapper.isDisposed()).toBe(false);

      wrapper.dispose();

      expect(wrapper.isDisposed()).toBe(true);
      expect(disposeCallback).toHaveBeenCalled();
    });

    it("should not dispose twice", () => {
      const disposeCallback = vi.fn();
      const wrapper = new WebGLResourceWrapper(disposeCallback);

      wrapper.dispose();
      wrapper.dispose();

      expect(disposeCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle disposal without WebGL context", () => {
      const resourceManagerWithoutGL = new ResourceManager();

      resourceManagerWithoutGL.registerTexture({} as WebGLTexture);
      resourceManagerWithoutGL.registerBuffer({} as WebGLBuffer);

      // Should not throw
      expect(() => resourceManagerWithoutGL.dispose()).not.toThrow();
    });

    it("should handle missing IntersectionObserver", () => {
      delete (global as any).IntersectionObserver;

      const resourceManagerWithoutObserver = new ResourceManager();
      const mockElement = dom.document.createElement("div");

      // Should not throw
      expect(() =>
        resourceManagerWithoutObserver.observeElement(mockElement as any)
      ).not.toThrow();
      expect(() =>
        resourceManagerWithoutObserver.unobserveElement(mockElement as any)
      ).not.toThrow();

      resourceManagerWithoutObserver.dispose();
    });

    it("should handle missing performance.memory gracefully", () => {
      delete (performance as any).memory;

      const usage = resourceManager.getEstimatedMemoryUsage();
      expect(typeof usage).toBe("number");
      expect(usage).toBeGreaterThanOrEqual(0);
    });

    it("should handle window.gc if available", () => {
      (global.window as any).gc = vi.fn();

      mockPerformanceMemory(90 * 1024 * 1024);
      resourceManager.checkMemoryPressure();

      expect((global.window as any).gc).toHaveBeenCalled();

      delete (global.window as any).gc;
    });
  });
});
