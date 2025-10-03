import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock React for testing
import React from "react";
global.React = React;

// Mock performance API
Object.defineProperty(global, "performance", {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
  },
  writable: true,
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Ensure window is available globally
if (typeof window === "undefined") {
  Object.defineProperty(global, "window", {
    value: {
      innerWidth: 1024,
      innerHeight: 768,
      devicePixelRatio: 1,
      matchMedia: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
    writable: true,
  });
}

// Mock additional window properties for device detection
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, "innerHeight", {
  writable: true,
  configurable: true,
  value: 768,
});

Object.defineProperty(window, "devicePixelRatio", {
  writable: true,
  configurable: true,
  value: 1,
});

// Mock navigator
Object.defineProperty(global, "navigator", {
  writable: true,
  configurable: true,
  value: {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    vibrate: vi.fn(),
    getBattery: vi.fn(() =>
      Promise.resolve({
        level: 0.8,
        charging: false,
        chargingTime: Infinity,
        dischargingTime: 3600,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    ),
  },
});

// Ensure navigator is available on window too
if (typeof window !== "undefined") {
  Object.defineProperty(window, "navigator", {
    writable: true,
    configurable: true,
    value: global.navigator,
  });
}

// Mock document.createElement
const originalCreateElement = document.createElement;
document.createElement = vi.fn().mockImplementation((tagName) => {
  if (tagName === "canvas") {
    return {
      getContext: vi.fn(() => ({
        getParameter: vi.fn(() => 4096),
        getExtension: vi.fn(() => ({
          loseContext: vi.fn(),
        })),
      })),
    };
  }
  return originalCreateElement.call(document, tagName);
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  const id = setTimeout(cb, 16);
  return id as unknown as number;
});
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Mock HTMLCanvasElement
global.HTMLCanvasElement = class MockHTMLCanvasElement {
  getContext = vi.fn(() => ({
    getParameter: vi.fn(() => 4096),
    getExtension: vi.fn(() => ({
      loseContext: vi.fn(),
    })),
    createShader: vi.fn(),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    createProgram: vi.fn(),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    useProgram: vi.fn(),
    deleteShader: vi.fn(),
    deleteProgram: vi.fn(),
  }));
  width = 300;
  height = 150;
} as any;

// Mock Element
global.Element = class MockElement {
  getBoundingClientRect = vi.fn(() => ({
    left: 0,
    top: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  }));
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
} as any;

// Suppress console warnings in tests unless explicitly testing them
const originalConsoleWarn = console.warn;
console.warn = vi.fn((...args) => {
  // Only show warnings that are explicitly being tested
  if (
    args[0]?.includes?.("Performance metric") ||
    args[0]?.includes?.("Question not found") ||
    args[0]?.includes?.("Answer not found") ||
    args[0]?.includes?.("Legacy villain format") ||
    args[0]?.includes?.("Invalid villains data") ||
    (args[0]?.includes?.("Component") && args[0]?.includes?.("rendered"))
  ) {
    originalConsoleWarn(...args);
  }
});

// Mock console.log for performance monitoring tests
const originalConsoleLog = console.log;
console.log = vi.fn((...args) => {
  // Only show logs that are explicitly being tested
  if (
    args[0]?.includes?.("Performance:") ||
    args[0]?.includes?.("Score calculation")
  ) {
    originalConsoleLog(...args);
  }
});
