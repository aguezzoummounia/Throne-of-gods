import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RippleImageWithResourceManager } from "../ripple-image-with-resource-manager";

// Mock the ResourceManager and hook
vi.mock("../../lib/resource-manager", () => ({
  ResourceManager: vi.fn().mockImplementation(() => ({
    registerTexture: vi.fn(),
    registerBuffer: vi.fn(),
    registerProgram: vi.fn(),
    addEventListener: vi.fn(),
    updateRenderState: vi.fn(),
    dispose: vi.fn(),
  })),
}));

vi.mock("../../hooks/useResourceManager", () => ({
  useResourceManager: vi.fn(() => ({
    resourceManager: {
      registerTexture: vi.fn(),
      registerBuffer: vi.fn(),
      registerProgram: vi.fn(),
      addEventListener: vi.fn(),
      updateRenderState: vi.fn(),
    },
    isRenderingPaused: false,
    memoryUsage: 50,
    pauseRendering: vi.fn(),
    resumeRendering: vi.fn(),
  })),
}));

// Mock WebGL context
const mockWebGLContext = {
  createTexture: vi.fn(() => ({})),
  createBuffer: vi.fn(() => ({})),
  createShader: vi.fn(() => ({})),
  createProgram: vi.fn(() => ({})),
  bindTexture: vi.fn(),
  texImage2D: vi.fn(),
  texParameteri: vi.fn(),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  clearColor: vi.fn(),
  clear: vi.fn(),
  TEXTURE_2D: 0x0de1,
  RGBA: 0x1908,
  UNSIGNED_BYTE: 0x1401,
  TEXTURE_MIN_FILTER: 0x2801,
  TEXTURE_MAG_FILTER: 0x2800,
  LINEAR: 0x2601,
  ARRAY_BUFFER: 0x8892,
  STATIC_DRAW: 0x88e4,
  VERTEX_SHADER: 0x8b31,
  FRAGMENT_SHADER: 0x8b30,
  COLOR_BUFFER_BIT: 0x00004000,
};

describe("RippleImageWithResourceManager", () => {
  beforeEach(() => {
    // Mock canvas.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockWebGLContext);

    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((callback) => {
      setTimeout(callback, 16);
      return 1;
    });

    global.cancelAnimationFrame = vi.fn();

    // Mock Image constructor
    global.Image = class {
      onload: (() => void) | null = null;
      src = "";

      constructor() {
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }
    } as any;
  });

  it("should render canvas and fallback image", () => {
    render(
      <RippleImageWithResourceManager src="/test-image.jpg" alt="Test image" />
    );

    const canvas = screen.getByRole("img", { hidden: true });
    expect(canvas).toBeInTheDocument();

    const fallbackImage = screen.getByAltText("Test image");
    expect(fallbackImage).toBeInTheDocument();
  });

  it("should initialize WebGL context and register resources", () => {
    render(
      <RippleImageWithResourceManager src="/test-image.jpg" alt="Test image" />
    );

    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith(
      "webgl"
    );
    expect(mockWebGLContext.createTexture).toHaveBeenCalled();
    expect(mockWebGLContext.createBuffer).toHaveBeenCalled();
  });

  it("should handle WebGL not supported gracefully", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <RippleImageWithResourceManager src="/test-image.jpg" alt="Test image" />
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "WebGL not supported, falling back to CSS animation"
    );

    consoleSpy.mockRestore();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <RippleImageWithResourceManager
        src="/test-image.jpg"
        alt="Test image"
        className="custom-class"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should show debug info in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(
      <RippleImageWithResourceManager src="/test-image.jpg" alt="Test image" />
    );

    expect(screen.getByText(/Memory:/)).toBeInTheDocument();
    expect(screen.getByText(/Paused:/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it("should not show debug info in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    render(
      <RippleImageWithResourceManager src="/test-image.jpg" alt="Test image" />
    );

    expect(screen.queryByText(/Memory:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Paused:/)).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});
