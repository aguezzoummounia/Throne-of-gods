import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PerformanceOverlay } from "../performance-overlay";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

// Mock the performance monitor hook
jest.mock("@/hooks/usePerformanceMonitor");
const mockUsePerformanceMonitor = usePerformanceMonitor as jest.MockedFunction<
  typeof usePerformanceMonitor
>;

describe("PerformanceOverlay", () => {
  const mockMetrics = {
    currentFPS: 60,
    averageFPS: 58.5,
    frameDrops: 2,
    memoryUsage: 50 * 1024 * 1024, // 50MB
    lastInteraction: Date.now() - 5000, // 5 seconds ago
  };

  const mockPerformanceMonitor = {
    metrics: mockMetrics,
    isMonitoring: true,
    startMonitoring: jest.fn(),
    stopMonitoring: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePerformanceMonitor.mockReturnValue(mockPerformanceMonitor);
  });

  describe("rendering", () => {
    it("should render when enabled", () => {
      render(<PerformanceOverlay enabled={true} />);

      expect(screen.getByText("Performance")).toBeInTheDocument();
    });

    it("should not render when disabled", () => {
      render(<PerformanceOverlay enabled={false} />);

      expect(screen.queryByText("Performance")).not.toBeInTheDocument();
    });

    it("should render in development mode by default", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      render(<PerformanceOverlay />);

      expect(screen.getByText("Performance")).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it("should not render in production mode by default", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      render(<PerformanceOverlay />);

      expect(screen.queryByText("Performance")).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("positioning", () => {
    it("should apply correct position classes", () => {
      const { rerender } = render(
        <PerformanceOverlay enabled={true} position="top-left" />
      );
      let overlay = screen.getByText("Performance").closest("div");
      expect(overlay).toHaveClass("top-4", "left-4");

      rerender(<PerformanceOverlay enabled={true} position="bottom-right" />);
      overlay = screen.getByText("Performance").closest("div");
      expect(overlay).toHaveClass("bottom-4", "right-4");
    });
  });

  describe("performance monitoring integration", () => {
    it("should start monitoring when enabled", () => {
      mockUsePerformanceMonitor.mockReturnValue({
        ...mockPerformanceMonitor,
        isMonitoring: false,
      });

      render(<PerformanceOverlay enabled={true} />);

      expect(mockPerformanceMonitor.startMonitoring).toHaveBeenCalled();
    });

    it("should stop monitoring on unmount", () => {
      const { unmount } = render(<PerformanceOverlay enabled={true} />);

      unmount();

      expect(mockPerformanceMonitor.stopMonitoring).toHaveBeenCalled();
    });

    it("should not start monitoring when already monitoring", () => {
      render(<PerformanceOverlay enabled={true} />);

      expect(mockPerformanceMonitor.startMonitoring).toHaveBeenCalledTimes(1);
    });
  });

  describe("metrics display", () => {
    beforeEach(() => {
      render(<PerformanceOverlay enabled={true} />);
      // Expand the overlay
      fireEvent.click(screen.getByText("+"));
    });

    it("should display FPS with correct color coding", () => {
      expect(screen.getByText("60.0")).toHaveClass("text-green-400"); // Good FPS
    });

    it("should display average FPS", () => {
      expect(screen.getByText("58.5")).toBeInTheDocument();
    });

    it("should display frame drops with appropriate color", () => {
      expect(screen.getByText("2")).toHaveClass("text-green-400"); // Low frame drops
    });

    it("should display memory usage in readable format", () => {
      expect(screen.getByText("50 MB")).toBeInTheDocument();
    });

    it("should display last interaction time", () => {
      expect(screen.getByText("5.0s ago")).toBeInTheDocument();
    });

    it("should display monitoring status", () => {
      expect(screen.getByText("Active")).toHaveClass("text-green-400");
    });
  });

  describe("color coding", () => {
    it("should show green for good FPS (≥55)", () => {
      mockUsePerformanceMonitor.mockReturnValue({
        ...mockPerformanceMonitor,
        metrics: { ...mockMetrics, currentFPS: 60, averageFPS: 58 },
      });

      render(<PerformanceOverlay enabled={true} />);
      fireEvent.click(screen.getByText("+"));

      expect(screen.getByText("60.0")).toHaveClass("text-green-400");
      expect(screen.getByText("58.0")).toHaveClass("text-green-400");
    });

    it("should show yellow for medium FPS (30-54)", () => {
      mockUsePerformanceMonitor.mockReturnValue({
        ...mockPerformanceMonitor,
        metrics: { ...mockMetrics, currentFPS: 45, averageFPS: 40 },
      });

      render(<PerformanceOverlay enabled={true} />);
      fireEvent.click(screen.getByText("+"));

      expect(screen.getByText("45.0")).toHaveClass("text-yellow-400");
      expect(screen.getByText("40.0")).toHaveClass("text-yellow-400");
    });

    it("should show red for poor FPS (<30)", () => {
      mockUsePerformanceMonitor.mockReturnValue({
        ...mockPerformanceMonitor,
        metrics: { ...mockMetrics, currentFPS: 25, averageFPS: 20 },
      });

      render(<PerformanceOverlay enabled={true} />);
      fireEvent.click(screen.getByText("+"));

      expect(screen.getByText("25.0")).toHaveClass("text-red-400");
      expect(screen.getByText("20.0")).toHaveClass("text-red-400");
    });

    it("should show red for high frame drops (>10)", () => {
      mockUsePerformanceMonitor.mockReturnValue({
        ...mockPerformanceMonitor,
        metrics: { ...mockMetrics, frameDrops: 15 },
      });

      render(<PerformanceOverlay enabled={true} />);
      fireEvent.click(screen.getByText("+"));

      expect(screen.getByText("15")).toHaveClass("text-red-400");
    });
  });

  describe("interaction", () => {
    it("should toggle visibility when clicking expand/collapse button", () => {
      render(<PerformanceOverlay enabled={true} />);

      // Initially collapsed
      expect(screen.queryByText("FPS:")).not.toBeInTheDocument();
      expect(screen.getByText("+")).toBeInTheDocument();

      // Expand
      fireEvent.click(screen.getByText("+"));
      expect(screen.getByText("FPS:")).toBeInTheDocument();
      expect(screen.getByText("−")).toBeInTheDocument();

      // Collapse
      fireEvent.click(screen.getByText("−"));
      expect(screen.queryByText("FPS:")).not.toBeInTheDocument();
      expect(screen.getByText("+")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle zero memory usage", () => {
      mockUsePerformanceMonitor.mockReturnValue({
        ...mockPerformanceMonitor,
        metrics: { ...mockMetrics, memoryUsage: 0 },
      });

      render(<PerformanceOverlay enabled={true} />);
      fireEvent.click(screen.getByText("+"));

      expect(screen.getByText("0 B")).toBeInTheDocument();
    });

    it("should handle no previous interaction", () => {
      mockUsePerformanceMonitor.mockReturnValue({
        ...mockPerformanceMonitor,
        metrics: { ...mockMetrics, lastInteraction: 0 },
      });

      render(<PerformanceOverlay enabled={true} />);
      fireEvent.click(screen.getByText("+"));

      expect(screen.getByText("None")).toBeInTheDocument();
    });

    it("should handle inactive monitoring status", () => {
      mockUsePerformanceMonitor.mockReturnValue({
        ...mockPerformanceMonitor,
        isMonitoring: false,
      });

      render(<PerformanceOverlay enabled={true} />);
      fireEvent.click(screen.getByText("+"));

      expect(screen.getByText("Inactive")).toHaveClass("text-red-400");
    });
  });

  describe("memory formatting", () => {
    it("should format bytes correctly", () => {
      const testCases = [
        { bytes: 0, expected: "0 B" },
        { bytes: 1024, expected: "1 KB" },
        { bytes: 1024 * 1024, expected: "1 MB" },
        { bytes: 1024 * 1024 * 1024, expected: "1 GB" },
        { bytes: 1536, expected: "1.5 KB" },
        { bytes: 2.5 * 1024 * 1024, expected: "2.5 MB" },
      ];

      testCases.forEach(({ bytes, expected }) => {
        mockUsePerformanceMonitor.mockReturnValue({
          ...mockPerformanceMonitor,
          metrics: { ...mockMetrics, memoryUsage: bytes },
        });

        const { rerender } = render(<PerformanceOverlay enabled={true} />);
        fireEvent.click(screen.getByText("+"));

        expect(screen.getByText(expected)).toBeInTheDocument();

        rerender(<div />); // Clear for next test
      });
    });
  });
});
