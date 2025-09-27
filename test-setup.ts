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

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

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
