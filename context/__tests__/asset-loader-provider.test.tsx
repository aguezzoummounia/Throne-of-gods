import { render, screen, waitFor } from "@testing-library/react";
import { AssetLoaderProvider, usePreloader } from "../asset-loader-provider";
import PreloadedImageRegistry from "@/lib/preloaded-image-registry";
import { useAssetLoader } from "@/hooks/useAssetLoader";

// Mock the useAssetLoader hook
jest.mock("@/hooks/useAssetLoader");
const mockUseAssetLoader = useAssetLoader as jest.MockedFunction<
  typeof useAssetLoader
>;

// Mock the constants
jest.mock("@/lib/consts", () => ({
  SOUNDS_TO_PRELOAD: [{ id: "test-sound", src: "/sounds/test.mp3" }],
}));

// Test component that uses the context
const TestComponent = () => {
  const {
    isImagePreloaded,
    isLoaded,
    progress,
    assets,
    errors,
    hasInteracted,
  } = usePreloader();

  return (
    <div>
      <div data-testid="is-loaded">{isLoaded.toString()}</div>
      <div data-testid="progress">{progress}</div>
      <div data-testid="has-interacted">{hasInteracted.toString()}</div>
      <div data-testid="errors">{errors.join(",")}</div>
      <div data-testid="image-preloaded-test">
        {isImagePreloaded("/images/test.jpg").toString()}
      </div>
      <div data-testid="image-preloaded-logo">
        {isImagePreloaded("/images/logo.png").toString()}
      </div>
      <div data-testid="sounds-count">{Object.keys(assets.sounds).length}</div>
    </div>
  );
};

describe("AssetLoaderProvider Context Enhancement", () => {
  let imageRegistry: PreloadedImageRegistry;

  beforeEach(() => {
    // Clear the registry before each test
    imageRegistry = PreloadedImageRegistry.getInstance();
    imageRegistry.clear();

    // Reset mocks
    jest.clearAllMocks();

    // Default mock implementation
    mockUseAssetLoader.mockReturnValue({
      progress: 0,
      errors: [],
      isLoaded: false,
      assets: {
        sounds: {},
      },
    });
  });

  afterEach(() => {
    imageRegistry.clear();
  });

  describe("Context Interface Extension", () => {
    it("should provide isImagePreloaded method through context", () => {
      mockUseAssetLoader.mockReturnValue({
        progress: 100,
        errors: [],
        isLoaded: true,
        assets: {
          sounds: {
            "/sounds/test.mp3": new Audio(),
          },
        },
      });

      render(
        <AssetLoaderProvider>
          <TestComponent />
        </AssetLoaderProvider>
      );

      expect(screen.getByTestId("image-preloaded-test")).toHaveTextContent(
        "false"
      );
      expect(screen.getByTestId("image-preloaded-logo")).toHaveTextContent(
        "false"
      );
    });

    it("should maintain existing context API for sounds and progress", () => {
      const mockAudio = new Audio();
      mockUseAssetLoader.mockReturnValue({
        progress: 75,
        errors: ["test error"],
        isLoaded: false,
        assets: {
          sounds: {
            "/sounds/test.mp3": mockAudio,
          },
        },
      });

      render(
        <AssetLoaderProvider>
          <TestComponent />
        </AssetLoaderProvider>
      );

      expect(screen.getByTestId("is-loaded")).toHaveTextContent("false");
      expect(screen.getByTestId("progress")).toHaveTextContent("75");
      expect(screen.getByTestId("errors")).toHaveTextContent("test error");
      expect(screen.getByTestId("sounds-count")).toHaveTextContent("1");
    });
  });

  describe("Image Registry Integration", () => {
    it("should return true for preloaded images", () => {
      // Register some images in the registry
      imageRegistry.registerPreloadedImage("/images/test.jpg");
      imageRegistry.registerPreloadedImage("/images/logo.png");

      mockUseAssetLoader.mockReturnValue({
        progress: 100,
        errors: [],
        isLoaded: true,
        assets: {
          sounds: {},
        },
      });

      render(
        <AssetLoaderProvider>
          <TestComponent />
        </AssetLoaderProvider>
      );

      expect(screen.getByTestId("image-preloaded-test")).toHaveTextContent(
        "true"
      );
      expect(screen.getByTestId("image-preloaded-logo")).toHaveTextContent(
        "true"
      );
    });

    it("should return false for non-preloaded images", () => {
      // Don't register any images
      mockUseAssetLoader.mockReturnValue({
        progress: 100,
        errors: [],
        isLoaded: true,
        assets: {
          sounds: {},
        },
      });

      render(
        <AssetLoaderProvider>
          <TestComponent />
        </AssetLoaderProvider>
      );

      expect(screen.getByTestId("image-preloaded-test")).toHaveTextContent(
        "false"
      );
      expect(screen.getByTestId("image-preloaded-logo")).toHaveTextContent(
        "false"
      );
    });

    it("should handle normalized paths correctly", () => {
      // Register image with relative path
      imageRegistry.registerPreloadedImage("images/test.jpg");

      mockUseAssetLoader.mockReturnValue({
        progress: 100,
        errors: [],
        isLoaded: true,
        assets: {
          sounds: {},
        },
      });

      const TestNormalizedPaths = () => {
        const { isImagePreloaded } = usePreloader();
        return (
          <div>
            <div data-testid="relative-path">
              {isImagePreloaded("images/test.jpg").toString()}
            </div>
            <div data-testid="absolute-path">
              {isImagePreloaded("/images/test.jpg").toString()}
            </div>
          </div>
        );
      };

      render(
        <AssetLoaderProvider>
          <TestNormalizedPaths />
        </AssetLoaderProvider>
      );

      // Both should return true due to path normalization
      expect(screen.getByTestId("relative-path")).toHaveTextContent("true");
      expect(screen.getByTestId("absolute-path")).toHaveTextContent("true");
    });
  });

  describe("Registry Lookup Functionality", () => {
    it("should expose registry lookup through isImagePreloaded method", () => {
      const testImages = [
        "/images/hero.jpg",
        "/images/about-1.png",
        "/images/about-2.png",
        "/images/logo.svg",
      ];

      // Register some images
      testImages.forEach((img) => imageRegistry.registerPreloadedImage(img));

      mockUseAssetLoader.mockReturnValue({
        progress: 100,
        errors: [],
        isLoaded: true,
        assets: {
          sounds: {},
        },
      });

      const TestMultipleImages = () => {
        const { isImagePreloaded } = usePreloader();
        return (
          <div>
            {testImages.map((img, index) => (
              <div key={img} data-testid={`image-${index}`}>
                {isImagePreloaded(img).toString()}
              </div>
            ))}
            <div data-testid="non-preloaded">
              {isImagePreloaded("/images/not-preloaded.jpg").toString()}
            </div>
          </div>
        );
      };

      render(
        <AssetLoaderProvider>
          <TestMultipleImages />
        </AssetLoaderProvider>
      );

      // All registered images should return true
      testImages.forEach((_, index) => {
        expect(screen.getByTestId(`image-${index}`)).toHaveTextContent("true");
      });

      // Non-registered image should return false
      expect(screen.getByTestId("non-preloaded")).toHaveTextContent("false");
    });

    it("should handle edge cases gracefully", () => {
      mockUseAssetLoader.mockReturnValue({
        progress: 100,
        errors: [],
        isLoaded: true,
        assets: {
          sounds: {},
        },
      });

      const TestEdgeCases = () => {
        const { isImagePreloaded } = usePreloader();
        return (
          <div>
            <div data-testid="empty-string">
              {isImagePreloaded("").toString()}
            </div>
            <div data-testid="undefined">
              {isImagePreloaded(undefined as any).toString()}
            </div>
            <div data-testid="null">
              {isImagePreloaded(null as any).toString()}
            </div>
          </div>
        );
      };

      render(
        <AssetLoaderProvider>
          <TestEdgeCases />
        </AssetLoaderProvider>
      );

      expect(screen.getByTestId("empty-string")).toHaveTextContent("false");
      expect(screen.getByTestId("undefined")).toHaveTextContent("false");
      expect(screen.getByTestId("null")).toHaveTextContent("false");
    });
  });

  describe("Backward Compatibility", () => {
    it("should maintain all existing context properties", () => {
      const mockAudio = new Audio();
      mockUseAssetLoader.mockReturnValue({
        progress: 50,
        errors: ["network error"],
        isLoaded: false,
        assets: {
          sounds: {
            "/sounds/test.mp3": mockAudio,
          },
        },
      });

      const TestBackwardCompatibility = () => {
        const context = usePreloader();

        // Test that all original properties exist
        const hasAllProperties = [
          "isLoaded",
          "progress",
          "assets",
          "errors",
          "hasInteracted",
          "isImagePreloaded", // New property
        ].every((prop) => prop in context);

        return (
          <div>
            <div data-testid="has-all-properties">
              {hasAllProperties.toString()}
            </div>
            <div data-testid="assets-structure">
              {typeof context.assets === "object" && "sounds" in context.assets
                ? "valid"
                : "invalid"}
            </div>
          </div>
        );
      };

      render(
        <AssetLoaderProvider>
          <TestBackwardCompatibility />
        </AssetLoaderProvider>
      );

      expect(screen.getByTestId("has-all-properties")).toHaveTextContent(
        "true"
      );
      expect(screen.getByTestId("assets-structure")).toHaveTextContent("valid");
    });
  });
});
