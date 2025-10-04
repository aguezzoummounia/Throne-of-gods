/**
 * Device Profiling Debug and Logging Utilities
 *
 * This module provides comprehensive debugging and logging capabilities
 * for the device profiling system, including session caching and detailed
 * classification reasoning logs.
 *
 * Requirements: 5.5, 4.5
 */

import type {
  DeviceProfile,
  DeviceCapabilities,
  DeviceProfilerError,
} from "./device-profiler";

// Debug configuration
const DEBUG_CONFIG = {
  enableLogging: process.env.NODE_ENV === "development",
  enableSessionStorage: true,
  sessionStorageKey: "kiro_device_profile",
  logPrefix: "[DeviceProfiler]",
  maxLogHistory: 50,
} as const;

// Log levels for different types of debug information
export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  DEBUG = "debug",
}

// Interface for structured debug logs
export interface DeviceDebugLog {
  timestamp: number;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

// Classification reasoning interface
export interface ClassificationReasoning {
  finalTier: "high" | "medium" | "low";
  factors: {
    memory: {
      value: number | null;
      threshold: string;
      impact: "high" | "medium" | "low" | "none";
      reasoning: string;
    };
    cpu: {
      value: number;
      threshold: string;
      impact: "high" | "medium" | "low" | "none";
      reasoning: string;
    };
    resolution: {
      value: number;
      threshold: string;
      impact: "high" | "medium" | "low" | "none";
      reasoning: string;
    };
    performance: {
      value: number | null;
      threshold: string;
      impact: "high" | "medium" | "low" | "none";
      reasoning: string;
    };
    webgl: {
      value: boolean;
      impact: "high" | "medium" | "low" | "none";
      reasoning: string;
    };
  };
  overallReasoning: string;
}

/**
 * Device Profiler Debug Manager
 *
 * Manages debugging, logging, and session caching for device profiling
 */
export class DeviceProfilerDebug {
  private static instance: DeviceProfilerDebug;
  private logHistory: DeviceDebugLog[] = [];
  private sessionProfile: DeviceProfile | null = null;

  private constructor() {
    this.loadSessionProfile();
  }

  /**
   * Get singleton instance of debug manager
   */
  static getInstance(): DeviceProfilerDebug {
    if (!DeviceProfilerDebug.instance) {
      DeviceProfilerDebug.instance = new DeviceProfilerDebug();
    }
    return DeviceProfilerDebug.instance;
  }

  /**
   * Log device capability metrics with structured data
   * Requirements: 5.5
   */
  logCapabilities(capabilities: DeviceCapabilities): void {
    if (!DEBUG_CONFIG.enableLogging) return;

    const logData = {
      mobile: capabilities.isMobile,
      memory: capabilities.deviceMemory
        ? `${capabilities.deviceMemory}GB`
        : "unknown",
      cpu: `${capabilities.hardwareConcurrency} cores`,
      resolution: `${capabilities.screenResolution.width}x${capabilities.screenResolution.height} (${capabilities.screenResolution.devicePixelRatio}x)`,
      effectiveResolution:
        capabilities.screenResolution.width *
        capabilities.screenResolution.devicePixelRatio,
      webgl: capabilities.webglSupport ? "supported" : "not supported",
      performance: capabilities.performanceScore
        ? `${capabilities.performanceScore.toFixed(1)} FPS`
        : "not tested",
    };

    this.log(
      LogLevel.INFO,
      "capabilities",
      "Device capabilities detected",
      logData
    );

    // Also log to console with formatted output
    console.group(`${DEBUG_CONFIG.logPrefix} Device Capabilities`);
    console.log("📱 Mobile Device:", capabilities.isMobile);
    console.log("💾 Memory:", logData.memory);
    console.log("⚡ CPU Cores:", logData.cpu);
    console.log("🖥️ Screen Resolution:", logData.resolution);
    console.log("🎮 WebGL Support:", logData.webgl);
    console.log("⚡ Performance Score:", logData.performance);
    console.groupEnd();
  }

  /**
   * Log detailed classification reasoning for debugging
   * Requirements: 5.5
   */
  logClassificationReasoning(
    capabilities: DeviceCapabilities,
    finalTier: "high" | "medium" | "low"
  ): void {
    if (!DEBUG_CONFIG.enableLogging) return;

    const reasoning = this.generateClassificationReasoning(
      capabilities,
      finalTier
    );

    this.log(
      LogLevel.DEBUG,
      "classification",
      "Device classification reasoning",
      reasoning
    );

    // Detailed console output for classification reasoning
    console.group(
      `${
        DEBUG_CONFIG.logPrefix
      } Classification: ${finalTier.toUpperCase()} TIER`
    );

    console.log("🧠 Classification Factors:");
    Object.entries(reasoning.factors).forEach(([factor, data]) => {
      const icon = this.getFactorIcon(factor);
      const impact = data.impact.toUpperCase();
      console.log(`  ${icon} ${factor}: ${data.reasoning} (Impact: ${impact})`);
    });

    console.log("📊 Overall Reasoning:", reasoning.overallReasoning);
    console.groupEnd();
  }

  /**
   * Generate detailed classification reasoning
   */
  private generateClassificationReasoning(
    capabilities: DeviceCapabilities,
    finalTier: "high" | "medium" | "low"
  ): ClassificationReasoning {
    const effectiveResolution =
      capabilities.screenResolution.width *
      capabilities.screenResolution.devicePixelRatio;

    // Analyze memory factor
    const memoryFactor = this.analyzeMemoryFactor(capabilities.deviceMemory);

    // Analyze CPU factor
    const cpuFactor = this.analyzeCPUFactor(capabilities.hardwareConcurrency);

    // Analyze resolution factor
    const resolutionFactor = this.analyzeResolutionFactor(effectiveResolution);

    // Analyze performance factor
    const performanceFactor = this.analyzePerformanceFactor(
      capabilities.performanceScore
    );

    // Analyze WebGL factor
    const webglFactor = this.analyzeWebGLFactor(capabilities.webglSupport);

    // Generate overall reasoning
    const overallReasoning = this.generateOverallReasoning(finalTier, [
      memoryFactor,
      cpuFactor,
      resolutionFactor,
      performanceFactor,
      webglFactor,
    ]);

    return {
      finalTier,
      factors: {
        memory: memoryFactor,
        cpu: cpuFactor,
        resolution: resolutionFactor,
        performance: performanceFactor,
        webgl: webglFactor,
      },
      overallReasoning,
    };
  }

  /**
   * Analyze memory factor for classification
   */
  private analyzeMemoryFactor(deviceMemory: number | null) {
    if (deviceMemory === null) {
      return {
        value: null,
        threshold: "unknown",
        impact: "none" as const,
        reasoning: "Memory information unavailable, using fallback estimation",
      };
    }

    if (deviceMemory <= 1) {
      return {
        value: deviceMemory,
        threshold: "≤1GB (low)",
        impact: "low" as const,
        reasoning: `${deviceMemory}GB memory indicates low-end device`,
      };
    } else if (deviceMemory >= 4) {
      return {
        value: deviceMemory,
        threshold: "≥4GB (high)",
        impact: "high" as const,
        reasoning: `${deviceMemory}GB memory indicates high-end device`,
      };
    } else {
      return {
        value: deviceMemory,
        threshold: "2-3GB (medium)",
        impact: "medium" as const,
        reasoning: `${deviceMemory}GB memory indicates mid-range device`,
      };
    }
  }

  /**
   * Analyze CPU factor for classification
   */
  private analyzeCPUFactor(hardwareConcurrency: number) {
    if (hardwareConcurrency <= 2) {
      return {
        value: hardwareConcurrency,
        threshold: "≤2 cores (low)",
        impact: "low" as const,
        reasoning: `${hardwareConcurrency} CPU cores indicates limited processing power`,
      };
    } else if (hardwareConcurrency >= 4) {
      return {
        value: hardwareConcurrency,
        threshold: "≥4 cores (high)",
        impact: "high" as const,
        reasoning: `${hardwareConcurrency} CPU cores indicates strong processing power`,
      };
    } else {
      return {
        value: hardwareConcurrency,
        threshold: "3 cores (medium)",
        impact: "medium" as const,
        reasoning: `${hardwareConcurrency} CPU cores indicates moderate processing power`,
      };
    }
  }

  /**
   * Analyze resolution factor for classification
   */
  private analyzeResolutionFactor(effectiveResolution: number) {
    if (effectiveResolution < 720) {
      return {
        value: effectiveResolution,
        threshold: "<720px (low)",
        impact: "low" as const,
        reasoning: `${effectiveResolution}px effective width indicates low-resolution display`,
      };
    } else if (effectiveResolution >= 1080) {
      return {
        value: effectiveResolution,
        threshold: "≥1080px (high)",
        impact: "medium" as const,
        reasoning: `${effectiveResolution}px effective width indicates high-resolution display`,
      };
    } else {
      return {
        value: effectiveResolution,
        threshold: "720-1079px (medium)",
        impact: "none" as const,
        reasoning: `${effectiveResolution}px effective width indicates standard resolution`,
      };
    }
  }

  /**
   * Analyze performance factor for classification
   */
  private analyzePerformanceFactor(performanceScore: number | null) {
    if (performanceScore === null) {
      return {
        value: null,
        threshold: "not tested",
        impact: "none" as const,
        reasoning: "Performance test was skipped or failed",
      };
    }

    if (performanceScore < 15) {
      return {
        value: performanceScore,
        threshold: "<15 FPS (low)",
        impact: "low" as const,
        reasoning: `${performanceScore.toFixed(
          1
        )} FPS indicates poor rendering performance`,
      };
    } else if (performanceScore >= 30) {
      return {
        value: performanceScore,
        threshold: "≥30 FPS (high)",
        impact: "high" as const,
        reasoning: `${performanceScore.toFixed(
          1
        )} FPS indicates excellent rendering performance`,
      };
    } else {
      return {
        value: performanceScore,
        threshold: "15-29 FPS (medium)",
        impact: "medium" as const,
        reasoning: `${performanceScore.toFixed(
          1
        )} FPS indicates moderate rendering performance`,
      };
    }
  }

  /**
   * Analyze WebGL factor for classification
   */
  private analyzeWebGLFactor(webglSupport: boolean) {
    if (webglSupport) {
      return {
        value: webglSupport,
        impact: "medium" as const,
        reasoning: "WebGL support enables advanced rendering capabilities",
      };
    } else {
      return {
        value: webglSupport,
        impact: "low" as const,
        reasoning: "No WebGL support limits rendering to basic capabilities",
      };
    }
  }

  /**
   * Generate overall classification reasoning
   */
  private generateOverallReasoning(
    finalTier: "high" | "medium" | "low",
    factors: Array<{ impact: "high" | "medium" | "low" | "none" }>
  ): string {
    const highImpactFactors = factors.filter((f) => f.impact === "high").length;
    const lowImpactFactors = factors.filter((f) => f.impact === "low").length;
    const mediumImpactFactors = factors.filter(
      (f) => f.impact === "medium"
    ).length;

    switch (finalTier) {
      case "high":
        return `Classified as HIGH tier due to ${highImpactFactors} high-impact positive factors. Device shows strong capabilities across multiple metrics.`;

      case "low":
        return `Classified as LOW tier due to ${lowImpactFactors} low-impact limiting factors. Device shows constraints that require performance optimization.`;

      case "medium":
        return `Classified as MEDIUM tier with ${mediumImpactFactors} moderate factors and ${highImpactFactors} high factors. Device capabilities fall between high and low thresholds.`;

      default:
        return "Classification reasoning could not be determined.";
    }
  }

  /**
   * Get icon for factor display
   */
  private getFactorIcon(factor: string): string {
    const icons: Record<string, string> = {
      memory: "💾",
      cpu: "⚡",
      resolution: "🖥️",
      performance: "📊",
      webgl: "🎮",
    };
    return icons[factor] || "📋";
  }

  /**
   * Log profiling errors with detailed context
   * Requirements: 4.5
   */
  logError(error: DeviceProfilerError, context?: string): void {
    const errorData = {
      type: error.type,
      message: error.message,
      fallbackUsed: error.fallbackUsed,
      context: context || "unknown",
      timestamp: Date.now(),
    };

    this.log(
      LogLevel.ERROR,
      "error",
      "Device profiling error occurred",
      errorData
    );

    if (DEBUG_CONFIG.enableLogging) {
      console.error(`${DEBUG_CONFIG.logPrefix} Error:`, {
        type: error.type,
        message: error.message,
        fallback: error.fallbackUsed
          ? "Used fallback method"
          : "No fallback available",
        context,
      });
    }
  }

  /**
   * Save device profile to session storage for caching
   * Requirements: 4.5
   */
  saveSessionProfile(profile: DeviceProfile): void {
    if (!DEBUG_CONFIG.enableSessionStorage) return;

    try {
      this.sessionProfile = profile;

      const sessionData = {
        profile,
        timestamp: Date.now(),
        version: "1.0", // For future compatibility
      };

      sessionStorage.setItem(
        DEBUG_CONFIG.sessionStorageKey,
        JSON.stringify(sessionData)
      );

      this.log(
        LogLevel.DEBUG,
        "session",
        "Device profile saved to session cache",
        {
          tier: profile.tier,
          timestamp: profile.timestamp,
        }
      );

      if (DEBUG_CONFIG.enableLogging) {
        console.log(`${DEBUG_CONFIG.logPrefix} Profile cached for session`, {
          tier: profile.tier,
          shouldUseShaders: profile.shouldUseShaders,
        });
      }
    } catch (error) {
      this.log(
        LogLevel.WARN,
        "session",
        "Failed to save profile to session storage",
        {
          error: error instanceof Error ? error.message : "Unknown error",
        }
      );
    }
  }

  /**
   * Load device profile from session storage
   * Requirements: 4.5
   */
  loadSessionProfile(): DeviceProfile | null {
    if (!DEBUG_CONFIG.enableSessionStorage) return null;

    try {
      const sessionData = sessionStorage.getItem(
        DEBUG_CONFIG.sessionStorageKey
      );
      if (!sessionData) return null;

      const parsed = JSON.parse(sessionData);

      // Check if session data is still valid (within 1 hour)
      const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
      const age = Date.now() - parsed.timestamp;

      if (age > maxAge) {
        this.clearSessionProfile();
        this.log(
          LogLevel.DEBUG,
          "session",
          "Session profile expired, cleared cache"
        );
        return null;
      }

      this.sessionProfile = parsed.profile;

      this.log(
        LogLevel.DEBUG,
        "session",
        "Device profile loaded from session cache",
        {
          tier: parsed.profile.tier,
          age: Math.round(age / 1000) + "s",
        }
      );

      if (DEBUG_CONFIG.enableLogging) {
        console.log(`${DEBUG_CONFIG.logPrefix} Using cached profile`, {
          tier: parsed.profile.tier,
          age: Math.round(age / 1000) + "s ago",
        });
      }

      return parsed.profile;
    } catch (error) {
      this.log(
        LogLevel.WARN,
        "session",
        "Failed to load profile from session storage",
        {
          error: error instanceof Error ? error.message : "Unknown error",
        }
      );

      // Clear corrupted session data
      this.clearSessionProfile();
      return null;
    }
  }

  /**
   * Clear session profile cache
   */
  clearSessionProfile(): void {
    try {
      sessionStorage.removeItem(DEBUG_CONFIG.sessionStorageKey);
      this.sessionProfile = null;

      this.log(LogLevel.DEBUG, "session", "Session profile cache cleared");
    } catch (error) {
      this.log(LogLevel.WARN, "session", "Failed to clear session storage", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get cached session profile
   */
  getSessionProfile(): DeviceProfile | null {
    return this.sessionProfile;
  }

  /**
   * Check if session profile is available and valid
   */
  hasValidSessionProfile(): boolean {
    return this.sessionProfile !== null;
  }

  /**
   * Generic logging method with structured data
   */
  private log(
    level: LogLevel,
    category: string,
    message: string,
    data?: any
  ): void {
    const logEntry: DeviceDebugLog = {
      timestamp: Date.now(),
      level,
      category,
      message,
      data,
    };

    // Add to log history
    this.logHistory.push(logEntry);

    // Maintain log history size
    if (this.logHistory.length > DEBUG_CONFIG.maxLogHistory) {
      this.logHistory = this.logHistory.slice(-DEBUG_CONFIG.maxLogHistory);
    }
  }

  /**
   * Get debug log history
   */
  getLogHistory(): DeviceDebugLog[] {
    return [...this.logHistory];
  }

  /**
   * Export debug information for troubleshooting
   */
  exportDebugInfo(): {
    profile: DeviceProfile | null;
    logs: DeviceDebugLog[];
    config: typeof DEBUG_CONFIG;
    timestamp: number;
  } {
    return {
      profile: this.sessionProfile,
      logs: this.getLogHistory(),
      config: DEBUG_CONFIG,
      timestamp: Date.now(),
    };
  }

  /**
   * Log performance timing information
   */
  logPerformanceTiming(
    operation: string,
    startTime: number,
    endTime: number
  ): void {
    const duration = endTime - startTime;

    this.log(LogLevel.DEBUG, "performance", `${operation} completed`, {
      duration: `${duration.toFixed(2)}ms`,
      operation,
    });

    if (DEBUG_CONFIG.enableLogging) {
      console.log(
        `${DEBUG_CONFIG.logPrefix} ⏱️ ${operation}: ${duration.toFixed(2)}ms`
      );
    }
  }
}

/**
 * Convenience function to get debug manager instance
 */
export function getDeviceDebug(): DeviceProfilerDebug {
  return DeviceProfilerDebug.getInstance();
}

/**
 * Convenience function to check if debugging is enabled
 */
export function isDebugEnabled(): boolean {
  return DEBUG_CONFIG.enableLogging;
}

/**
 * Convenience function to log device capabilities
 */
export function logDeviceCapabilities(capabilities: DeviceCapabilities): void {
  getDeviceDebug().logCapabilities(capabilities);
}

/**
 * Convenience function to log classification reasoning
 */
export function logClassificationReasoning(
  capabilities: DeviceCapabilities,
  tier: "high" | "medium" | "low"
): void {
  getDeviceDebug().logClassificationReasoning(capabilities, tier);
}

/**
 * Convenience function to log profiling errors
 */
export function logProfilerError(
  error: DeviceProfilerError,
  context?: string
): void {
  getDeviceDebug().logError(error, context);
}
