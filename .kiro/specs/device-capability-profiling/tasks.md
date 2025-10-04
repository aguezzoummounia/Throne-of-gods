# Implementation Plan

- [x] 1. Create core DeviceProfiler service with mobile detection

  - Implement singleton DeviceProfiler class with early mobile detection
  - Add mobile detection using user agent, touch capability, and screen analysis
  - Create device capability interfaces and types
  - Implement early exit logic for non-mobile devices (classify as high-tier)
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Implement hardware capability detection methods

  - [x] 2.1 Add memory detection with browser compatibility

    - Implement navigator.deviceMemory detection for Chrome/Edge
    - Create fallback memory estimation for Safari/iOS using screen resolution and CPU
    - Add graceful handling for unsupported browsers
    - _Requirements: 4.2, 4.3, 6.1, 6.2_

  - [x] 2.2 Implement CPU and screen resolution detection

    - Add navigator.hardwareConcurrency detection with fallback to 2 cores
    - Implement screen resolution calculation (width × devicePixelRatio)
    - Add WebGL support detection
    - _Requirements: 1.4, 1.5, 1.6, 6.3_

  - [ ]\* 2.3 Write unit tests for capability detection
    - Create tests for mobile detection logic
    - Test hardware capability detection with mocked browser APIs
    - Test fallback mechanisms for unsupported browsers
    - _Requirements: 6.4, 6.5_

- [x] 3. Create performance testing and device classification

  - [x] 3.1 Implement runtime performance benchmark

    - Create canvas-based performance test with configurable duration (200ms)
    - Add FPS measurement using requestAnimationFrame
    - Implement timeout mechanism (500ms total) for performance testing
    - _Requirements: 2.3, 3.5, 4.1, 4.4_

  - [x] 3.2 Build device classification algorithm

    - Implement classification logic using memory, CPU, resolution, and performance thresholds
    - Add tier assignment (high: ≥4GB memory OR ≥4 CPU cores OR ≥30 FPS)
    - Add tier assignment (low: ≤1GB memory OR ≤2 CPU cores OR <720 resolution OR <15 FPS)
    - Add medium tier for devices between high and low thresholds
    - _Requirements: 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]\* 3.3 Write unit tests for classification logic
    - Test device classification with various capability combinations
    - Test threshold boundary conditions
    - Test timeout and error handling scenarios
    - _Requirements: 4.4, 6.4_

- [x] 4. Integrate device profiling into AssetLoaderProvider

  - [x] 4.1 Extend AssetLoaderProvider with device profiling

    - Add device profiling initialization during asset loading phase
    - Integrate DeviceProfiler.profileDevice() call in provider
    - Ensure profiling runs concurrently with asset loading
    - Add device capability state to context value
    - _Requirements: 1.1, 4.1, 4.5_

  - [x] 4.2 Create enhanced context interface

    - Extend PreloadContextType to include device capability information
    - Add deviceTier, shouldUseShaders, isProfiled, and capabilities to context
    - Update usePreloader hook to expose device capability data
    - _Requirements: 5.1, 5.2_

  - [ ]\* 4.3 Write integration tests for context provider
    - Test device profiling integration with asset loading
    - Test context value propagation to child components
    - Test loading states and error handling
    - _Requirements: 4.5, 5.4_

- [x] 5. Create component selection utilities and debugging

  - [x] 5.1 Implement component selection helper functions

    - Create selectComponent utility for choosing component variants based on device tier
    - Implement shouldRenderShader function for shader enablement logic
    - Add type-safe component variant selection system
    - _Requirements: 5.2, 5.3_

  - [x] 5.2 Add debugging and logging capabilities

    - Implement development-mode logging for device capability metrics
    - Add classification reasoning logs for debugging
    - Create session caching to avoid repeated profiling
    - Add error logging for failed capability detection
    - _Requirements: 5.5, 4.5_

  - [ ]\* 5.3 Write unit tests for utility functions
    - Test component selection logic with different device tiers
    - Test shader enablement logic
    - Test debugging and logging functionality
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 6. Update preloader component integration

  - [x] 6.1 Modify preloader to consume device capability context

    - Update Preloader component to access device tier information
    - Add conditional rendering logic based on device capabilities
    - Ensure device profiling completes before preloader exit
    - _Requirements: 1.1, 5.1, 5.2_

  - [x] 6.2 Create example shader component selection

    - Implement example component that demonstrates tier-based rendering
    - Show high-tier shader, medium-tier simplified shader, low-tier static image
    - Add fallback component selection in existing shader components
    - _Requirements: 1.7, 2.4, 3.4_

  - [ ]\* 6.3 Write integration tests for preloader
    - Test device profiling during preloader lifecycle
    - Test component selection based on device tier
    - Test preloader behavior with different device classifications
    - _Requirements: 4.1, 5.4_
