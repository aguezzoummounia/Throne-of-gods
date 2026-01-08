/**
 * Device Capability Profiling System
 *
 * This module provides device capability detection and classification
 * to enable adaptive component loading based on device performance tiers.
 */

import {
	getDeviceDebug,
	logDeviceCapabilities,
	logClassificationReasoning,
	logProfilerError,
} from "./device-debug";

// Core interfaces and types
// Network connection information from Navigator.connection API
export interface NetworkConnection {
	effectiveType: "slow-2g" | "2g" | "3g" | "4g" | null;
	downlink: number | null; // Mbps
	rtt: number | null; // Round-trip time in ms
	saveData: boolean;
}

export interface DeviceCapabilities {
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
	networkConnection: NetworkConnection;
}

export interface DeviceProfile {
	tier: "high" | "medium" | "low";
	capabilities: DeviceCapabilities;
	shouldUseShaders: boolean;
	timestamp: number;
}

export type DeviceProfilerError = {
	type: "api_unavailable" | "timeout" | "performance_test_failed" | "unknown";
	message: string;
	fallbackUsed: boolean;
};

// Device classification thresholds
export const DEVICE_THRESHOLDS = {
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

// Performance test configuration
export const PERFORMANCE_TEST_CONFIG = {
	duration: 1000, // ms
	timeout: 2000, // ms
	frameTarget: 60, // target FPS for test
	testComplexity: "medium", // complexity of performance test
} as const;

// Component selection utilities
export interface ComponentVariants<T> {
	high: T;
	medium: T;
	low: T;
}

/**
 * Select appropriate component variant based on device tier
 * Requirements: 5.2, 5.3
 */
export function selectComponent<T>(
	variants: ComponentVariants<T>,
	deviceTier: "high" | "medium" | "low" | null,
): T {
	if (!deviceTier) {
		// Default to low-tier component if tier is unknown
		return variants.low;
	}

	return variants[deviceTier];
}

/**
 * Determine if shaders should be rendered based on device tier
 * Requirements: 5.2, 5.3
 */
export function shouldRenderShader(
	deviceTier: "high" | "medium" | "low" | null,
): boolean {
	// Only disable shaders for low-tier devices
	return deviceTier !== "low" && deviceTier !== null;
}

/**
 * Singleton DeviceProfiler class for device capability detection and classification
 */
export class DeviceProfiler {
	private static instance: DeviceProfiler;
	private profile: DeviceProfile | null = null;
	private profilingPromise: Promise<DeviceProfile> | null = null;

	private constructor() {}

	/**
	 * Get the singleton instance of DeviceProfiler
	 */
	static getInstance(): DeviceProfiler {
		if (!DeviceProfiler.instance) {
			DeviceProfiler.instance = new DeviceProfiler();
		}
		return DeviceProfiler.instance;
	}

	/**
	 * Get the cached device profile if available
	 */
	getProfile(): DeviceProfile | null {
		return this.profile;
	}

	/**
	 * Profile the device and return classification
	 * Implements early exit for non-mobile devices and session caching
	 * Requirements: 4.5 (session caching)
	 */
	async profileDevice(): Promise<DeviceProfile> {
		const debugManager = getDeviceDebug();
		const startTime = performance.now();

		// Check for cached session profile first
		const sessionProfile = debugManager.getSessionProfile();
		if (sessionProfile && debugManager.hasValidSessionProfile()) {
			debugManager.logPerformanceTiming(
				"Profile retrieval (cached)",
				startTime,
				performance.now(),
			);
			return sessionProfile;
		}

		// Return cached profile if available
		if (this.profile) {
			debugManager.logPerformanceTiming(
				"Profile retrieval (memory)",
				startTime,
				performance.now(),
			);
			return this.profile;
		}

		// Return existing profiling promise if in progress
		if (this.profilingPromise) {
			return this.profilingPromise;
		}

		// Start profiling
		this.profilingPromise = this.performProfiling();
		this.profile = await this.profilingPromise;
		this.profilingPromise = null;

		// Cache the profile in session storage
		debugManager.saveSessionProfile(this.profile);
		debugManager.logPerformanceTiming(
			"Complete device profiling",
			startTime,
			performance.now(),
		);

		return this.profile;
	}

	/**
	 * Perform the actual device profiling
	 */
	private async performProfiling(): Promise<DeviceProfile> {
		const timestamp = Date.now();

		// Step 1: Detect if device is mobile
		const isMobile = this.detectMobile();

		// Step 2: Early exit for non-mobile devices (classify as high-tier)
		if (!isMobile) {
			const capabilities: DeviceCapabilities = {
				isMobile: false,
				deviceMemory: this.getDeviceMemory(),
				hardwareConcurrency: this.getHardwareConcurrency(),
				screenResolution: this.getScreenResolution(),
				webglSupport: this.detectWebGLSupport(),
				performanceScore: null, // Skip performance test for desktop
				networkConnection: this.detectNetworkConnection(),
			};

			return {
				tier: "high",
				capabilities,
				shouldUseShaders: true,
				timestamp,
			};
		}

		// Step 3: For mobile devices, perform detailed capability detection
		const capabilities = await this.measureDeviceCapabilities();
		const tier = this.classifyDevice(capabilities);

		// Log capabilities and classification reasoning for debugging
		logDeviceCapabilities(capabilities);
		logClassificationReasoning(capabilities, tier);

		return {
			tier,
			capabilities,
			shouldUseShaders: tier !== "low",
			timestamp,
		};
	}

	/**
	 * Detect if the device is mobile using multiple detection methods
	 * Requirements: 1.1, 1.2
	 */
	private detectMobile(): boolean {
		// Method 1: User agent analysis
		const userAgent = navigator.userAgent.toLowerCase();
		const mobileUserAgents = [
			"android",
			"iphone",
			"ipad",
			"ipod",
			"blackberry",
			"windows phone",
			"mobile",
			"webos",
			"opera mini",
		];

		const isMobileUserAgent = mobileUserAgents.some((agent) =>
			userAgent.includes(agent),
		);

		// Method 2: Touch capability detection
		const hasTouchCapability =
			"ontouchstart" in window ||
			navigator.maxTouchPoints > 0 ||
			(navigator as any).msMaxTouchPoints > 0;

		// Method 3: Screen size analysis
		const screenWidth = window.screen.width;
		const screenHeight = window.screen.height;
		const isSmallScreen = Math.min(screenWidth, screenHeight) <= 768;

		// Method 4: CSS media query check
		const isMobileMediaQuery = window.matchMedia("(max-width: 768px)").matches;

		// Combine detection methods - device is mobile if any strong indicator is present
		const isMobile =
			isMobileUserAgent ||
			(hasTouchCapability && (isSmallScreen || isMobileMediaQuery));

		if (process.env.NODE_ENV === "development") {
			console.log("DeviceProfiler: Mobile detection results:", {
				userAgent: isMobileUserAgent,
				touch: hasTouchCapability,
				smallScreen: isSmallScreen,
				mediaQuery: isMobileMediaQuery,
				final: isMobile,
			});
		}

		return isMobile;
	}

	/**
	 * Measure comprehensive device capabilities for mobile devices
	 * Requirements: 4.1, 4.4 (complete within 500ms timeout)
	 */
	private async measureDeviceCapabilities(): Promise<DeviceCapabilities> {
		try {
			// Run performance test with timeout handling
			const performanceScore = await this.runPerformanceTest();

			const capabilities: DeviceCapabilities = {
				isMobile: true,
				deviceMemory: this.getDeviceMemory(),
				hardwareConcurrency: this.getHardwareConcurrency(),
				screenResolution: this.getScreenResolution(),
				webglSupport: this.detectWebGLSupport(),
				performanceScore,
				networkConnection: this.detectNetworkConnection(),
			};

			if (process.env.NODE_ENV === "development") {
				console.log(
					"DeviceProfiler: Device capabilities measured:",
					capabilities,
				);
			}

			return capabilities;
		} catch (error) {
			// Log error with detailed context
			const profilerError: DeviceProfilerError = {
				type: "unknown",
				message:
					error instanceof Error
						? error.message
						: "Unknown error during capability measurement",
				fallbackUsed: true,
			};

			logProfilerError(profilerError, "measureDeviceCapabilities");

			// Return capabilities with conservative fallbacks on error
			return {
				isMobile: true,
				deviceMemory: 1, // Conservative fallback
				hardwareConcurrency: 2, // Conservative fallback
				screenResolution: this.getScreenResolution(),
				webglSupport: false, // Conservative fallback
				performanceScore: null, // Indicates test failed
				networkConnection: this.detectNetworkConnection(),
			};
		}
	}

	/**
	 * Detect network connection information using Navigator.connection API
	 * Falls back to null values for unsupported browsers
	 */
	private detectNetworkConnection(): NetworkConnection {
		try {
			const connection =
				(navigator as any).connection ||
				(navigator as any).mozConnection ||
				(navigator as any).webkitConnection;

			if (!connection) {
				if (process.env.NODE_ENV === "development") {
					console.log("DeviceProfiler: Network Information API not available");
				}
				return {
					effectiveType: null,
					downlink: null,
					rtt: null,
					saveData: false,
				};
			}

			const networkInfo: NetworkConnection = {
				effectiveType: connection.effectiveType || null,
				downlink:
					typeof connection.downlink === "number" ? connection.downlink : null,
				rtt: typeof connection.rtt === "number" ? connection.rtt : null,
				saveData: connection.saveData === true,
			};

			if (process.env.NODE_ENV === "development") {
				console.log(
					"DeviceProfiler: Network connection detected:",
					networkInfo,
				);
			}

			return networkInfo;
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.warn(
					"DeviceProfiler: Error detecting network connection:",
					error,
				);
			}
			return {
				effectiveType: null,
				downlink: null,
				rtt: null,
				saveData: false,
			};
		}
	}

	/**
	 * Get device memory with browser compatibility and fallback estimation
	 * Requirements: 4.2, 4.3, 6.1, 6.2
	 */
	private getDeviceMemory(): number | null {
		try {
			// Chrome/Edge support navigator.deviceMemory API
			if (
				"deviceMemory" in navigator &&
				typeof (navigator as any).deviceMemory === "number"
			) {
				const memory = (navigator as any).deviceMemory;

				if (process.env.NODE_ENV === "development") {
					console.log(
						"DeviceProfiler: Using navigator.deviceMemory:",
						memory,
						"GB",
					);
				}

				return memory;
			}

			// Fallback memory estimation for Safari/iOS and other unsupported browsers
			return this.estimateMemoryFromDeviceCharacteristics();
		} catch (error) {
			// Log memory detection error
			const profilerError: DeviceProfilerError = {
				type: "api_unavailable",
				message:
					"Error detecting device memory: " +
					(error instanceof Error ? error.message : "Unknown error"),
				fallbackUsed: true,
			};

			logProfilerError(profilerError, "getDeviceMemory");

			// Graceful fallback on any error
			return this.estimateMemoryFromDeviceCharacteristics();
		}
	}

	/**
	 * Estimate device memory using screen resolution, CPU, and device characteristics
	 * Used as fallback for Safari/iOS and other browsers without deviceMemory API
	 */
	private estimateMemoryFromDeviceCharacteristics(): number | null {
		try {
			const resolution = this.getScreenResolution();
			const cpu = this.getHardwareConcurrency();
			const userAgent = navigator.userAgent.toLowerCase();

			// Calculate total pixels for screen complexity assessment
			const totalPixels =
				resolution.width * resolution.height * resolution.devicePixelRatio;

			// iOS device detection and memory estimation
			if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
				return this.estimateIOSMemory(userAgent, resolution, totalPixels);
			}

			// Android device estimation
			if (userAgent.includes("android")) {
				return this.estimateAndroidMemory(resolution, cpu, totalPixels);
			}

			// Generic mobile device estimation
			return this.estimateGenericMobileMemory(resolution, cpu, totalPixels);
		} catch (error) {
			// Log memory estimation error
			const profilerError: DeviceProfilerError = {
				type: "unknown",
				message:
					"Error in memory estimation fallback: " +
					(error instanceof Error ? error.message : "Unknown error"),
				fallbackUsed: true,
			};

			logProfilerError(
				profilerError,
				"estimateMemoryFromDeviceCharacteristics",
			);

			// Conservative fallback - assume low memory device
			return 1;
		}
	}

	/**
	 * Estimate memory for iOS devices based on device characteristics
	 */
	private estimateIOSMemory(
		userAgent: string,
		resolution: any,
		totalPixels: number,
	): number {
		// iPhone models with known memory characteristics
		if (userAgent.includes("iphone")) {
			// High-resolution iPhones (iPhone 12 Pro and newer typically have 6GB+)
			if (totalPixels > 2500000 && resolution.devicePixelRatio >= 3) {
				return 6;
			}
			// Mid-range iPhones (iPhone 11, 12 mini typically have 4GB)
			if (totalPixels > 1500000 && resolution.devicePixelRatio >= 2) {
				return 4;
			}
			// Older iPhones typically have 2-3GB
			return 2;
		}

		// iPad estimation
		if (userAgent.includes("ipad")) {
			// iPad Pro models typically have 8GB+
			if (totalPixels > 4000000) {
				return 8;
			}
			// Regular iPads typically have 3-4GB
			return 4;
		}

		return 2; // Conservative fallback for iOS
	}

	/**
	 * Estimate memory for Android devices
	 */
	private estimateAndroidMemory(
		resolution: any,
		cpu: number,
		totalPixels: number,
	): number {
		// High-end Android devices
		if (totalPixels > 2000000 && cpu >= 6 && resolution.devicePixelRatio >= 3) {
			return 8;
		}

		// Upper mid-range devices
		if (
			totalPixels > 1500000 &&
			cpu >= 4 &&
			resolution.devicePixelRatio >= 2.5
		) {
			return 6;
		}

		// Mid-range devices
		if (totalPixels > 1000000 && cpu >= 4) {
			return 4;
		}

		// Lower mid-range devices
		if (cpu >= 2 && totalPixels > 500000) {
			return 2;
		}

		// Low-end devices
		return 1;
	}

	/**
	 * Generic mobile device memory estimation
	 */
	private estimateGenericMobileMemory(
		resolution: any,
		cpu: number,
		totalPixels: number,
	): number {
		// Conservative estimation for unknown mobile devices
		if (totalPixels > 2000000 && cpu >= 4) {
			return 4; // Assume high-end device
		} else if (totalPixels > 1000000 && cpu >= 2) {
			return 2; // Assume mid-range device
		} else {
			return 1; // Assume low-end device
		}
	}

	/**
	 * Get hardware concurrency (CPU cores) with fallback
	 * Requirements: 1.4, 1.5, 6.3
	 */
	private getHardwareConcurrency(): number {
		try {
			// Use navigator.hardwareConcurrency if available
			if (
				typeof navigator.hardwareConcurrency === "number" &&
				navigator.hardwareConcurrency > 0
			) {
				const cores = navigator.hardwareConcurrency;

				if (process.env.NODE_ENV === "development") {
					console.log("DeviceProfiler: Detected CPU cores:", cores);
				}

				return cores;
			}

			// Fallback estimation based on device characteristics
			return this.estimateCPUCores();
		} catch (error) {
			// Log CPU detection error
			const profilerError: DeviceProfilerError = {
				type: "api_unavailable",
				message:
					"Error detecting CPU cores: " +
					(error instanceof Error ? error.message : "Unknown error"),
				fallbackUsed: true,
			};

			logProfilerError(profilerError, "getHardwareConcurrency");

			// Conservative fallback
			return 2;
		}
	}

	/**
	 * Estimate CPU cores for devices where navigator.hardwareConcurrency is unavailable
	 */
	private estimateCPUCores(): number {
		const userAgent = navigator.userAgent.toLowerCase();
		const resolution = this.getScreenResolution();
		const totalPixels =
			resolution.width * resolution.height * resolution.devicePixelRatio;

		// iOS estimation
		if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
			// Modern iOS devices typically have 6+ cores
			if (totalPixels > 2000000) {
				return 6;
			}
			// Mid-range iOS devices typically have 4 cores
			if (totalPixels > 1000000) {
				return 4;
			}
			// Older iOS devices typically have 2 cores
			return 2;
		}

		// Android estimation based on screen complexity
		if (userAgent.includes("android")) {
			// High-end Android devices
			if (totalPixels > 2000000 && resolution.devicePixelRatio >= 3) {
				return 8;
			}
			// Mid-range Android devices
			if (totalPixels > 1000000) {
				return 4;
			}
			// Low-end Android devices
			return 2;
		}

		// Default fallback for unknown devices
		return 2;
	}

	/**
	 * Get screen resolution information with enhanced calculation
	 * Requirements: 1.6
	 */
	private getScreenResolution() {
		try {
			const width = window.screen.width;
			const height = window.screen.height;
			const devicePixelRatio = window.devicePixelRatio || 1;

			// Calculate effective resolution for classification
			const effectiveWidth = width * devicePixelRatio;
			const effectiveHeight = height * devicePixelRatio;

			if (process.env.NODE_ENV === "development") {
				console.log("DeviceProfiler: Screen resolution:", {
					physical: { width, height },
					devicePixelRatio,
					effective: { width: effectiveWidth, height: effectiveHeight },
					totalPixels: effectiveWidth * effectiveHeight,
				});
			}

			return {
				width,
				height,
				devicePixelRatio,
			};
		} catch (error) {
			// Log screen resolution error
			const profilerError: DeviceProfilerError = {
				type: "api_unavailable",
				message:
					"Error getting screen resolution: " +
					(error instanceof Error ? error.message : "Unknown error"),
				fallbackUsed: true,
			};

			logProfilerError(profilerError, "getScreenResolution");

			// Fallback to conservative values
			return {
				width: 375, // iPhone-like width
				height: 667, // iPhone-like height
				devicePixelRatio: 1,
			};
		}
	}

	/**
	 * Detect WebGL support with comprehensive testing
	 * Requirements: 6.3
	 */
	private detectWebGLSupport(): boolean {
		try {
			// Create a canvas element for WebGL testing
			const canvas = document.createElement("canvas");

			// Try to get WebGL context (both standard and experimental)
			const gl =
				canvas.getContext("webgl") ||
				canvas.getContext("experimental-webgl") ||
				canvas.getContext("webgl2");

			if (!gl) {
				if (process.env.NODE_ENV === "development") {
					console.log(
						"DeviceProfiler: WebGL not supported - no context available",
					);
				}
				return false;
			}

			// Additional WebGL capability checks
			const hasRequiredExtensions = this.checkWebGLExtensions(
				gl as WebGLRenderingContext,
			);
			const hasMinimumCapabilities = this.checkWebGLCapabilities(
				gl as WebGLRenderingContext,
			);

			const isSupported = hasRequiredExtensions && hasMinimumCapabilities;

			if (process.env.NODE_ENV === "development") {
				console.log("DeviceProfiler: WebGL support:", {
					contextAvailable: !!gl,
					extensions: hasRequiredExtensions,
					capabilities: hasMinimumCapabilities,
					overall: isSupported,
				});
			}

			// Clean up
			canvas.width = 1;
			canvas.height = 1;

			return isSupported;
		} catch (error) {
			// Log WebGL detection error
			const profilerError: DeviceProfilerError = {
				type: "api_unavailable",
				message:
					"Error detecting WebGL support: " +
					(error instanceof Error ? error.message : "Unknown error"),
				fallbackUsed: true,
			};

			logProfilerError(profilerError, "detectWebGLSupport");

			return false;
		}
	}

	/**
	 * Check for essential WebGL extensions
	 */
	private checkWebGLExtensions(gl: WebGLRenderingContext): boolean {
		try {
			// Check for commonly needed extensions
			const requiredExtensions = [
				"OES_texture_float",
				"OES_element_index_uint",
			];

			const optionalExtensions = [
				"WEBGL_depth_texture",
				"OES_standard_derivatives",
			];

			let requiredCount = 0;
			let optionalCount = 0;

			for (const ext of requiredExtensions) {
				if (gl.getExtension(ext)) {
					requiredCount++;
				}
			}

			for (const ext of optionalExtensions) {
				if (gl.getExtension(ext)) {
					optionalCount++;
				}
			}

			// We need at least some basic extensions for shader functionality
			return requiredCount >= 1 || optionalCount >= 2;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Check WebGL rendering capabilities
	 */
	private checkWebGLCapabilities(gl: WebGLRenderingContext): boolean {
		try {
			// Check maximum texture size (should be at least 1024 for basic functionality)
			const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
			if (maxTextureSize < 1024) {
				return false;
			}

			// Check vertex attributes (should support at least 8)
			const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
			if (maxVertexAttribs < 8) {
				return false;
			}

			// Check if we can create and compile a basic shader
			const vertexShader = gl.createShader(gl.VERTEX_SHADER);
			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

			if (!vertexShader || !fragmentShader) {
				return false;
			}

			// Test basic shader compilation
			gl.shaderSource(
				vertexShader,
				`
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
			);
			gl.compileShader(vertexShader);

			gl.shaderSource(
				fragmentShader,
				`
        precision mediump float;
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
			);
			gl.compileShader(fragmentShader);

			const vertexCompiled = gl.getShaderParameter(
				vertexShader,
				gl.COMPILE_STATUS,
			);
			const fragmentCompiled = gl.getShaderParameter(
				fragmentShader,
				gl.COMPILE_STATUS,
			);

			// Clean up shaders
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);

			return vertexCompiled && fragmentCompiled;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Run performance test to measure device performance
	 * Requirements: 2.3, 3.5, 4.1, 4.4
	 */
	private async runPerformanceTest(): Promise<number | null> {
		return new Promise((resolve) => {
			try {
				// Create canvas for performance testing
				const canvas = document.createElement("canvas");
				canvas.width = 300;
				canvas.height = 300;
				canvas.style.position = "absolute";
				canvas.style.left = "-9999px";
				canvas.style.top = "-9999px";
				document.body.appendChild(canvas);

				const ctx = canvas.getContext("2d");
				if (!ctx) {
					if (process.env.NODE_ENV === "development") {
						console.warn(
							"DeviceProfiler: Cannot get 2D context for performance test",
						);
					}
					document.body.removeChild(canvas);
					resolve(null);
					return;
				}

				// Performance test variables
				let frameCount = 0;
				let startTime = performance.now();
				let animationId: number;
				let timeoutId: NodeJS.Timeout;

				// Cleanup function
				const cleanup = () => {
					if (animationId) {
						cancelAnimationFrame(animationId);
					}
					if (timeoutId) {
						clearTimeout(timeoutId);
					}
					if (document.body.contains(canvas)) {
						document.body.removeChild(canvas);
					}
				};

				// Performance test animation loop
				const performanceLoop = () => {
					const currentTime = performance.now();
					const elapsed = currentTime - startTime;

					// Check if test duration has been reached
					if (elapsed >= PERFORMANCE_TEST_CONFIG.duration) {
						cleanup();

						// Calculate FPS
						const fps = (frameCount / elapsed) * 1000;

						if (process.env.NODE_ENV === "development") {
							console.log("DeviceProfiler: Performance test completed:", {
								frames: frameCount,
								duration: elapsed,
								fps: fps.toFixed(2),
							});
						}

						resolve(Math.round(fps));
						return;
					}

					// Render performance test graphics
					this.renderPerformanceTest(ctx, currentTime);
					frameCount++;

					// Continue animation loop
					animationId = requestAnimationFrame(performanceLoop);
				};

				// Set timeout to prevent test from running too long
				timeoutId = setTimeout(() => {
					cleanup();

					// Log performance test timeout
					const profilerError: DeviceProfilerError = {
						type: "timeout",
						message: `Performance test timed out after ${PERFORMANCE_TEST_CONFIG.timeout}ms`,
						fallbackUsed: true,
					};

					logProfilerError(profilerError, "runPerformanceTest");

					// Return null on timeout to indicate test failure
					resolve(null);
				}, PERFORMANCE_TEST_CONFIG.timeout);

				// Start performance test
				startTime = performance.now();
				animationId = requestAnimationFrame(performanceLoop);
			} catch (error) {
				// Log performance test error
				const profilerError: DeviceProfilerError = {
					type: "performance_test_failed",
					message:
						"Error during performance test: " +
						(error instanceof Error ? error.message : "Unknown error"),
					fallbackUsed: true,
				};

				logProfilerError(profilerError, "runPerformanceTest");

				resolve(null);
			}
		});
	}

	/**
	 * Render graphics for performance testing
	 * Creates medium complexity rendering to measure device performance
	 */
	private renderPerformanceTest(
		ctx: CanvasRenderingContext2D,
		time: number,
	): void {
		const width = ctx.canvas.width;
		const height = ctx.canvas.height;

		// Clear canvas
		ctx.clearRect(0, 0, width, height);

		// Create animated graphics with medium complexity
		const centerX = width / 2;
		const centerY = height / 2;
		const numShapes = 20;
		const radius = Math.min(width, height) * 0.3;

		// Animate rotation based on time
		const rotation = (time * 0.001) % (Math.PI * 2);

		// Draw multiple animated shapes
		for (let i = 0; i < numShapes; i++) {
			const angle = (i / numShapes) * Math.PI * 2 + rotation;
			const x = centerX + Math.cos(angle) * radius;
			const y = centerY + Math.sin(angle) * radius;

			// Create gradient for each shape
			const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
			gradient.addColorStop(0, `hsl(${(i * 18 + time * 0.1) % 360}, 70%, 60%)`);
			gradient.addColorStop(1, `hsl(${(i * 18 + time * 0.1) % 360}, 70%, 30%)`);

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(x, y, 15, 0, Math.PI * 2);
			ctx.fill();

			// Add some additional complexity with lines
			ctx.strokeStyle = `hsl(${(i * 18 + time * 0.1) % 360}, 50%, 40%)`;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.lineTo(x, y);
			ctx.stroke();
		}

		// Add some text rendering for additional complexity
		ctx.fillStyle = `hsl(${(time * 0.1) % 360}, 60%, 50%)`;
		ctx.font = "16px Arial";
		ctx.textAlign = "center";
		ctx.fillText("Performance Test", centerX, centerY);
	}

	/**
	 * Classify device based on capabilities using comprehensive threshold analysis
	 * Requirements: 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5
	 */
	private classifyDevice(
		capabilities: DeviceCapabilities,
	): "high" | "medium" | "low" {
		const {
			deviceMemory,
			hardwareConcurrency,
			screenResolution,
			performanceScore,
			webglSupport,
			networkConnection,
		} = capabilities;

		// Calculate effective resolution for classification
		const effectiveResolution =
			screenResolution.width * screenResolution.devicePixelRatio;

		// Detect slow network conditions
		const isSlowNetwork =
			networkConnection.effectiveType === "slow-2g" ||
			networkConnection.effectiveType === "2g" ||
			networkConnection.saveData === true;

		if (process.env.NODE_ENV === "development") {
			console.log("DeviceProfiler: Classification inputs:", {
				memory: deviceMemory,
				cpu: hardwareConcurrency,
				resolution: effectiveResolution,
				performance: performanceScore,
				webgl: webglSupport,
				network: networkConnection.effectiveType,
				saveData: networkConnection.saveData,
				isSlowNetwork,
			});
		}

		// Low-tier classification criteria (any condition triggers low-tier)
		// Requirements: 1.4 (≤1GB memory), 1.5 (≤2 CPU cores), 1.6 (<720 resolution), 2.3 (<15 FPS)
		// Also downgrade to low-tier if on very slow network (2g/slow-2g) or saveData mode
		const isLowTier =
			(deviceMemory !== null && deviceMemory <= DEVICE_THRESHOLDS.memory.low) ||
			hardwareConcurrency <= DEVICE_THRESHOLDS.cpu.low ||
			effectiveResolution < DEVICE_THRESHOLDS.resolution.low ||
			(performanceScore !== null &&
				performanceScore < DEVICE_THRESHOLDS.performance.low) ||
			!webglSupport || // No WebGL support indicates low-tier device
			isSlowNetwork; // Slow network should trigger lighter content

		if (isLowTier) {
			if (process.env.NODE_ENV === "development") {
				console.log("DeviceProfiler: Classified as LOW tier", {
					lowMemory:
						deviceMemory !== null &&
						deviceMemory <= DEVICE_THRESHOLDS.memory.low,
					lowCPU: hardwareConcurrency <= DEVICE_THRESHOLDS.cpu.low,
					lowResolution: effectiveResolution < DEVICE_THRESHOLDS.resolution.low,
					lowPerformance:
						performanceScore !== null &&
						performanceScore < DEVICE_THRESHOLDS.performance.low,
					noWebGL: !webglSupport,
					slowNetwork: isSlowNetwork,
				});
			}
			return "low";
		}

		// High-tier classification criteria (any condition triggers high-tier)
		// Requirements: 2.1 (≥4GB memory), 2.2 (≥4 CPU cores), 2.3 (≥30 FPS)
		const isHighTier =
			(deviceMemory !== null &&
				deviceMemory >= DEVICE_THRESHOLDS.memory.high) ||
			hardwareConcurrency >= DEVICE_THRESHOLDS.cpu.high ||
			(performanceScore !== null &&
				performanceScore >= DEVICE_THRESHOLDS.performance.high);

		if (isHighTier) {
			if (process.env.NODE_ENV === "development") {
				console.log("DeviceProfiler: Classified as HIGH tier", {
					highMemory:
						deviceMemory !== null &&
						deviceMemory >= DEVICE_THRESHOLDS.memory.high,
					highCPU: hardwareConcurrency >= DEVICE_THRESHOLDS.cpu.high,
					highPerformance:
						performanceScore !== null &&
						performanceScore >= DEVICE_THRESHOLDS.performance.high,
				});
			}
			return "high";
		}

		// Medium-tier for devices between low and high thresholds
		// Requirements: 3.1, 3.2, 3.3, 3.4, 3.5 (devices with 2-3GB memory, 3 CPU cores, 15-29 FPS)
		if (process.env.NODE_ENV === "development") {
			console.log("DeviceProfiler: Classified as MEDIUM tier", {
				memory: deviceMemory,
				cpu: hardwareConcurrency,
				performance: performanceScore,
				reasoning: "Falls between low and high tier thresholds",
			});
		}

		return "medium";
	}
}
