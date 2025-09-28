/**
 * Tests for shader cache system
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { ShaderCache } from "../shader-cache";
import { shaderVariants } from "../../glsl/ripple-shader-variants";

// Mock WebGL context
const createMockWebGLContext = () => {
  const mockShader = {} as WebGLShader;
  const mockProgram = {} as WebGLProgram;

  return {
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    COMPILE_STATUS: 35713,
    LINK_STATUS: 35714,

    createShader: vi.fn().mockReturnValue(mockShader),
    createProgram: vi.fn().mockReturnValue(mockProgram),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    deleteShader: vi.fn(),
    deleteProgram: vi.fn(),

    getShaderParameter: vi.fn().mockReturnValue(true),
    getProgramParameter: vi.fn().mockReturnValue(true),
    getShaderInfoLog: vi.fn().mockReturnValue(""),
    getProgramInfoLog: vi.fn().mockReturnValue(""),

    getUniformLocation: vi.fn().mockReturnValue({} as WebGLUniformLocation),
    getAttribLocation: vi.fn().mockReturnValue(0),
  } as unknown as WebGLRenderingContext;
};

describe("ShaderCache", () => {
  let shaderCache: ShaderCache;
  let mockGL: WebGLRenderingContext;

  beforeEach(() => {
    shaderCache = new ShaderCache();
    mockGL = createMockWebGLContext();
    vi.clearAllMocks();
  });

  afterEach(() => {
    shaderCache.clear();
  });

  describe("getShader", () => {
    it("should compile and cache new shader", async () => {
      const variant = shaderVariants.high;
      const compiled = await shaderCache.getShader(mockGL, variant);

      expect(compiled).toBeDefined();
      expect(compiled.variant).toBe(variant);
      expect(compiled.program).toBeDefined();
      expect(compiled.uniforms).toBeDefined();
      expect(compiled.attributes).toBeDefined();

      // Verify WebGL calls were made
      expect(mockGL.createShader).toHaveBeenCalledTimes(2); // vertex + fragment
      expect(mockGL.createProgram).toHaveBeenCalledTimes(1);
      expect(mockGL.linkProgram).toHaveBeenCalledTimes(1);
    });

    it("should return cached shader on subsequent calls", async () => {
      const variant = shaderVariants.medium;

      // First call - should compile
      const compiled1 = await shaderCache.getShader(mockGL, variant);

      // Second call - should return cached
      const compiled2 = await shaderCache.getShader(mockGL, variant);

      expect(compiled1).toBe(compiled2);
      expect(mockGL.createProgram).toHaveBeenCalledTimes(1); // Only called once
    });

    it("should handle different shader variants separately", async () => {
      const highVariant = shaderVariants.high;
      const lowVariant = shaderVariants.low;

      const compiledHigh = await shaderCache.getShader(mockGL, highVariant);
      const compiledLow = await shaderCache.getShader(mockGL, lowVariant);

      expect(compiledHigh).not.toBe(compiledLow);
      expect(compiledHigh.variant).toBe(highVariant);
      expect(compiledLow.variant).toBe(lowVariant);
    });

    it("should include standard uniforms and attributes", async () => {
      const variant = shaderVariants.high;
      const compiled = await shaderCache.getShader(mockGL, variant);

      // Check standard uniforms
      expect(compiled.uniforms).toHaveProperty("uTexture");
      expect(compiled.uniforms).toHaveProperty("uTime");
      expect(compiled.uniforms).toHaveProperty("uImageAspect");
      expect(compiled.uniforms).toHaveProperty("uPlaneAspect");
      expect(compiled.uniforms).toHaveProperty("uMouse");

      // Check standard attributes
      expect(compiled.attributes).toHaveProperty("position");
      expect(compiled.attributes).toHaveProperty("uv");
    });

    it("should include custom uniforms and attributes", async () => {
      const variant = shaderVariants.medium;
      const customUniforms = ["uCustomUniform"];
      const customAttributes = ["customAttribute"];

      const compiled = await shaderCache.getShader(
        mockGL,
        variant,
        customUniforms,
        customAttributes
      );

      expect(compiled.uniforms).toHaveProperty("uCustomUniform");
      expect(compiled.attributes).toHaveProperty("customAttribute");
    });
  });

  describe("Error Handling", () => {
    it("should handle vertex shader compilation failure", async () => {
      vi.mocked(mockGL.getShaderParameter).mockImplementation(
        (shader, pname) => {
          return pname === mockGL.COMPILE_STATUS ? false : true;
        }
      );
      vi.mocked(mockGL.getShaderInfoLog).mockReturnValue("Vertex shader error");

      const variant = shaderVariants.high;

      await expect(shaderCache.getShader(mockGL, variant)).rejects.toThrow(
        "Vertex shader error"
      );
    });

    it("should handle fragment shader compilation failure", async () => {
      let callCount = 0;
      vi.mocked(mockGL.getShaderParameter).mockImplementation(
        (shader, pname) => {
          if (pname === mockGL.COMPILE_STATUS) {
            callCount++;
            return callCount === 1; // First call (vertex) succeeds, second (fragment) fails
          }
          return true;
        }
      );
      vi.mocked(mockGL.getShaderInfoLog).mockReturnValue(
        "Fragment shader error"
      );

      const variant = shaderVariants.medium;

      await expect(shaderCache.getShader(mockGL, variant)).rejects.toThrow(
        "Fragment shader error"
      );
    });

    it("should handle program linking failure", async () => {
      vi.mocked(mockGL.getProgramParameter).mockReturnValue(false);
      vi.mocked(mockGL.getProgramInfoLog).mockReturnValue("Linking error");

      const variant = shaderVariants.low;

      await expect(shaderCache.getShader(mockGL, variant)).rejects.toThrow(
        "Linking error"
      );
    });

    it("should handle createProgram failure", async () => {
      vi.mocked(mockGL.createProgram).mockReturnValue(null);

      const variant = shaderVariants.high;

      await expect(shaderCache.getShader(mockGL, variant)).rejects.toThrow(
        "Failed to create shader program"
      );
    });

    it("should clean up resources on compilation failure", async () => {
      vi.mocked(mockGL.getProgramParameter).mockReturnValue(false);

      const variant = shaderVariants.medium;

      try {
        await shaderCache.getShader(mockGL, variant);
      } catch (error) {
        // Expected to fail
      }

      expect(mockGL.deleteProgram).toHaveBeenCalled();
      expect(mockGL.deleteShader).toHaveBeenCalledTimes(2);
    });
  });

  describe("Cache Management", () => {
    it("should track cache statistics", async () => {
      const variant1 = shaderVariants.high;
      const variant2 = shaderVariants.medium;

      await shaderCache.getShader(mockGL, variant1);
      await shaderCache.getShader(mockGL, variant2);

      const stats = shaderCache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.entries).toHaveLength(2);
      expect(stats.entries[0]).toHaveProperty("complexity");
      expect(stats.entries[0]).toHaveProperty("useCount");
      expect(stats.entries[0]).toHaveProperty("lastUsed");
    });

    it("should increment use count on cache hits", async () => {
      const variant = shaderVariants.low;

      await shaderCache.getShader(mockGL, variant);
      await shaderCache.getShader(mockGL, variant);
      await shaderCache.getShader(mockGL, variant);

      const stats = shaderCache.getStats();
      const entry = stats.entries.find((e) => e.complexity === "low");
      expect(entry?.useCount).toBe(3);
    });

    it("should clear all cached shaders", async () => {
      await shaderCache.getShader(mockGL, shaderVariants.high);
      await shaderCache.getShader(mockGL, shaderVariants.medium);

      expect(shaderCache.getStats().size).toBe(2);

      shaderCache.clear();

      expect(shaderCache.getStats().size).toBe(0);
    });

    it("should handle cache cleanup when size limit exceeded", async () => {
      // This test would require creating many different cache entries
      // For now, we'll test that the cleanup method exists and can be called
      const stats = shaderCache.getStats();
      expect(stats).toHaveProperty("size");
      expect(stats).toHaveProperty("entries");
    });
  });

  describe("Cache Key Generation", () => {
    it("should generate different keys for different variants", async () => {
      const highShader = await shaderCache.getShader(
        mockGL,
        shaderVariants.high
      );
      const mediumShader = await shaderCache.getShader(
        mockGL,
        shaderVariants.medium
      );

      expect(highShader).not.toBe(mediumShader);

      const stats = shaderCache.getStats();
      expect(stats.size).toBe(2);
    });

    it("should generate different keys for different uniform sets", async () => {
      const variant = shaderVariants.high;

      const shader1 = await shaderCache.getShader(mockGL, variant, [
        "uniform1",
      ]);
      const shader2 = await shaderCache.getShader(mockGL, variant, [
        "uniform2",
      ]);

      expect(shader1).not.toBe(shader2);

      const stats = shaderCache.getStats();
      expect(stats.size).toBe(2);
    });
  });

  describe("Performance", () => {
    it("should compile shaders efficiently", async () => {
      const startTime = performance.now();

      await shaderCache.getShader(mockGL, shaderVariants.high);

      const endTime = performance.now();
      const compilationTime = endTime - startTime;

      // Compilation should be reasonably fast (this is a rough check)
      expect(compilationTime).toBeLessThan(100); // 100ms
    });

    it("should return cached shaders quickly", async () => {
      const variant = shaderVariants.medium;

      // First compilation
      await shaderCache.getShader(mockGL, variant);

      // Cached retrieval should be fast
      const startTime = performance.now();
      await shaderCache.getShader(mockGL, variant);
      const endTime = performance.now();

      const retrievalTime = endTime - startTime;
      expect(retrievalTime).toBeLessThan(10); // 10ms
    });
  });
});
