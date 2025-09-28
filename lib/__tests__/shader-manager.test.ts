/**
 * Tests for shader manager
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  ShaderManager,
  createShaderManager,
  getOptimalShaderVariant,
} from "../shader-manager";
import { DeviceCapabilities } from "../../hooks/useDeviceCapabilities";
import { shaderVariants } from "../../glsl/ripple-shader-variants";

// Mock the shader cache
vi.mock("../shader-cache", () => ({
  shaderCache: {
    getShader: vi.fn().mockResolvedValue({
      program: {} as WebGLProgram,
      uniforms: {},
      attributes: {},
      variant: {
        vertex: "vertex shader",
        fragment: "fragment shader",
        complexity: "high",
        description: "test shader",
      },
      compiledAt: Date.now(),
    }),
  },
}));

const createMockDeviceCapabilities = (
  overrides: Partial<DeviceCapabilities> = {}
): DeviceCapabilities => ({
  isMobile: false,
  hasWebGL: true,
  gpuTier: "high",
  maxTextureSize: 4096,
  devicePixelRatio: 1,
  screenSize: { width: 1920, height: 1080 },
  userAgent: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    browser: "chrome",
    os: "windows",
  },
  ...overrides,
});

const createMockWebGLContext = () =>
  ({
    canvas: document.createElement("canvas"),
    drawingBufferWidth: 1920,
    drawingBufferHeight: 1080,
  } as WebGLRenderingContext);

describe("ShaderManager", () => {
  let shaderManager: ShaderManager;
  let mockGL: WebGLRenderingContext;

  beforeEach(() => {
    shaderManager = new ShaderManager();
    mockGL = createMockWebGLContext();
    vi.clearAllMocks();
  });

  describe("initialize", () => {
    it("should initialize with device capabilities", async () => {
      const capabilities = createMockDeviceCapabilities();
      const config = await shaderManager.initialize(mockGL, capabilities);

      expect(config).toBeDefined();
      expect(config.variant).toBeDefined();
      expect(config.textureScale).toBeDefined();
      expect(config.renderSettings).toBeDefined();
    });

    it("should select appropriate shader variant for GPU tier", async () => {
      const highTierCapabilities = createMockDeviceCapabilities({
        gpuTier: "high",
      });
      const config = await shaderManager.initialize(
        mockGL,
        highTierCapabilities
      );

      expect(config.variant.complexity).toBe("high");
    });

    it("should configure texture scaling based on capabilities", async () => {
      const mobileCapabilities = createMockDeviceCapabilities({
        isMobile: true,
        gpuTier: "medium",
        devicePixelRatio: 2,
      });
      const config = await shaderManager.initialize(mockGL, mobileCapabilities);

      expect(config.textureScale.baseScale).toBeLessThan(1.0);
      expect(config.textureScale.quality).toBe("medium");
    });

    it("should set appropriate render settings for mobile", async () => {
      const mobileCapabilities = createMockDeviceCapabilities({
        isMobile: true,
        gpuTier: "low",
      });
      const config = await shaderManager.initialize(mockGL, mobileCapabilities);

      expect(config.renderSettings.targetFPS).toBe(30);
      expect(config.renderSettings.enableFrameSkipping).toBe(true);
      expect(config.renderSettings.pauseWhenHidden).toBe(true);
    });
  });

  describe("getCompiledShader", () => {
    it("should return compiled shader after initialization", async () => {
      const capabilities = createMockDeviceCapabilities();
      await shaderManager.initialize(mockGL, capabilities);

      const compiled = await shaderManager.getCompiledShader();
      expect(compiled).toBeDefined();
      expect(compiled.program).toBeDefined();
    });

    it("should throw error if not initialized", async () => {
      await expect(shaderManager.getCompiledShader()).rejects.toThrow(
        "Shader manager not initialized"
      );
    });
  });

  describe("updateConfiguration", () => {
    it("should update configuration with new capabilities", async () => {
      const initialCapabilities = createMockDeviceCapabilities({
        gpuTier: "high",
      });
      await shaderManager.initialize(mockGL, initialCapabilities);

      const newCapabilities = createMockDeviceCapabilities({ gpuTier: "low" });
      const newConfig = await shaderManager.updateConfiguration(
        newCapabilities
      );

      expect(newConfig.variant.complexity).toBe("low");
    });

    it("should recompile shader when variant changes", async () => {
      const highCapabilities = createMockDeviceCapabilities({
        gpuTier: "high",
      });
      await shaderManager.initialize(mockGL, highCapabilities);

      const lowCapabilities = createMockDeviceCapabilities({ gpuTier: "low" });
      const newConfig = await shaderManager.updateConfiguration(
        lowCapabilities
      );

      expect(newConfig.variant.complexity).toBe("low");
    });

    it("should not recompile if variant unchanged", async () => {
      const capabilities = createMockDeviceCapabilities({ gpuTier: "medium" });
      await shaderManager.initialize(mockGL, capabilities);

      // Update with same GPU tier but different other properties
      const updatedCapabilities = createMockDeviceCapabilities({
        gpuTier: "medium",
        devicePixelRatio: 2,
      });

      const newConfig = await shaderManager.updateConfiguration(
        updatedCapabilities
      );
      expect(newConfig.variant.complexity).toBe("medium");
    });
  });

  describe("shouldUseCSSFallback", () => {
    it("should return true when WebGL is not supported", () => {
      const capabilities = createMockDeviceCapabilities({ hasWebGL: false });
      const shouldFallback = shaderManager.shouldUseCSSFallback(capabilities);

      expect(shouldFallback).toBe(true);
    });

    it("should return true for low-tier mobile devices", () => {
      const capabilities = createMockDeviceCapabilities({
        gpuTier: "low",
        isMobile: true,
      });
      const shouldFallback = shaderManager.shouldUseCSSFallback(capabilities);

      expect(shouldFallback).toBe(true);
    });

    it("should return false for capable devices", () => {
      const capabilities = createMockDeviceCapabilities({
        hasWebGL: true,
        gpuTier: "high",
      });
      const shouldFallback = shaderManager.shouldUseCSSFallback(capabilities);

      expect(shouldFallback).toBe(false);
    });

    it("should return false for medium-tier desktop devices", () => {
      const capabilities = createMockDeviceCapabilities({
        hasWebGL: true,
        gpuTier: "medium",
        isMobile: false,
      });
      const shouldFallback = shaderManager.shouldUseCSSFallback(capabilities);

      expect(shouldFallback).toBe(false);
    });
  });

  describe("getPerformanceRecommendations", () => {
    it("should provide recommendations for mobile devices", () => {
      const capabilities = createMockDeviceCapabilities({ isMobile: true });
      const recommendations =
        shaderManager.getPerformanceRecommendations(capabilities);

      expect(recommendations.recommendations).toContain(
        "Mobile device detected - using optimized settings"
      );
    });

    it("should recommend CSS fallback for low GPU tier", () => {
      const capabilities = createMockDeviceCapabilities({ gpuTier: "low" });
      const recommendations =
        shaderManager.getPerformanceRecommendations(capabilities);

      expect(recommendations.recommendations).toContain(
        "Low GPU performance - consider CSS fallback"
      );
    });

    it("should note high DPI displays", () => {
      const capabilities = createMockDeviceCapabilities({
        devicePixelRatio: 3,
      });
      const recommendations =
        shaderManager.getPerformanceRecommendations(capabilities);

      expect(recommendations.recommendations).toContain(
        "High DPI display - texture scaling applied"
      );
    });

    it("should recommend CSS fallback when WebGL not supported", () => {
      const capabilities = createMockDeviceCapabilities({ hasWebGL: false });
      const recommendations =
        shaderManager.getPerformanceRecommendations(capabilities);

      expect(recommendations.useWebGL).toBe(false);
      expect(recommendations.recommendations).toContain(
        "WebGL not supported - use CSS fallback"
      );
    });

    it("should provide correct performance metrics", () => {
      const capabilities = createMockDeviceCapabilities({
        gpuTier: "medium",
        isMobile: true,
      });
      const recommendations =
        shaderManager.getPerformanceRecommendations(capabilities);

      expect(recommendations.shaderComplexity).toBe("medium");
      expect(recommendations.targetFPS).toBe(30); // Mobile medium tier
      expect(recommendations.textureScale).toBeLessThan(1.0);
    });
  });

  describe("Render Settings Configuration", () => {
    it("should configure high performance settings for desktop high tier", async () => {
      const capabilities = createMockDeviceCapabilities({
        gpuTier: "high",
        isMobile: false,
      });
      const config = await shaderManager.initialize(mockGL, capabilities);

      expect(config.renderSettings.targetFPS).toBe(60);
      expect(config.renderSettings.enableFrameSkipping).toBe(false);
      expect(config.renderSettings.maxRippleDuration).toBe(2.5);
    });

    it("should configure medium performance settings for mobile high tier", async () => {
      const capabilities = createMockDeviceCapabilities({
        gpuTier: "high",
        isMobile: true,
      });
      const config = await shaderManager.initialize(mockGL, capabilities);

      expect(config.renderSettings.targetFPS).toBe(60);
      expect(config.renderSettings.enableFrameSkipping).toBe(false);
    });

    it("should configure conservative settings for low tier", async () => {
      const capabilities = createMockDeviceCapabilities({ gpuTier: "low" });
      const config = await shaderManager.initialize(mockGL, capabilities);

      expect(config.renderSettings.targetFPS).toBe(30);
      expect(config.renderSettings.enableFrameSkipping).toBe(true);
      expect(config.renderSettings.maxRippleDuration).toBe(1.5);
    });

    it("should enable frame skipping for mobile medium tier", async () => {
      const capabilities = createMockDeviceCapabilities({
        gpuTier: "medium",
        isMobile: true,
      });
      const config = await shaderManager.initialize(mockGL, capabilities);

      expect(config.renderSettings.enableFrameSkipping).toBe(true);
      expect(config.renderSettings.targetFPS).toBe(30);
    });
  });

  describe("dispose", () => {
    it("should clean up resources", async () => {
      const capabilities = createMockDeviceCapabilities();
      await shaderManager.initialize(mockGL, capabilities);

      shaderManager.dispose();

      expect(shaderManager.getCurrentConfig()).toBeNull();
    });
  });
});

describe("Utility Functions", () => {
  describe("createShaderManager", () => {
    it("should create a new shader manager instance", () => {
      const manager = createShaderManager();
      expect(manager).toBeInstanceOf(ShaderManager);
    });
  });

  describe("getOptimalShaderVariant", () => {
    it("should return high variant for high GPU tier", () => {
      const capabilities = createMockDeviceCapabilities({ gpuTier: "high" });
      const variant = getOptimalShaderVariant(capabilities);

      expect(variant.complexity).toBe("high");
    });

    it("should return medium variant for medium GPU tier", () => {
      const capabilities = createMockDeviceCapabilities({ gpuTier: "medium" });
      const variant = getOptimalShaderVariant(capabilities);

      expect(variant.complexity).toBe("medium");
    });

    it("should return low variant for low GPU tier", () => {
      const capabilities = createMockDeviceCapabilities({ gpuTier: "low" });
      const variant = getOptimalShaderVariant(capabilities);

      expect(variant.complexity).toBe("low");
    });
  });
});
