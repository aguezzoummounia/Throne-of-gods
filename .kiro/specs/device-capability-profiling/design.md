# Design Document

## Overview

The Device Capability Profiling system will be integrated into the existing preloader workflow to classify devices into performance tiers (High/Medium/Low) and enable adaptive component loading. The system will perform early mobile detection, followed by comprehensive device capability assessment for mobile devices only. This design leverages the existing AssetLoaderProvider context and preloader component structure to seamlessly integrate device profiling without disrupting the current user experience.

## Architecture

### Core Components

1. **DeviceProfiler Class**: A singleton service responsible for device capability detection and classification
2. **DeviceCapabilityProvider**: React context provider that wraps the existing AssetLoaderProvider to expose device tier information
3. **Enhanced AssetLoaderProvider**: Extended to include device profiling during the preload phase
4. **Component Selection Utilities**: Helper functions to determine appropriate component variants based on device tier

### Integration Points

- **Preloader Phase**: Device profiling runs during asset loading to avoid additional loading time
- **Context Layer**: Device tier information is exposed through React context for component consumption
- **Component Level**: Individual components can query device capabilities to render appropriate variants

## Components and Interfaces

### DeviceProfiler Service

```typescript
interface DeviceCapabilities {
  isMobile: boolean;
  deviceMemory: number | null;
  hardwareConcurrency: number;
  screenResolution: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  webglSupport: boolean;
  performanceScore: number | null;
}

interface DeviceProfile {
  tier: "high" | "medium" | "low";
  capabilities: DeviceCapabilities;
  shouldUseShaders: boolean;
  timestamp: number;
}

class DeviceProfiler {
  private static instance: DeviceProfiler;
  private profile: DeviceProfile | null = null;
  private profilingPromise: Promise<DeviceProfile> | null = null;

  static getInstance(): DeviceProfiler;
  async profileDevice(): Promise<DeviceProfile>;
  getProfile(): DeviceProfile | null;
  private detectMobile(): boolean;
  private measureDeviceCapabilities(): Promise<DeviceCapabilities>;
  private runPerformanceTest(): Promise<number>;
  private classifyDevice(
    capabilities: DeviceCapabilities
  ): "high" | "medium" | "low";
}
```

### React Context Integration

```typescript
interface DeviceCapabilityContextType {
  deviceTier: "high" | "medium" | "low" | null;
  shouldUseShaders: boolean;
  isProfiled: boolean;
  capabilities: DeviceCapabilities | null;
}

interface EnhancedPreloadContextType extends PreloadContextType {
  deviceCapability: DeviceCapabilityContextType;
}
```

### Component Selection Utilities

```typescript
interface ComponentVariants<T> {
  high: T;
  medium: T;
  low: T;
}

function selectComponent<T>(
  variants: ComponentVariants<T>,
  deviceTier: "high" | "medium" | "low"
): T;

function shouldRenderShader(
  deviceTier: "high" | "medium" | "low" | null
): boolean;
```

## Data Models

### Device Classification Thresholds

```typescript
const DEVICE_THRESHOLDS = {
  memory: {
    low: 1, // GB
    high: 4, // GB
  },
  cpu: {
    low: 2, // cores
    high: 4, // cores
  },
  resolution: {
    low: 720, // width * devicePixelRatio
  },
  performance: {
    low: 15, // FPS
    high: 30, // FPS
  },
} as const;
```

### Performance Test Configuration

```typescript
const PERFORMANCE_TEST_CONFIG = {
  duration: 200, // ms
  timeout: 500, // ms
  frameTarget: 60, // target FPS for test
  testComplexity: "medium", // complexity of performance test
} as const;
```

## Error Handling

### Graceful Degradation Strategy

1. **API Unavailability**: When hardware APIs are not supported (e.g., `navigator.deviceMemory` on Safari), fall back to alternative detection methods
2. **Performance Test Timeout**: If performance testing exceeds timeout, classify based on available hardware metrics
3. **Complete Failure**: If all detection methods fail, default to conservative low-tier classification
4. **Non-Critical Errors**: Log warnings for debugging but continue with fallback values

### Error Recovery Patterns

```typescript
interface ProfilerError {
  type: "api_unavailable" | "timeout" | "performance_test_failed" | "unknown";
  message: string;
  fallbackUsed: boolean;
}

class DeviceProfilerError extends Error {
  constructor(public profilerError: ProfilerError, message?: string) {
    super(message || profilerError.message);
  }
}
```

## Testing Strategy

### Unit Testing Approach

1. **DeviceProfiler Service Tests**:

   - Mock browser APIs (`navigator.deviceMemory`, `navigator.hardwareConcurrency`)
   - Test classification logic with various capability combinations
   - Verify timeout and fallback behaviors
   - Test singleton pattern implementation

2. **Context Provider Tests**:

   - Test integration with existing AssetLoaderProvider
   - Verify context value propagation
   - Test loading states and error handling

3. **Component Selection Tests**:
   - Test utility functions with different device tiers
   - Verify shader enablement logic
   - Test component variant selection

### Integration Testing

1. **Preloader Integration**:

   - Test device profiling during asset loading phase
   - Verify no impact on loading performance
   - Test context availability in child components

2. **Cross-Browser Compatibility**:
   - Test API availability detection across browsers
   - Verify fallback mechanisms on unsupported browsers
   - Test mobile detection accuracy

### Performance Testing

1. **Profiling Performance**:

   - Measure time taken for device profiling
   - Verify profiling completes within 500ms threshold
   - Test performance test accuracy and consistency

2. **Memory Usage**:
   - Monitor memory consumption during profiling
   - Test singleton instance management
   - Verify proper cleanup of performance test resources

## Implementation Flow

### Phase 1: Core Service Implementation

1. Create DeviceProfiler singleton service
2. Implement mobile detection logic
3. Add hardware capability detection methods
4. Implement device classification algorithm

### Phase 2: Performance Testing

1. Design and implement performance benchmark
2. Add timeout and error handling
3. Calibrate classification thresholds
4. Test across different device types

### Phase 3: Context Integration

1. Extend AssetLoaderProvider with device profiling
2. Create DeviceCapabilityProvider wrapper
3. Integrate profiling into preloader lifecycle
4. Add context consumption utilities

### Phase 4: Component Selection System

1. Create component selection utilities
2. Implement shader enablement logic
3. Add debugging and logging capabilities
4. Create usage examples and documentation

## Browser Compatibility Considerations

### API Support Matrix

| Feature                         | Chrome/Edge | Firefox | Safari/iOS | Fallback Strategy                  |
| ------------------------------- | ----------- | ------- | ---------- | ---------------------------------- |
| `navigator.deviceMemory`        | ✅          | ❌      | ❌         | Screen resolution + CPU estimation |
| `navigator.hardwareConcurrency` | ✅          | ✅      | ✅         | Default to 2 cores                 |
| WebGL detection                 | ✅          | ✅      | ✅         | Assume no WebGL support            |
| Performance timing              | ✅          | ✅      | ✅         | Skip performance test              |

### Mobile Detection Strategy

1. **Primary**: User agent analysis for mobile device patterns
2. **Secondary**: Touch capability detection (`'ontouchstart' in window`)
3. **Tertiary**: Screen size and orientation analysis
4. **Fallback**: Assume desktop if all methods fail

## Security and Privacy Considerations

### Data Collection Principles

1. **Minimal Data**: Only collect capabilities necessary for component selection
2. **No Persistence**: Device profile is session-only, not stored locally
3. **No Transmission**: All profiling happens client-side, no data sent to servers
4. **Transparent**: Clear logging of what capabilities are being detected

### Privacy-Safe Implementation

- Use feature detection rather than device fingerprinting
- Avoid collecting unique device identifiers
- Respect user privacy settings and browser limitations
- Provide opt-out mechanism if needed for compliance
