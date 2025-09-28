# RippleImage Performance Optimization Documentation

## Overview

The RippleImage component has been optimized for mobile devices and various performance scenarios through a comprehensive monitoring and debugging system. This documentation covers all the performance optimization features, debugging tools, and monitoring capabilities.

## Performance Monitoring System

### PerformanceOverlay Component

The `PerformanceOverlay` provides real-time performance metrics during development:

```tsx
import { PerformanceOverlay } from '@/components/performance-overlay';

// Basic usage (automatically enabled in development)
<PerformanceOverlay />

// Custom configuration
<PerformanceOverlay
  enabled={true}
  position="bottom-right"
/>
```

**Features:**

- Real-time FPS monitoring with color-coded indicators
- Memory usage tracking
- Frame drop counting
- Interaction timing
- Collapsible interface to minimize screen space

**Color Coding:**

- Green (≥55 FPS): Excellent performance
- Yellow (30-54 FPS): Acceptable performance
- Red (<30 FPS): Poor performance requiring optimization

### Performance Logger

The performance logger provides comprehensive logging capabilities for debugging and analysis:

```tsx
import { usePerformanceLogger } from "@/lib/performance-logger";

const logger = usePerformanceLogger();

// Log different types of events
logger.logFPS(60, "RippleImage");
logger.logMemoryUsage(50 * 1024 * 1024, "RippleImage"); // 50MB
logger.logInteraction("click", { x: 100, y: 200 });
logger.logError("WebGL context lost", error);
logger.logWarning("Performance degradation detected");

// Retrieve and analyze logs
const logs = logger.getLogs({ type: "fps", since: Date.now() - 60000 });
const stats = logger.getStats();
```

**Log Types:**

- `fps`: Frame rate measurements
- `memory`: Memory usage tracking
- `interaction`: User interaction events
- `error`: Error conditions
- `warning`: Performance warnings
- `info`: General information

**Configuration Options:**

```tsx
const logger = new PerformanceLogger({
  enabled: true,
  maxEntries: 1000,
  logToConsole: true,
  logToStorage: false,
  minLevel: "info",
});
```

## WebGL Debugging Tools

### WebGL Debugger

The WebGL debugger provides comprehensive WebGL context monitoring and shader debugging:

```tsx
import { webglDebugger } from "@/lib/webgl-debugger";

// Check WebGL support and capabilities
const webglInfo = webglDebugger.checkWebGLSupport();
console.log("WebGL supported:", webglInfo.isSupported);
console.log("GPU info:", webglInfo.debugInfo);

// Compile and debug shaders
const result = webglDebugger.compileShader(
  gl,
  shaderSource,
  gl.VERTEX_SHADER,
  "MyShader"
);
if (!result.success) {
  console.error("Shader compilation failed:", result.error);
}

// Set up context loss handling
webglDebugger.setupContextLossHandling(
  canvas,
  () => console.log("Context lost"),
  () => console.log("Context restored")
);

// Check for GL errors
webglDebugger.checkGLError(gl, "drawArrays");
```

**Features:**

- WebGL capability detection
- Shader compilation monitoring with caching
- Context loss/restore handling
- GPU information extraction
- Error checking and reporting
- Performance statistics tracking

### Shader Debugging

The system provides detailed shader compilation debugging:

```tsx
// Shader compilation with detailed error reporting
const compilationResult = webglDebugger.compileShader(
  gl,
  fragmentShaderSource,
  gl.FRAGMENT_SHADER,
  "RippleFragmentShader"
);

if (!compilationResult.success) {
  // Detailed error information available
  console.error("Compilation failed:", compilationResult.error);
  console.log("Compilation time:", compilationResult.compilationTime);
}
```

**Shader Cache:**

- Automatic caching of compiled shaders
- Cache hit/miss tracking
- Manual cache clearing for debugging
- Performance impact monitoring

## Production Profiling

### Production Profiler

The production profiler collects anonymized performance data for analysis:

```tsx
import { useProductionProfiler } from "@/lib/production-profiler";

const profiler = useProductionProfiler();

// Record performance metrics
profiler.recordPerformanceMetrics({
  fps: 60,
  memoryUsage: 50 * 1024 * 1024,
  renderingMode: "webgl",
  frameDrops: 2,
});

// Record user interactions
profiler.recordInteraction();

// Record errors for analysis
profiler.recordError("webgl"); // 'webgl' | 'contextLoss' | 'shaderCompilation' | 'general'
```

**Configuration:**

```tsx
const profiler = new ProductionProfiler({
  enabled: process.env.NODE_ENV === "production",
  sampleRate: 0.1, // Profile 10% of sessions
  reportingEndpoint: "https://api.example.com/performance",
  reportingInterval: 60000, // Report every minute
  maxReportsPerSession: 10,
  enableLocalStorage: true,
});
```

**Collected Metrics:**

- Device information (screen size, mobile detection, DPR)
- Performance metrics (FPS, memory, rendering mode)
- Error counts (WebGL errors, context losses, shader failures)
- Feature support (WebGL versions, GPU tier, max texture size)
- Session duration and interaction counts

## Debug Dashboard

### Comprehensive Debugging Interface

The debug dashboard provides a unified interface for all debugging tools:

```tsx
import { DebugDashboard } from '@/components/debug-dashboard';

// Add to your app (automatically enabled in development)
<DebugDashboard />

// Force enable for testing
<DebugDashboard enabled={true} />
```

**Dashboard Tabs:**

1. **Performance Logs**: View real-time logs with filtering and export
2. **WebGL Debug**: Monitor WebGL context and shader information
3. **Session Profile**: Current session performance summary
4. **Local Reports**: Historical performance reports

**Features:**

- Real-time log viewing with color-coded severity levels
- WebGL context information and statistics
- Performance metrics visualization
- Local report management
- Export capabilities for logs and reports

## Integration Guide

### Basic Integration

Add performance monitoring to your RippleImage component:

```tsx
import { PerformanceOverlay } from "@/components/performance-overlay";
import { DebugDashboard } from "@/components/debug-dashboard";
import { usePerformanceLogger } from "@/lib/performance-logger";
import { useProductionProfiler } from "@/lib/production-profiler";

function App() {
  const logger = usePerformanceLogger();
  const profiler = useProductionProfiler();

  return (
    <div>
      {/* Your app content */}
      <RippleImage
        src="/image.jpg"
        alt="Interactive image"
        onPerformanceUpdate={(metrics) => {
          logger.logFPS(metrics.fps, "RippleImage");
          profiler.recordPerformanceMetrics(metrics);
        }}
      />

      {/* Development tools */}
      <PerformanceOverlay />
      <DebugDashboard />
    </div>
  );
}
```

### Advanced Configuration

For production environments with custom monitoring:

```tsx
import { ProductionProfiler } from "@/lib/production-profiler";
import { PerformanceLogger } from "@/lib/performance-logger";

// Custom production profiler
const profiler = new ProductionProfiler({
  enabled: true,
  sampleRate: 0.05, // 5% sampling
  reportingEndpoint: "https://analytics.yoursite.com/performance",
  reportingInterval: 120000, // 2 minutes
  enableLocalStorage: false, // Disable for privacy
});

// Custom logger for specific components
const logger = new PerformanceLogger({
  enabled: true,
  maxEntries: 500,
  logToConsole: false,
  logToStorage: true,
  minLevel: "warn", // Only log warnings and errors
});
```

## Performance Optimization Strategies

### Automatic Quality Adjustment

The system automatically adjusts quality based on performance:

```tsx
// Performance thresholds trigger quality adjustments
const performanceConfig = {
  targetFPS: 60,
  minFPS: 30,
  qualityLevels: {
    high: { textureScale: 1.0, shaderComplexity: "full" },
    medium: { textureScale: 0.75, shaderComplexity: "reduced" },
    low: { textureScale: 0.5, shaderComplexity: "minimal" },
  },
};
```

### Mobile Optimizations

Specific optimizations for mobile devices:

- Reduced texture resolution based on device capabilities
- Simplified shaders for lower-end GPUs
- Battery-aware rendering adjustments
- Touch event optimization
- Visibility-based rendering pause

### Memory Management

Comprehensive resource cleanup:

- WebGL resource disposal tracking
- Texture and buffer management
- Event listener cleanup
- Memory pressure detection
- Automatic garbage collection triggers

## Troubleshooting

### Common Issues

1. **High Memory Usage**

   - Check memory logs in the debug dashboard
   - Verify proper resource cleanup
   - Monitor texture sizes and buffer allocations

2. **Poor Performance on Mobile**

   - Review GPU tier detection
   - Check if fallback mode is activating correctly
   - Verify mobile-specific optimizations are enabled

3. **WebGL Context Loss**

   - Monitor context loss events in WebGL debug tab
   - Verify context restoration handling
   - Check for memory pressure or GPU driver issues

4. **Shader Compilation Failures**
   - Review shader compilation logs
   - Check GPU capabilities and supported extensions
   - Verify shader variants for different device tiers

### Debug Workflow

1. Enable debug dashboard in development
2. Monitor performance overlay during interactions
3. Review logs for errors and warnings
4. Check WebGL debug information for context issues
5. Analyze session profile for performance patterns
6. Export logs for detailed analysis

### Performance Analysis

Use the collected data to:

- Identify performance bottlenecks
- Optimize for specific device types
- Track performance improvements over time
- Debug WebGL-related issues
- Monitor production performance trends

## API Reference

### PerformanceLogger Methods

- `logFPS(fps: number, component?: string)`: Log frame rate
- `logMemoryUsage(usage: number, component?: string)`: Log memory usage
- `logInteraction(type: string, data?: object, component?: string)`: Log user interaction
- `logError(message: string, error?: Error, component?: string)`: Log error
- `logWarning(message: string, data?: object, component?: string)`: Log warning
- `getLogs(filter?: object)`: Retrieve filtered logs
- `getStats()`: Get performance statistics
- `exportLogs()`: Export logs as JSON
- `clearLogs()`: Clear all logs

### WebGLDebugger Methods

- `checkWebGLSupport()`: Check WebGL availability and capabilities
- `compileShader(gl, source, type, name?)`: Compile shader with debugging
- `setupContextLossHandling(canvas, onLoss?, onRestore?)`: Set up context event handlers
- `checkGLError(gl, operation?)`: Check for WebGL errors
- `getDebugStats()`: Get debugging statistics
- `clearShaderCache()`: Clear compiled shader cache

### ProductionProfiler Methods

- `recordPerformanceMetrics(metrics)`: Record performance data
- `recordInteraction()`: Record user interaction
- `recordError(type)`: Record error occurrence
- `getSessionSummary()`: Get current session data
- `getLocalReports()`: Get stored performance reports
- `clearLocalReports()`: Clear local storage reports

This comprehensive monitoring and debugging system ensures optimal performance across all devices while providing detailed insights for continuous improvement.
