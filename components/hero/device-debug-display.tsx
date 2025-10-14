"use client";
import type { DeviceCapabilities } from "@/lib/device-profiler";

interface DeviceCapabilityContextType {
  isProfiled: boolean;
  shouldUseShaders: boolean;
  capabilities: DeviceCapabilities | null;
  deviceTier: "high" | "medium" | "low" | null;
}

interface DeviceDebugDisplayProps {
  deviceCapability: DeviceCapabilityContextType;
}

export const DeviceDebugDisplay = ({
  deviceCapability,
}: DeviceDebugDisplayProps) => {
  const { deviceTier, capabilities, isProfiled, shouldUseShaders } =
    deviceCapability;

  if (!isProfiled || !capabilities) {
    return (
      <div className="fixed top-4 left-4 right-4 bg-black/90 text-white p-4 rounded-lg z-50 max-w-2xl mx-auto text-xs font-mono">
        <h3 className="text-yellow-400 font-bold mb-2">
          Device Profiling In Progress...
        </h3>
      </div>
    );
  }

  // Calculate effective resolution
  const effectiveWidth =
    capabilities.screenResolution.width *
    capabilities.screenResolution.devicePixelRatio;
  const effectiveHeight =
    capabilities.screenResolution.height *
    capabilities.screenResolution.devicePixelRatio;

  // Determine classification reasons
  const getClassificationReasons = () => {
    const reasons: string[] = [];
    const thresholds = {
      memory: { low: 1, high: 4 },
      cpu: { low: 2, high: 4 },
      resolution: { low: 720 },
      performance: { low: 15, high: 30 },
    };

    // Check each criterion
    if (capabilities.deviceMemory !== null) {
      if (capabilities.deviceMemory <= thresholds.memory.low) {
        reasons.push(
          `❌ Low Memory: ${capabilities.deviceMemory}GB (≤${thresholds.memory.low}GB)`
        );
      } else if (capabilities.deviceMemory >= thresholds.memory.high) {
        reasons.push(
          `✅ High Memory: ${capabilities.deviceMemory}GB (≥${thresholds.memory.high}GB)`
        );
      } else {
        reasons.push(
          `⚠️ Medium Memory: ${capabilities.deviceMemory}GB (${thresholds.memory.low}-${thresholds.memory.high}GB)`
        );
      }
    } else {
      reasons.push("⚠️ Memory: Unknown (API unavailable)");
    }

    if (capabilities.hardwareConcurrency <= thresholds.cpu.low) {
      reasons.push(
        `❌ Low CPU: ${capabilities.hardwareConcurrency} cores (≤${thresholds.cpu.low})`
      );
    } else if (capabilities.hardwareConcurrency >= thresholds.cpu.high) {
      reasons.push(
        `✅ High CPU: ${capabilities.hardwareConcurrency} cores (≥${thresholds.cpu.high})`
      );
    } else {
      reasons.push(
        `⚠️ Medium CPU: ${capabilities.hardwareConcurrency} cores (${thresholds.cpu.low}-${thresholds.cpu.high})`
      );
    }

    if (effectiveWidth < thresholds.resolution.low) {
      reasons.push(
        `❌ Low Resolution: ${effectiveWidth.toFixed(0)}px (<${
          thresholds.resolution.low
        }px)`
      );
    } else {
      reasons.push(
        `✅ Good Resolution: ${effectiveWidth.toFixed(0)}px (≥${
          thresholds.resolution.low
        }px)`
      );
    }

    if (capabilities.performanceScore !== null) {
      if (capabilities.performanceScore < thresholds.performance.low) {
        reasons.push(
          `❌ Low Performance: ${capabilities.performanceScore.toFixed(
            1
          )} FPS (<${thresholds.performance.low})`
        );
      } else if (capabilities.performanceScore >= thresholds.performance.high) {
        reasons.push(
          `✅ High Performance: ${capabilities.performanceScore.toFixed(
            1
          )} FPS (≥${thresholds.performance.high})`
        );
      } else {
        reasons.push(
          `⚠️ Medium Performance: ${capabilities.performanceScore.toFixed(
            1
          )} FPS (${thresholds.performance.low}-${thresholds.performance.high})`
        );
      }
    } else {
      reasons.push("⚠️ Performance: Test skipped or failed");
    }

    if (!capabilities.webglSupport) {
      reasons.push("❌ WebGL: Not supported");
    } else {
      reasons.push("✅ WebGL: Supported");
    }

    return reasons;
  };

  const reasons = getClassificationReasons();

  const tierColor =
    deviceTier === "high"
      ? "text-green-400"
      : deviceTier === "medium"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="fixed top-4 left-4 right-4 bg-black/95 text-white p-4 rounded-lg z-50 max-w-2xl mx-auto text-xs font-mono max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-bold mb-3 text-center">
        Device Profile Debug
      </h3>

      {/* Classification Result */}
      <div className="mb-4 p-3 bg-gray-900 rounded">
        <div className="flex justify-between items-center">
          <span className="font-bold">Classification:</span>
          <span className={`text-lg font-bold uppercase ${tierColor}`}>
            {deviceTier} TIER
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="font-bold">Shaders Enabled:</span>
          <span
            className={shouldUseShaders ? "text-green-400" : "text-red-400"}
          >
            {shouldUseShaders ? "YES" : "NO"}
          </span>
        </div>
      </div>

      {/* Device Type */}
      <div className="mb-4 p-3 bg-gray-900 rounded">
        <div className="font-bold mb-2">Device Type:</div>
        <div className="pl-2">
          {capabilities.isMobile ? "📱 Mobile" : "🖥️ Desktop"}
        </div>
      </div>

      {/* Detailed Capabilities */}
      <div className="mb-4 p-3 bg-gray-900 rounded">
        <div className="font-bold mb-2">Capabilities:</div>
        <div className="space-y-1 pl-2">
          <div>
            <span className="text-gray-400">Memory:</span>{" "}
            {capabilities.deviceMemory !== null
              ? `${capabilities.deviceMemory}GB`
              : "Unknown"}
          </div>
          <div>
            <span className="text-gray-400">CPU Cores:</span>{" "}
            {capabilities.hardwareConcurrency}
          </div>
          <div>
            <span className="text-gray-400">Screen (Physical):</span>{" "}
            {capabilities.screenResolution.width}×
            {capabilities.screenResolution.height}
          </div>
          <div>
            <span className="text-gray-400">Device Pixel Ratio:</span>{" "}
            {capabilities.screenResolution.devicePixelRatio}
          </div>
          <div>
            <span className="text-gray-400">Effective Resolution:</span>{" "}
            {effectiveWidth.toFixed(0)}×{effectiveHeight.toFixed(0)}
          </div>
          <div>
            <span className="text-gray-400">Performance Score:</span>{" "}
            {capabilities.performanceScore !== null
              ? `${capabilities.performanceScore.toFixed(1)} FPS`
              : "Not tested"}
          </div>
          <div>
            <span className="text-gray-400">WebGL Support:</span>{" "}
            {capabilities.webglSupport ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {/* Classification Reasoning */}
      <div className="p-3 bg-gray-900 rounded">
        <div className="font-bold mb-2">Classification Reasoning:</div>
        <div className="space-y-1 pl-2">
          {reasons.map((reason, index) => (
            <div key={index} className="text-xs">
              {reason}
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
          <div className="font-bold mb-1">Tier Logic:</div>
          <div>• LOW: Any ❌ criterion triggers low tier</div>
          <div>• HIGH: All ✅ criteria required</div>
          <div>• MEDIUM: Everything else</div>
        </div>
      </div>

      {/* User Agent */}
      <div className="mt-4 p-3 bg-gray-900 rounded">
        <div className="font-bold mb-2">User Agent:</div>
        <div className="text-xs break-all text-gray-300">
          {navigator.userAgent}
        </div>
      </div>
    </div>
  );
};
