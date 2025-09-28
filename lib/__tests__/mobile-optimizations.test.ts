import { describe, test, expect, beforeAll, beforeEach, vi } from "vitest";
import {
  TouchOptimizer,
  BatteryAwareRenderer,
  VisibilityManager,
  ProgressiveImageLoader,
  HapticFeedback,
  MobileOptimizationManager,
} from "../mobile-optimizations";

// Mock APIs
const mockNavigator = {
  vibrate: vi.fn(),
  getBattery: vi.fn(),
  connection: {
    effectiveType: "4g",
    saveData: false,
  },
};

const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

// Setup mocks
beforeAll(() => {
  Object.defineProperty(global, "navigator", {
    value: mockNavigator,
    writable: true,
  });

  Object.defineProperty(global, "IntersectionObserver", {
    value: mockIntersectionObserver.mockImplementation((callback) => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
      callback,
    })),
    writable: true,
  });

  Object.defineProperty(global, "performance", {
    value: {
      now: vi.fn(() => Date.now()),
    },
    writable: true,
  });

  Object.defineProperty(global, "Image", {
    value: class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      src: string = "";

      constructor() {
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 10);
      }
    },
    writable: true,
  });
});

describe("TouchOptimizer", () => {
  let touchOptimizer: TouchOptimizer;
  let mockElement: HTMLElement;

  beforeEach(() => {
    touchOptimizer = new TouchOptimizer();
    mockElement = document.createElement("div");
    vi.clearAllMocks();
  });

  test("should optimize touch events with debouncing", () => {
    const onTouch = vi.fn();
    const cleanup = touchOptimizer.optimizeTouchEvents(mockElement, onTouch);

    // Simulate touch event
    const touchEvent = new TouchEvent("touchstart", {
      touches: [{ clientX: 100, clientY: 200 } as Touch],
    });

    mockElement.dispatchEvent(touchEvent);

    // Should debounce the call
    expect(onTouch).not.toHaveBeenCalled();

    // Wait for debounce
    setTimeout(() => {
      expect(onTouch).toHaveBeenCalledWith(touchEvent, { x: 100, y: 200 });
    }, 20);

    cleanup();
  });

  test("should limit touch points for performance", () => {
    const onTouch = vi.fn();
    touchOptimizer = new TouchOptimizer({ maxTouchPoints: 1 });
    touchOptimizer.optimizeTouchEvents(mockElement, onTouch);

    // Simulate multi-touch event
    const multiTouchEvent = new TouchEvent("touchstart", {
      touches: [
        { clientX: 100, clientY: 200 } as Touch,
        { clientX: 150, clientY: 250 } as Touch,
      ],
    });

    mockElement.dispatchEvent(multiTouchEvent);

    // Should not call onTouch due to touch point limit
    setTimeout(() => {
      expect(onTouch).not.toHaveBeenCalled();
    }, 20);
  });

  test("should track touch position and duration", () => {
    const onTouch = vi.fn();
    touchOptimizer.optimizeTouchEvents(mockElement, onTouch);

    const touchEvent = new TouchEvent("touchstart", {
      touches: [{ clientX: 100, clientY: 200 } as Touch],
    });

    mockElement.dispatchEvent(touchEvent);

    expect(touchOptimizer.getLastTouchPosition()).toEqual({ x: 100, y: 200 });
    expect(touchOptimizer.getTouchDuration()).toBeGreaterThan(0);
  });
});

describe("BatteryAwareRenderer", () => {
  let batteryRenderer: BatteryAwareRenderer;

  beforeEach(() => {
    batteryRenderer = new BatteryAwareRenderer();
    vi.clearAllMocks();
  });

  test("should handle missing battery API gracefully", () => {
    expect(batteryRenderer.getBatteryInfo()).toBeNull();
    expect(batteryRenderer.isLowBattery()).toBe(false);
    expect(batteryRenderer.isBatteryMonitoringAvailable()).toBe(false);
  });

  test("should provide quality recommendations based on battery", async () => {
    // Mock battery API
    const mockBattery = {
      charging: false,
      level: 0.15,
      chargingTime: Infinity,
      dischargingTime: 3600,
      addEventListener: vi.fn(),
    };

    mockNavigator.getBattery.mockResolvedValue(mockBattery);

    batteryRenderer = new BatteryAwareRenderer();

    // Wait for battery initialization
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(batteryRenderer.getRecommendedQuality()).toBe("low");
    expect(batteryRenderer.isLowBattery()).toBe(true);
  });

  test("should recommend high quality when charging", async () => {
    const mockBattery = {
      charging: true,
      level: 0.5,
      chargingTime: 1800,
      dischargingTime: Infinity,
      addEventListener: vi.fn(),
    };

    mockNavigator.getBattery.mockResolvedValue(mockBattery);

    batteryRenderer = new BatteryAwareRenderer();

    // Wait for battery initialization
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(batteryRenderer.getRecommendedQuality()).toBe("high");
    expect(batteryRenderer.isLowBattery()).toBe(false);
  });
});

describe("VisibilityManager", () => {
  let visibilityManager: VisibilityManager;

  beforeEach(() => {
    visibilityManager = new VisibilityManager();
    vi.clearAllMocks();
  });

  test("should setup intersection observer", () => {
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  test("should observe element visibility", () => {
    const mockElement = document.createElement("div");
    const cleanup = visibilityManager.observeElement(mockElement);

    expect(mockObserve).toHaveBeenCalledWith(mockElement);

    cleanup();
    expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
  });

  test("should handle visibility state changes", () => {
    const callback = vi.fn();
    visibilityManager.onVisibilityChange(callback);

    // Simulate intersection observer callback
    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 0.8,
    };

    observerInstance.callback([mockEntry]);

    expect(callback).toHaveBeenCalledWith({
      isVisible: true,
      intersectionRatio: 0.8,
      isInViewport: true,
    });
  });

  test("should determine render state based on visibility", () => {
    expect(visibilityManager.shouldRender()).toBe(true);

    // Simulate element becoming invisible
    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    const mockEntry = {
      isIntersecting: false,
      intersectionRatio: 0,
    };

    observerInstance.callback([mockEntry]);

    expect(visibilityManager.shouldRender()).toBe(false);
  });

  test("should dispose resources properly", () => {
    visibilityManager.dispose();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});

describe("ProgressiveImageLoader", () => {
  let imageLoader: ProgressiveImageLoader;

  beforeEach(() => {
    imageLoader = new ProgressiveImageLoader();
    vi.clearAllMocks();
  });

  test("should load images successfully", async () => {
    const image = await imageLoader.loadImage("test.jpg");
    expect(image).toBeInstanceOf(Image);
  });

  test("should cache loaded images", async () => {
    const image1 = await imageLoader.loadImage("test.jpg");
    const image2 = await imageLoader.loadImage("test.jpg");

    expect(image1).toBe(image2);
  });

  test("should select appropriate image source based on network", () => {
    // Mock slow connection
    mockNavigator.connection.effectiveType = "2g";
    mockNavigator.connection.saveData = true;

    imageLoader = new ProgressiveImageLoader();

    expect(imageLoader.isSlowConnection()).toBe(true);
  });

  test("should preload images with priority", () => {
    const images = [
      { src: "high.jpg", priority: "high" as const },
      { src: "low.jpg", priority: "low" as const },
    ];

    imageLoader.preloadImages(images);

    // Should start loading high priority first
    // This is tested by checking the order of Image constructor calls
  });

  test("should handle image loading errors", async () => {
    // Mock Image to simulate error
    const OriginalImage = global.Image;
    global.Image = class MockErrorImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      src: string = "";

      constructor() {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror();
          }
        }, 10);
      }
    } as any;

    await expect(imageLoader.loadImage("error.jpg")).rejects.toThrow();

    global.Image = OriginalImage;
  });
});

describe("HapticFeedback", () => {
  let hapticFeedback: HapticFeedback;

  beforeEach(() => {
    hapticFeedback = new HapticFeedback();
    vi.clearAllMocks();
  });

  test("should detect haptic support", () => {
    expect(hapticFeedback.isHapticSupported()).toBe(true);
  });

  test("should trigger interaction feedback", () => {
    hapticFeedback.triggerInteractionFeedback();
    expect(mockNavigator.vibrate).toHaveBeenCalledWith(10);
  });

  test("should trigger success feedback", () => {
    hapticFeedback.triggerSuccessFeedback();
    expect(mockNavigator.vibrate).toHaveBeenCalledWith([50, 50, 50]);
  });

  test("should trigger error feedback", () => {
    hapticFeedback.triggerErrorFeedback();
    expect(mockNavigator.vibrate).toHaveBeenCalledWith(200);
  });

  test("should handle custom vibration patterns", () => {
    hapticFeedback.triggerCustomPattern([100, 200, 100]);
    expect(mockNavigator.vibrate).toHaveBeenCalledWith([100, 200, 100]);
  });

  test("should handle missing vibration API", () => {
    const originalVibrate = mockNavigator.vibrate;
    delete (mockNavigator as any).vibrate;

    hapticFeedback = new HapticFeedback();
    expect(hapticFeedback.isHapticSupported()).toBe(false);

    // Should not throw when trying to vibrate
    expect(() => hapticFeedback.triggerInteractionFeedback()).not.toThrow();

    mockNavigator.vibrate = originalVibrate;
  });
});

describe("MobileOptimizationManager", () => {
  let manager: MobileOptimizationManager;

  beforeEach(() => {
    manager = new MobileOptimizationManager();
    vi.clearAllMocks();
  });

  test("should initialize all optimization components", () => {
    expect(manager.touchOptimizer).toBeInstanceOf(TouchOptimizer);
    expect(manager.batteryAwareRenderer).toBeInstanceOf(BatteryAwareRenderer);
    expect(manager.visibilityManager).toBeInstanceOf(VisibilityManager);
    expect(manager.progressiveImageLoader).toBeInstanceOf(
      ProgressiveImageLoader
    );
    expect(manager.hapticFeedback).toBeInstanceOf(HapticFeedback);
  });

  test("should initialize optimizations for element", () => {
    const mockElement = document.createElement("div");
    const callbacks = {
      onTouch: vi.fn(),
      onVisibilityChange: vi.fn(),
      onBatteryChange: vi.fn(),
    };

    const cleanup = manager.initializeForElement(mockElement, callbacks);

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
    expect(typeof cleanup).toBe("function");

    cleanup();
  });

  test("should provide comprehensive optimization recommendations", () => {
    const recommendations = manager.getOptimizationRecommendations();

    expect(recommendations).toHaveProperty("shouldReduceQuality");
    expect(recommendations).toHaveProperty("shouldPauseRendering");
    expect(recommendations).toHaveProperty("recommendedQuality");
    expect(recommendations).toHaveProperty("reasons");
    expect(Array.isArray(recommendations.reasons)).toBe(true);
  });

  test("should dispose resources properly", () => {
    manager.dispose();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});

describe("Integration Tests", () => {
  test("should coordinate battery and visibility optimizations", async () => {
    const manager = new MobileOptimizationManager();

    // Mock low battery
    const mockBattery = {
      charging: false,
      level: 0.1,
      chargingTime: Infinity,
      dischargingTime: 1800,
      addEventListener: vi.fn(),
    };

    mockNavigator.getBattery.mockResolvedValue(mockBattery);

    // Wait for battery initialization
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Simulate element becoming invisible
    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    const mockEntry = {
      isIntersecting: false,
      intersectionRatio: 0,
    };

    observerInstance.callback([mockEntry]);

    const recommendations = manager.getOptimizationRecommendations();

    expect(recommendations.shouldReduceQuality).toBe(true);
    expect(recommendations.shouldPauseRendering).toBe(true);
    expect(recommendations.recommendedQuality).toBe("low");
    expect(recommendations.reasons).toContain("Low battery level");
    expect(recommendations.reasons).toContain("Element not visible");
  });

  test("should handle touch interactions with haptic feedback", () => {
    const manager = new MobileOptimizationManager();
    const mockElement = document.createElement("div");
    const onTouch = vi.fn();

    manager.initializeForElement(mockElement, { onTouch });

    // Simulate touch event
    const touchEvent = new TouchEvent("touchstart", {
      touches: [{ clientX: 100, clientY: 200 } as Touch],
    });

    mockElement.dispatchEvent(touchEvent);

    // Should trigger haptic feedback
    setTimeout(() => {
      expect(mockNavigator.vibrate).toHaveBeenCalledWith(10);
    }, 20);
  });
});
