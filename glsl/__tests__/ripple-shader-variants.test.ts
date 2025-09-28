/**
 * Tests for ripple shader variants
 */

import { describe, it, expect } from "vitest";
import { shaderVariants, getShaderVariant } from "../ripple-shader-variants";

describe("Ripple Shader Variants", () => {
  describe("shaderVariants", () => {
    it("should contain all complexity levels", () => {
      expect(shaderVariants).toHaveProperty("high");
      expect(shaderVariants).toHaveProperty("medium");
      expect(shaderVariants).toHaveProperty("low");
    });

    it("should have consistent structure for all variants", () => {
      Object.values(shaderVariants).forEach((variant) => {
        expect(variant).toHaveProperty("vertex");
        expect(variant).toHaveProperty("fragment");
        expect(variant).toHaveProperty("complexity");
        expect(variant).toHaveProperty("description");

        expect(typeof variant.vertex).toBe("string");
        expect(typeof variant.fragment).toBe("string");
        expect(typeof variant.description).toBe("string");
        expect(["high", "medium", "low"]).toContain(variant.complexity);
      });
    });

    it("should have non-empty shader code", () => {
      Object.values(shaderVariants).forEach((variant) => {
        expect(variant.vertex.trim()).not.toBe("");
        expect(variant.fragment.trim()).not.toBe("");
        expect(variant.vertex).toContain("gl_Position");
        expect(variant.fragment).toContain("gl_FragColor");
      });
    });

    it("should use same vertex shader for all variants", () => {
      const vertexShaders = Object.values(shaderVariants).map((v) => v.vertex);
      const uniqueVertexShaders = [...new Set(vertexShaders)];
      expect(uniqueVertexShaders).toHaveLength(1);
    });
  });

  describe("getShaderVariant", () => {
    it("should return correct variant for each GPU tier", () => {
      expect(getShaderVariant("high")).toBe(shaderVariants.high);
      expect(getShaderVariant("medium")).toBe(shaderVariants.medium);
      expect(getShaderVariant("low")).toBe(shaderVariants.low);
    });

    it("should return variants with correct complexity", () => {
      expect(getShaderVariant("high").complexity).toBe("high");
      expect(getShaderVariant("medium").complexity).toBe("medium");
      expect(getShaderVariant("low").complexity).toBe("low");
    });
  });

  describe("Shader Code Quality", () => {
    it("high complexity shader should have full features", () => {
      const highShader = shaderVariants.high.fragment;

      // Should have aspect ratio correction
      expect(highShader).toContain("uImageAspect");
      expect(highShader).toContain("uPlaneAspect");

      // Should have mouse interaction
      expect(highShader).toContain("uMouse");

      // Should have padding
      expect(highShader).toContain("PADDING");

      // Should have smoothstep for quality
      expect(highShader).toContain("smoothstep");
    });

    it("medium complexity shader should be simplified", () => {
      const mediumShader = shaderVariants.medium.fragment;

      // Should still have basic features
      expect(mediumShader).toContain("uImageAspect");
      expect(mediumShader).toContain("uMouse");

      // Should use simplified calculations
      expect(mediumShader).toContain("any(lessThan");
      expect(mediumShader).toContain("any(greaterThan");
    });

    it("low complexity shader should be minimal", () => {
      const lowShader = shaderVariants.low.fragment;

      // Should have minimal uniforms
      expect(lowShader).toContain("uTexture");
      expect(lowShader).toContain("uTime");
      expect(lowShader).toContain("uMouse");

      // Should not have complex aspect ratio correction
      expect(lowShader).not.toContain("uImageAspect");
      expect(lowShader).not.toContain("uPlaneAspect");

      // Should use simple math functions
      expect(lowShader).toContain("sin(");
      expect(lowShader).toContain("exp(");
    });

    it("all shaders should have required uniforms", () => {
      Object.values(shaderVariants).forEach((variant) => {
        expect(variant.fragment).toContain("uniform sampler2D uTexture");
        expect(variant.fragment).toContain("uniform float uTime");
        expect(variant.fragment).toContain("varying vec2 vUv");
      });
    });

    it("all shaders should have proper GLSL syntax", () => {
      Object.values(shaderVariants).forEach((variant) => {
        // Check for proper main function
        expect(variant.vertex).toMatch(/void\s+main\s*\(\s*\)/);
        expect(variant.fragment).toMatch(/void\s+main\s*\(\s*\)/);

        // Check for proper variable declarations
        expect(variant.fragment).toMatch(/gl_FragColor\s*=/);
        expect(variant.vertex).toMatch(/gl_Position\s*=/);
      });
    });
  });

  describe("Performance Characteristics", () => {
    it("should have decreasing complexity from high to low", () => {
      const highLength = shaderVariants.high.fragment.length;
      const mediumLength = shaderVariants.medium.fragment.length;
      const lowLength = shaderVariants.low.fragment.length;

      // Generally, more complex shaders should be longer
      expect(highLength).toBeGreaterThan(lowLength);
    });

    it("should have appropriate constants for each tier", () => {
      // High complexity should have more precise values
      const highShader = shaderVariants.high.fragment;
      expect(highShader).toContain("0.021"); // AMPLITUDE

      // Medium should be balanced
      const mediumShader = shaderVariants.medium.fragment;
      expect(mediumShader).toContain("0.015"); // Reduced AMPLITUDE

      // Low should be minimal
      const lowShader = shaderVariants.low.fragment;
      expect(lowShader).toContain("0.01"); // Minimal AMPLITUDE
    });
  });
});
