import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";
import { PerformanceLogger } from "../performance-logger";

import { vi } from "vitest";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("PerformanceLogger", () => {
  let logger: PerformanceLogger;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = new PerformanceLogger({
      enabled: true,
      maxEntries: 100,
      logToConsole: false,
      logToStorage: false,
      minLevel: "debug",
    });
  });

  describe("logging methods", () => {
    it("should log FPS with appropriate level", () => {
      logger.logFPS(60, "TestComponent");
      logger.logFPS(25, "TestComponent");

      const logs = logger.getLogs();
      expect(logs).toHaveLength(2);
      expect(logs[0].level).toBe("info"); // 60 FPS
      expect(logs[1].level).toBe("warn"); // 25 FPS
    });

    it("should log memory usage with warnings for high usage", () => {
      const lowMemory = 50 * 1024 * 1024; // 50MB
      const highMemory = 150 * 1024 * 1024; // 150MB

      logger.logMemoryUsage(lowMemory, "TestComponent");
      logger.logMemoryUsage(highMemory, "TestComponent");

      const logs = logger.getLogs();
      expect(logs).toHaveLength(2);
      expect(logs[0].level).toBe("info");
      expect(logs[1].level).toBe("warn");
    });

    it("should log interactions with debug level", () => {
      logger.logInteraction("click", { x: 100, y: 200 }, "TestComponent");

      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe("interaction");
      expect(logs[0].level).toBe("debug");
      expect(logs[0].data).toEqual({ x: 100, y: 200 });
    });

    it("should log errors with proper error data", () => {
      const error = new Error("Test error");
      logger.logError("Test error message", error, "TestComponent");

      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe("error");
      expect(logs[0].level).toBe("error");
      expect(logs[0].data).toEqual({
        name: "Error",
        message: "Test error",
        stack: error.stack,
      });
    });
  });

  describe("log filtering", () => {
    beforeEach(() => {
      logger.logFPS(60, "Component1");
      logger.logMemoryUsage(50 * 1024 * 1024, "Component2");
      logger.logError("Test error", undefined, "Component1");
      logger.logWarning("Test warning", undefined, "Component2");
    });

    it("should filter logs by type", () => {
      const fpsLogs = logger.getLogs({ type: "fps" });
      expect(fpsLogs).toHaveLength(1);
      expect(fpsLogs[0].type).toBe("fps");
    });

    it("should filter logs by component", () => {
      const component1Logs = logger.getLogs({ component: "Component1" });
      expect(component1Logs).toHaveLength(2);
      expect(
        component1Logs.every((log) => log.component === "Component1")
      ).toBe(true);
    });

    it("should filter logs by level", () => {
      const errorLogs = logger.getLogs({ level: "error" });
      expect(errorLogs).toHaveLength(1);
      expect(errorLogs[0].level).toBe("error");
    });

    it("should filter logs by timestamp", () => {
      const now = Date.now();
      const recentLogs = logger.getLogs({ since: now - 1000 });
      expect(recentLogs.length).toBeGreaterThan(0);
    });
  });

  describe("log management", () => {
    it("should maintain max entries limit", () => {
      const smallLogger = new PerformanceLogger({
        enabled: true,
        maxEntries: 3,
        logToConsole: false,
      });

      for (let i = 0; i < 5; i++) {
        smallLogger.logInfo(`Message ${i}`);
      }

      const logs = smallLogger.getLogs();
      expect(logs).toHaveLength(3);
      expect(logs[0].message).toBe("Message 2"); // Oldest kept
      expect(logs[2].message).toBe("Message 4"); // Newest
    });

    it("should clear logs", () => {
      logger.logInfo("Test message");
      expect(logger.getLogs()).toHaveLength(1);

      logger.clearLogs();
      expect(logger.getLogs()).toHaveLength(0);
    });

    it("should export logs as JSON", () => {
      logger.logInfo("Test message");
      const exported = logger.exportLogs();
      const parsed = JSON.parse(exported);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].message).toBe("Test message");
    });
  });

  describe("statistics", () => {
    beforeEach(() => {
      logger.logFPS(60);
      logger.logFPS(45);
      logger.logFPS(30);
      logger.logMemoryUsage(50 * 1024 * 1024);
      logger.logMemoryUsage(100 * 1024 * 1024);
      logger.logError("Error 1");
      logger.logError("Error 2");
      logger.logWarning("Warning 1");
    });

    it("should calculate correct statistics", () => {
      const stats = logger.getStats();

      expect(stats.totalLogs).toBe(8);
      expect(stats.errorCount).toBe(2);
      expect(stats.warningCount).toBe(1);
      expect(stats.averageFPS).toBe(45); // (60 + 45 + 30) / 3
      expect(stats.memoryPeaks).toHaveLength(2);
      expect(stats.memoryPeaks[0]).toBe(100 * 1024 * 1024); // Highest first
    });
  });

  describe("level filtering", () => {
    it("should respect minimum log level", () => {
      const warnLogger = new PerformanceLogger({
        enabled: true,
        minLevel: "warn",
        logToConsole: false,
      });

      warnLogger.logInfo("Info message");
      warnLogger.logWarning("Warning message");
      warnLogger.logError("Error message");

      const logs = warnLogger.getLogs();
      expect(logs).toHaveLength(2); // Only warn and error
      expect(logs.some((log) => log.level === "info")).toBe(false);
    });

    it("should not log when disabled", () => {
      const disabledLogger = new PerformanceLogger({
        enabled: false,
      });

      disabledLogger.logError("This should not be logged");
      expect(disabledLogger.getLogs()).toHaveLength(0);
    });
  });

  describe("storage integration", () => {
    it("should save to localStorage when enabled", () => {
      const storageLogger = new PerformanceLogger({
        enabled: true,
        logToStorage: true,
        logToConsole: false,
      });

      storageLogger.logInfo("Test message");

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "ripple-performance-logs",
        expect.any(String)
      );
    });

    it("should clear localStorage when clearing logs", () => {
      const storageLogger = new PerformanceLogger({
        enabled: true,
        logToStorage: true,
        logToConsole: false,
      });

      storageLogger.clearLogs();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        "ripple-performance-logs"
      );
    });
  });
});
