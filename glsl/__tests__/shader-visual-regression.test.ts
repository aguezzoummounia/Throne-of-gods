/**
 * Visual regression tests for shader variants
 * Tests shader output consistency and visual quality
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { shaderVariants } from "../ripple-shader-variants";

// Mock WebGL context for visual testing
const createMockWebGLContext = () => {
  const mockTexture = {} as WebGLTexture;
  const mockFramebuffer = {} as WebGLFramebuffer;
  const mockRenderbuffer = {} as WebGLRenderbuffer;

  return {
    // Constants
    TEXTURE_2D: 3553,
    FRAMEBUFFER: 36160,
    RENDERBUFFER: 36161,
    COLOR_ATTACHMENT0: 36064,
    DEPTH_ATTACHMENT: 36096,
    RGBA: 6408,
    UNSIGNED_BYTE: 5121,
    NEAREST: 9728,
    CLAMP_TO_EDGE: 33071,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_MAG_FILTER: 10240,
    FRAMEBUFFER_COMPLETE: 36053,

    // Texture operations
    createTexture: vi.fn().mockReturnValue(mockTexture),
    bindTexture: vi.fn(),
    texImage2D: vi.fn(),
    texParameteri: vi.fn(),

    // Framebuffer operations
    createFramebuffer: vi.fn().mockReturnValue(mockFramebuffer),
    createRenderbuffer: vi.fn().mockReturnValue(mockRenderbuffer),
    bindFramebuffer: vi.fn(),
    bindRenderbuffer: vi.fn(),
    renderbufferStorage: vi.fn(),
    framebufferTexture2D: vi.fn(),
    framebufferRenderbuffer: vi.fn(),
    checkFramebufferStatus: vi.fn().mockReturnValue(36053), // FRAMEBUFFER_COMPLETE

    // Rendering
    viewport: vi.fn(),
    clear: vi.fn(),
    clearColor: vi.fn(),
    drawArrays: vi.fn(),
    readPixels: vi.fn(),

    // Cleanup
    deleteTexture: vi.fn(),
    deleteFramebuffer: vi.fn(),
    deleteRenderbuffer: vi.fn(),

    // Canvas properties
    canvas: {
      width: 256,
      height: 256,
    },
  } as unknown as WebGLRenderingContext;
};

describe("Shader Visual Regression Tests", () => {
  let mockGL: WebGLRenderingContext;

  beforeEach(() => {
    mockGL = createMockWebGLContext();
  });

  describe("Shader Output Consistency", () => {
    it("should produce consistent vertex shader output across variants", () => {
      const vertexShaders = Object.values(shaderVariants).map((v) => v.vertex);
      const uniqueVertexShaders = [...new Set(vertexShaders)];

      // All variants should use the same vertex shader
      expect(uniqueVertexShaders).toHaveLength(1);

      // Vertex shader should have proper structure
      const vertexShader = uniqueVertexShaders[0];
      expect(vertexShader).toContain("varying vec2 vUv");
      expect(vertexShader).toContain("gl_Position");
      expect(vertexShader).toContain("projectionMatrix");
      expect(vertexShader).toContain("modelViewMatrix");
    });

    it("should have proper fragment shader structure for all variants", () => {
      Object.entries(shaderVariants).forEach(([tier, variant]) => {
        const fragment = variant.fragment;

        // Basic structure checks
        expect(fragment).toContain("uniform sampler2D uTexture");
        expect(fragment).toContain("uniform float uTime");
        expect(fragment).toContain("varying vec2 vUv");
        expect(fragment).toContain("void main()");
        expect(fragment).toContain("gl_FragColor");

        // Should have texture sampling
        expect(fragment).toContain("texture2D(uTexture");

        // Should have time-based animation
        expect(fragment).toContain("uTime");
      });
    });

    it("should have appropriate complexity reduction across tiers", () => {
      const highFragment = shaderVariants.high.fragment;
      const mediumFragment = shaderVariants.medium.fragment;
      const lowFragment = shaderVariants.low.fragment;

      // High complexity should have the most features
      expect(highFragment).toContain("uImageAspect");
      expect(highFragment).toContain("uPlaneAspect");
      expect(highFragment).toContain("PADDING");

      // Medium should have some optimizations
      expect(mediumFragment).toContain("any(lessThan");
      expect(mediumFragment).toContain("any(greaterThan");

      // Low should be most simplified
      expect(lowFragment).not.toContain("uImageAspect");
      expect(lowFragment).not.toContain("uPlaneAspect");
      expect(lowFragment).toContain("sin(");
      expect(lowFragment).toContain("exp(");
    });
  });

  describe("Shader Constants and Parameters", () => {
    it("should have appropriate animation speed constants", () => {
      const highSpeed = extractConstant(shaderVariants.high.fragment, "SPEED");
      const mediumSpeed = extractConstant(
        shaderVariants.medium.fragment,
        "SPEED"
      );
      const lowSpeed = extractConstant(shaderVariants.low.fragment, "SPEED");

      expect(highSpeed).toBe("0.4");
      expect(mediumSpeed).toBe("0.5");
      expect(lowSpeed).toBe("0.6");
    });

    it("should have appropriate amplitude constants", () => {
      const highAmplitude = extractConstant(
        shaderVariants.high.fragment,
        "AMPLITUDE"
      );
      const mediumAmplitude = extractConstant(
        shaderVariants.medium.fragment,
        "AMPLITUDE"
      );
      const lowAmplitude = extractConstant(
        shaderVariants.low.fragment,
        "AMPLITUDE"
      );

      expect(highAmplitude).toBe("0.021");
      expect(mediumAmplitude).toBe("0.015");
      expect(lowAmplitude).toBe("0.01");
    });

    it("should have appropriate wave width constants where applicable", () => {
      const highWaveWidth = extractConstant(
        shaderVariants.high.fragment,
        "WAVE_WIDTH"
      );
      const mediumWaveWidth = extractConstant(
        shaderVariants.medium.fragment,
        "WAVE_WIDTH"
      );

      expect(highWaveWidth).toBe("0.15");
      expect(mediumWaveWidth).toBe("0.2");

      // Low complexity doesn't use WAVE_WIDTH
      expect(shaderVariants.low.fragment).not.toContain("WAVE_WIDTH");
    });
  });

  describe("Shader Compilation Validation", () => {
    it("should have valid GLSL syntax for all variants", () => {
      Object.entries(shaderVariants).forEach(([tier, variant]) => {
        // Check for common GLSL syntax errors
        expect(variant.vertex).not.toContain(";;"); // Double semicolons
        expect(variant.fragment).not.toContain(";;");

        // Check for proper function definitions
        expect(variant.vertex).toMatch(/void\s+main\s*\(\s*\)\s*{/);
        expect(variant.fragment).toMatch(/void\s+main\s*\(\s*\)\s*{/);

        // Check for balanced braces
        const vertexBraces = countBraces(variant.vertex);
        const fragmentBraces = countBraces(variant.fragment);

        expect(vertexBraces.open).toBe(vertexBraces.close);
        expect(fragmentBraces.open).toBe(fragmentBraces.close);
      });
    });

    it("should have proper uniform declarations", () => {
      Object.entries(shaderVariants).forEach(([tier, variant]) => {
        const fragment = variant.fragment;

        // Check uniform syntax
        const uniformMatches = fragment.match(/uniform\s+\w+\s+\w+;/g);
        expect(uniformMatches).toBeTruthy();

        if (uniformMatches) {
          uniformMatches.forEach((uniform) => {
            expect(uniform).toMatch(
              /uniform\s+(sampler2D|float|vec2|vec3|vec4)\s+\w+;/
            );
          });
        }
      });
    });

    it("should have proper varying declarations", () => {
      Object.entries(shaderVariants).forEach(([tier, variant]) => {
        // Vertex shader should declare varyings
        expect(variant.vertex).toContain("varying vec2 vUv");

        // Fragment shader should use varyings
        expect(variant.fragment).toContain("varying vec2 vUv");
      });
    });
  });

  describe("Performance Characteristics", () => {
    it("should have decreasing instruction complexity", () => {
      const highInstructions = countInstructions(shaderVariants.high.fragment);
      const mediumInstructions = countInstructions(
        shaderVariants.medium.fragment
      );
      const lowInstructions = countInstructions(shaderVariants.low.fragment);

      // Generally, higher tiers should have more instructions
      expect(highInstructions.total).toBeGreaterThan(lowInstructions.total);
    });

    it("should minimize expensive operations in lower tiers", () => {
      const highFragment = shaderVariants.high.fragment;
      const mediumFragment = shaderVariants.medium.fragment;
      const lowFragment = shaderVariants.low.fragment;

      // Count expensive operations
      const highSmoothsteps = (highFragment.match(/smoothstep/g) || []).length;
      const mediumSmoothsteps = (mediumFragment.match(/smoothstep/g) || [])
        .length;
      const lowSmoothsteps = (lowFragment.match(/smoothstep/g) || []).length;

      // Lower tiers should generally have fewer expensive operations
      expect(highSmoothsteps).toBeGreaterThanOrEqual(mediumSmoothsteps);
      expect(mediumSmoothsteps).toBeGreaterThanOrEqual(lowSmoothsteps);
    });

    it("should use appropriate precision for mobile optimization", () => {
      // All shaders should avoid unnecessary high precision
      Object.values(shaderVariants).forEach((variant) => {
        // Should not use highp unless necessary
        expect(variant.fragment).not.toContain("highp");

        // Should use appropriate vector operations
        expect(variant.fragment).toMatch(/vec[234]/);
      });
    });
  });

  describe("Visual Quality Validation", () => {
    it("should maintain ripple effect concept across all variants", () => {
      Object.entries(shaderVariants).forEach(([tier, variant]) => {
        const fragment = variant.fragment;

        // Should have some form of distance calculation
        expect(fragment).toMatch(/length\s*\(/);

        // Should have time-based animation
        expect(fragment).toContain("uTime");

        // Should modify texture coordinates or color
        expect(fragment).toMatch(/(texture2D|gl_FragColor)/);
      });
    });

    it("should handle edge cases properly", () => {
      Object.entries(shaderVariants).forEach(([tier, variant]) => {
        const fragment = variant.fragment;

        // Should handle division by zero or similar edge cases
        if (fragment.includes("normalize(")) {
          // Should check for zero length before normalize
          expect(fragment).toMatch(/(len\s*[>!=]=?\s*0|length.*[>!=]=?\s*0)/);
        }
      });
    });
  });
});

// Helper functions for shader analysis
function extractConstant(
  shaderCode: string,
  constantName: string
): string | null {
  const regex = new RegExp(
    `const\\s+float\\s+${constantName}\\s*=\\s*([0-9.]+)`,
    "i"
  );
  const match = shaderCode.match(regex);
  return match ? match[1] : null;
}

function countBraces(code: string): { open: number; close: number } {
  const open = (code.match(/{/g) || []).length;
  const close = (code.match(/}/g) || []).length;
  return { open, close };
}

function countInstructions(shaderCode: string): {
  total: number;
  arithmetic: number;
  texture: number;
  control: number;
} {
  const arithmetic = (shaderCode.match(/[+\-*/=]/g) || []).length;
  const texture = (shaderCode.match(/texture2D/g) || []).length;
  const control = (shaderCode.match(/(if|for|while)/g) || []).length;

  return {
    total: arithmetic + texture + control,
    arithmetic,
    texture,
    control,
  };
}
