import { vi } from "vitest";
import { webglDebugger } from "../webgl-debugger";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
import { it } from "node:test";
import { it } from "node:test";
import { describe } from "node:test";
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
import { describe } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";

// Mock WebGL context
const mockGL = {
  createShader: vi.fn(),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  getShaderParameter: vi.fn(),
  getShaderInfoLog: vi.fn(),
  deleteShader: vi.fn(),
  validateProgram: vi.fn(),
  getProgramParameter: vi.fn(),
  getProgramInfoLog: vi.fn(),
  getError: vi.fn(),
  getParameter: vi.fn(),
  getExtension: vi.fn(),
  getSupportedExtensions: vi.fn(),
  VERTEX_SHADER: 35633,
  FRAGMENT_SHADER: 35632,
  COMPILE_STATUS: 35713,
  VALIDATE_STATUS: 35715,
  NO_ERROR: 0,
  INVALID_ENUM: 1280,
  INVALID_VALUE: 1281,
  INVALID_OPERATION: 1282,
  OUT_OF_MEMORY: 1285,
  CONTEXT_LOST_WEBGL: 37442,
  VENDOR: 7936,
  RENDERER: 7937,
  VERSION: 7938,
  SHADING_LANGUAGE_VERSION: 35724,
  MAX_TEXTURE_SIZE: 3379,
  MAX_VERTEX_ATTRIBS: 34921,
  MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
  MAX_VARYING_VECTORS: 36348,
} as any;

// Mock canvas
const mockCanvas = {
  getContext: jest.fn(),
  addEventListener: jest.fn(),
} as any;

// Mock document
Object.defineProperty(document, "createElement", {
  value: jest.fn(() => mockCanvas),
});

describe("WebGLDebugger", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset WebGL debugger state
    webglDebugger.clearShaderCache();

    // Default mock implementations
    mockCanvas.getContext.mockReturnValue(mockGL);
    mockGL.getParameter.mockImplementation((param) => {
      switch (param) {
        case mockGL.VENDOR:
          return "Mock Vendor";
        case mockGL.RENDERER:
          return "Mock Renderer";
        case mockGL.VERSION:
          return "WebGL 1.0";
        case mockGL.SHADING_LANGUAGE_VERSION:
          return "WebGL GLSL ES 1.0";
        case mockGL.MAX_TEXTURE_SIZE:
          return 4096;
        case mockGL.MAX_VERTEX_ATTRIBS:
          return 16;
        case mockGL.MAX_FRAGMENT_UNIFORM_VECTORS:
          return 256;
        case mockGL.MAX_VARYING_VECTORS:
          return 8;
        default:
          return null;
      }
    });
    mockGL.getSupportedExtensions.mockReturnValue([
      "EXT_texture_filter_anisotropic",
    ]);
    mockGL.getExtension.mockReturnValue(null);
  });

  describe("WebGL support detection", () => {
    it("should detect WebGL support", () => {
      const info = webglDebugger.checkWebGLSupport();

      expect(info.isSupported).toBe(true);
      expect(info.contextType).toBe("webgl2");
      expect(info.debugInfo).toBeDefined();
      expect(info.debugInfo?.vendor).toBe("Mock Vendor");
    });

    it("should handle WebGL not supported", () => {
      mockCanvas.getContext.mockReturnValue(null);

      const info = webglDebugger.checkWebGLSupport();

      expect(info.isSupported).toBe(false);
      expect(info.contextType).toBe(null);
    });

    it("should collect comprehensive debug info", () => {
      const info = webglDebugger.checkWebGLSupport();

      expect(info.debugInfo).toEqual({
        vendor: "Mock Vendor",
        renderer: "Mock Renderer",
        version: "WebGL 1.0",
        shadingLanguageVersion: "WebGL GLSL ES 1.0",
        extensions: ["EXT_texture_filter_anisotropic"],
        maxTextureSize: 4096,
        maxVertexAttribs: 16,
        maxFragmentUniforms: 256,
        maxVaryingVectors: 8,
      });
    });
  });

  describe("shader compilation", () => {
    const mockShader = {} as WebGLShader;
    const shaderSource =
      "precision mediump float; void main() { gl_FragColor = vec4(1.0); }";

    beforeEach(() => {
      mockGL.createShader.mockReturnValue(mockShader);
      mockGL.getShaderParameter.mockReturnValue(true);
    });

    it("should compile shader successfully", () => {
      const result = webglDebugger.compileShader(
        mockGL,
        shaderSource,
        mockGL.FRAGMENT_SHADER,
        "TestShader"
      );

      expect(result.success).toBe(true);
      expect(result.shader).toBe(mockShader);
      expect(result.compilationTime).toBeGreaterThan(0);
      expect(mockGL.createShader).toHaveBeenCalledWith(mockGL.FRAGMENT_SHADER);
      expect(mockGL.shaderSource).toHaveBeenCalledWith(
        mockShader,
        shaderSource
      );
      expect(mockGL.compileShader).toHaveBeenCalledWith(mockShader);
    });

    it("should handle shader compilation failure", () => {
      mockGL.getShaderParameter.mockReturnValue(false);
      mockGL.getShaderInfoLog.mockReturnValue("Compilation error");

      const result = webglDebugger.compileShader(
        mockGL,
        shaderSource,
        mockGL.FRAGMENT_SHADER,
        "FailingShader"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Compilation error");
      expect(result.shader).toBeUndefined();
      expect(mockGL.deleteShader).toHaveBeenCalledWith(mockShader);
    });

    it("should handle shader creation failure", () => {
      mockGL.createShader.mockReturnValue(null);

      const result = webglDebugger.compileShader(
        mockGL,
        shaderSource,
        mockGL.FRAGMENT_SHADER
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to create shader object");
    });

    it("should cache compiled shaders", () => {
      // First compilation
      const result1 = webglDebugger.compileShader(
        mockGL,
        shaderSource,
        mockGL.FRAGMENT_SHADER,
        "CachedShader"
      );

      // Second compilation with same source
      const result2 = webglDebugger.compileShader(
        mockGL,
        shaderSource,
        mockGL.FRAGMENT_SHADER,
        "CachedShader"
      );

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(mockGL.createShader).toHaveBeenCalledTimes(1); // Only called once due to caching
    });
  });

  describe("program validation", () => {
    const mockProgram = {} as WebGLProgram;

    it("should validate program successfully", () => {
      mockGL.getProgramParameter.mockReturnValue(true);

      const result = webglDebugger.validateShaderProgram(
        mockGL,
        mockProgram,
        "TestProgram"
      );

      expect(result).toBe(true);
      expect(mockGL.validateProgram).toHaveBeenCalledWith(mockProgram);
      expect(mockGL.getProgramParameter).toHaveBeenCalledWith(
        mockProgram,
        mockGL.VALIDATE_STATUS
      );
    });

    it("should handle program validation failure", () => {
      mockGL.getProgramParameter.mockReturnValue(false);
      mockGL.getProgramInfoLog.mockReturnValue("Validation error");

      const result = webglDebugger.validateShaderProgram(
        mockGL,
        mockProgram,
        "FailingProgram"
      );

      expect(result).toBe(false);
    });
  });

  describe("context loss handling", () => {
    it("should set up context loss event handlers", () => {
      const onLoss = jest.fn();
      const onRestore = jest.fn();

      webglDebugger.setupContextLossHandling(mockCanvas, onLoss, onRestore);

      expect(mockCanvas.addEventListener).toHaveBeenCalledWith(
        "webglcontextlost",
        expect.any(Function)
      );
      expect(mockCanvas.addEventListener).toHaveBeenCalledWith(
        "webglcontextrestored",
        expect.any(Function)
      );
    });

    it("should handle context loss events", () => {
      const onLoss = jest.fn();
      let contextLostHandler: (event: Event) => void;

      mockCanvas.addEventListener.mockImplementation((event, handler) => {
        if (event === "webglcontextlost") {
          contextLostHandler = handler;
        }
      });

      webglDebugger.setupContextLossHandling(mockCanvas, onLoss);

      // Simulate context loss
      const mockEvent = { preventDefault: jest.fn() } as any;
      contextLostHandler!(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(onLoss).toHaveBeenCalled();
    });
  });

  describe("error checking", () => {
    it("should detect no errors", () => {
      mockGL.getError.mockReturnValue(mockGL.NO_ERROR);

      const result = webglDebugger.checkGLError(mockGL, "test operation");

      expect(result).toBe(true);
      expect(mockGL.getError).toHaveBeenCalled();
    });

    it("should detect and report errors", () => {
      mockGL.getError.mockReturnValue(mockGL.INVALID_ENUM);

      const result = webglDebugger.checkGLError(mockGL, "test operation");

      expect(result).toBe(false);
    });

    it("should handle unknown error codes", () => {
      mockGL.getError.mockReturnValue(9999);

      const result = webglDebugger.checkGLError(mockGL);

      expect(result).toBe(false);
    });
  });

  describe("context tracking", () => {
    it("should track and untrack contexts", () => {
      const initialStats = webglDebugger.getDebugStats();
      const initialCount = initialStats.activeContexts;

      webglDebugger.trackContext(mockGL);
      let stats = webglDebugger.getDebugStats();
      expect(stats.activeContexts).toBe(initialCount + 1);

      webglDebugger.untrackContext(mockGL);
      stats = webglDebugger.getDebugStats();
      expect(stats.activeContexts).toBe(initialCount);
    });
  });

  describe("debug statistics", () => {
    it("should provide comprehensive debug stats", () => {
      const stats = webglDebugger.getDebugStats();

      expect(stats).toHaveProperty("contextLossCount");
      expect(stats).toHaveProperty("contextRestoreCount");
      expect(stats).toHaveProperty("activeContexts");
      expect(stats).toHaveProperty("cachedShaders");
      expect(typeof stats.contextLossCount).toBe("number");
      expect(typeof stats.activeContexts).toBe("number");
    });
  });

  describe("shader cache management", () => {
    it("should clear shader cache", () => {
      // Compile a shader to populate cache
      webglDebugger.compileShader(mockGL, "test", mockGL.FRAGMENT_SHADER);

      let stats = webglDebugger.getDebugStats();
      expect(stats.cachedShaders).toBeGreaterThan(0);

      webglDebugger.clearShaderCache();

      stats = webglDebugger.getDebugStats();
      expect(stats.cachedShaders).toBe(0);
    });
  });

  describe("debug info dumping", () => {
    it("should dump debug info to console", () => {
      const consoleSpy = jest.spyOn(console, "group").mockImplementation();
      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
      const consoleGroupEndSpy = jest
        .spyOn(console, "groupEnd")
        .mockImplementation();

      webglDebugger.dumpDebugInfo();

      expect(consoleSpy).toHaveBeenCalledWith("WebGL Debug Information");
      expect(consoleLogSpy).toHaveBeenCalledTimes(3);
      expect(consoleGroupEndSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      consoleLogSpy.mockRestore();
      consoleGroupEndSpy.mockRestore();
    });
  });
});
