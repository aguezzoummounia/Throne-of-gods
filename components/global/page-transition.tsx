"use client";

import { usePathname, useRouter } from "next/navigation";
import {
	useRef,
	useState,
	useEffect,
	forwardRef,
	useContext,
	useCallback,
	createContext,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Portal from "./portal";
import { FooterSVG } from "../svgs/footer-svg";

gsap.registerPlugin(useGSAP);

interface PageTransitionProps {
	backgroundImage?: string;
	children: React.ReactNode;
	expandDuration?: number;
	exitDuration?: number;
	expandEase?: string;
	exitEase?: string;
}

// Default configuration object for easy prop management
const DEFAULT_TRANSITION_CONFIG = {
	expandDuration: 1.2,
	exitDuration: 1.2,
	expandEase: "power2.inOut",
	exitEase: "power2.inOut",
} as const;

// 🔧 DEBUG MODE: Set to true to always show the transition overlay for styling
const DEBUG_MODE = false;

// Context for triggering transitions
interface TransitionContextValue {
	triggerTransition: (url: string) => void;
	isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
	const context = useContext(TransitionContext);
	if (!context) {
		throw new Error(
			"usePageTransition must be used within PageTransition component",
		);
	}
	return context;
}

export function PageTransition({
	backgroundImage = "/images/bg/new-bg-2.webp",
	children,
	expandDuration = DEFAULT_TRANSITION_CONFIG.expandDuration,
	exitDuration = DEFAULT_TRANSITION_CONFIG.exitDuration,
	expandEase = DEFAULT_TRANSITION_CONFIG.expandEase,
	exitEase = DEFAULT_TRANSITION_CONFIG.exitEase,
}: PageTransitionProps) {
	const router = useRouter();
	const pathname = usePathname();
	const overlayRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const isAnimatingRef = useRef(false);
	const pendingUrlRef = useRef<string | null>(null);
	const logoAnimationCompleteRef = useRef(false);
	const [announceMessage, setAnnounceMessage] = useState<string>("");
	const [isTransitioning, setIsTransitioning] = useState(false);
	const focusedElementRef = useRef<HTMLElement | null>(null);

	// Function to trigger transition and navigate
	const triggerTransition = useCallback(
		(url: string) => {
			// Don't navigate if already on this page
			if (url === pathname) return;

			// Don't start new transition if one is in progress
			if (isAnimatingRef.current) return;

			// Check if this is just a query parameter change (filters, display mode, etc.)
			const currentUrl = new URL(pathname, window.location.origin);
			const targetUrl = new URL(url, window.location.origin);

			// If only query params changed, navigate without transition
			if (currentUrl.pathname === targetUrl.pathname) {
				router.push(url);
				return;
			}

			// Store the pending URL
			pendingUrlRef.current = url;

			// Ensure overlay element exists
			if (!overlayRef.current) {
				router.push(url);
				return;
			}

			// Store currently focused element
			focusedElementRef.current = document.activeElement as HTMLElement;

			// Set animating state
			isAnimatingRef.current = true;
			setIsTransitioning(true);

			// Announce navigation
			setAnnounceMessage("Navigating to new page");

			// Kill any existing timeline
			if (timelineRef.current) {
				timelineRef.current.kill();
			}

			// Reset logo animation flag
			logoAnimationCompleteRef.current = false;

			// Create timeline for the expand animation only
			const timeline = gsap.timeline({
				onComplete: () => {
					// Navigate after expand animation completes
					if (pendingUrlRef.current) {
						router.push(pendingUrlRef.current);
						pendingUrlRef.current = null;
					}
				},
			});

			// Get logo element
			const logo = overlayRef.current?.querySelector(".transition-logo");

			// Expand animation - rectangle slides up from bottom
			timeline
				.set(overlayRef.current, {
					opacity: 1,
					transform: "translateY(100%)",
				})
				.set(logo, {
					scale: 0.8,
					opacity: 0,
				});

			const svg = overlayRef.current?.querySelector(".transition-svg");
			if (svg) {
				timeline.set(svg, {
					scale: 0,
					opacity: 0,
				});
			}

			timeline
				.to(overlayRef.current, {
					transform: "translateY(0%)",
					duration: expandDuration,
					ease: expandEase,
				})
				// Animate SVG scaling in
				.to(
					svg,
					{
						scale: 1,
						opacity: 1,
						duration: 1.5,
						ease: "power4.out",
					},
					`-=${expandDuration * 0.8}`,
				)
				// Fade in logo slowly, starting halfway through the overlay animation
				.to(
					logo,
					{
						scale: 1,
						opacity: 1,
						duration: 0.8,
						ease: "power2.out",
						onComplete: () => {
							// Mark logo animation as complete
							logoAnimationCompleteRef.current = true;
						},
					},
					`-=${expandDuration / 2}`,
				)
				// Add minimum display time after logo appears
				.to({}, { duration: 1.75 });

			timelineRef.current = timeline;
		},
		[pathname, router, expandDuration, expandEase],
	);

	// Handle the exit animation after route change
	useEffect(() => {
		// Only run exit animation if we just navigated
		if (isAnimatingRef.current && overlayRef.current) {
			// Wait for logo animation to complete before starting exit
			let checkCount = 0;
			const maxChecks = 40; // 2 seconds max wait (40 * 50ms)

			const checkLogoComplete = () => {
				checkCount++;

				if (logoAnimationCompleteRef.current || checkCount >= maxChecks) {
					startExitAnimation();
				} else {
					setTimeout(checkLogoComplete, 50);
				}
			};

			const startExitAnimation = () => {
				// Kill any existing timeline
				if (timelineRef.current) {
					timelineRef.current.kill();
				}

				// Create exit animation timeline
				const timeline = gsap.timeline({
					onComplete: () => {
						isAnimatingRef.current = false;
						setIsTransitioning(false);

						// Announce completion
						setAnnounceMessage("Page loaded");

						// Manage focus
						requestAnimationFrame(() => {
							const mainContent = document.querySelector("main");
							const firstHeading = document.querySelector("h1");

							if (mainContent && mainContent instanceof HTMLElement) {
								if (!mainContent.hasAttribute("tabindex")) {
									mainContent.setAttribute("tabindex", "-1");
								}
								mainContent.focus({ preventScroll: true });
							} else if (firstHeading && firstHeading instanceof HTMLElement) {
								if (!firstHeading.hasAttribute("tabindex")) {
									firstHeading.setAttribute("tabindex", "-1");
								}
								firstHeading.focus({ preventScroll: true });
							} else if (
								focusedElementRef.current &&
								document.body.contains(focusedElementRef.current)
							) {
								focusedElementRef.current.focus({ preventScroll: true });
							}

							setTimeout(() => {
								setAnnounceMessage("");
							}, 1000);
						});
					},
				});

				// Get logo element
				const logo = overlayRef.current?.querySelector(".transition-logo");

				if (!logo || !overlayRef.current) {
					isAnimatingRef.current = false;
					setIsTransitioning(false);
					return;
				}

				// Exit animation - fade out logo slowly then slide up
				timeline
					.to(logo, {
						opacity: 0,
						duration: 0.6,
						ease: "power2.out",
					})
					.to(
						overlayRef.current,
						{
							transform: "translateY(-100%)",
							duration: exitDuration,
							ease: exitEase,
						},
						"-=0.3",
					)
					.set(overlayRef.current, {
						transform: "translateY(100%)",
						opacity: 0,
					})
					.set(logo, {
						scale: 0.8,
						opacity: 0,
					});

				const svg = overlayRef.current?.querySelector(".transition-svg");
				if (svg) {
					timeline.to(
						svg,
						{
							scale: 0.5,
							opacity: 0,
							duration: 0.6,
							ease: "power2.in",
						},
						"<",
					);
				}

				timelineRef.current = timeline;
			};

			checkLogoComplete();
		}
	}, [pathname, exitDuration, exitEase]);

	// Intercept link clicks to enable transition on all internal links
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const link = target.closest("a");

			if (!link) return;

			const href = link.getAttribute("href");

			// Only intercept internal links
			if (
				!href ||
				href.startsWith("http") ||
				href.startsWith("mailto:") ||
				href.startsWith("tel:") ||
				href.startsWith("#") ||
				link.target === "_blank"
			) {
				return;
			}

			// Check if it's a same-page hash link (e.g., /#reviews)
			const hasHash = href.includes("#");
			if (hasHash) {
				const [linkPath] = href.split("#");
				const currentPath = pathname;

				// If the path is the same (or empty, meaning current page), let it scroll naturally
				if (!linkPath || linkPath === currentPath) {
					return;
				}
			}

			// Prevent default and trigger transition
			e.preventDefault();
			e.stopPropagation(); // Stop propagation to prevent Next.js Link from navigating immediately
			triggerTransition(href);
		};

		// Use capture phase to intercept before Next.js Link handler
		document.addEventListener("click", handleClick, true);

		return () => {
			document.removeEventListener("click", handleClick, true);
		};
	}, [pathname, triggerTransition]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timelineRef.current) {
				timelineRef.current.kill();
				timelineRef.current = null;
			}
		};
	}, []);

	return (
		<TransitionContext.Provider value={{ triggerTransition, isTransitioning }}>
			<Portal>
				<TransitionOverlay ref={overlayRef} backgroundImage={backgroundImage} />
			</Portal>
			{/* Screen reader announcements for route changes */}
			<div
				role="status"
				aria-live="polite"
				aria-atomic="true"
				className="sr-only"
			>
				{announceMessage}
			</div>
			{children}
		</TransitionContext.Provider>
	);
}

interface TransitionOverlayProps {
	backgroundImage?: string;
}
const TransitionOverlay = forwardRef<HTMLDivElement, TransitionOverlayProps>(
	({ backgroundImage = "/images/bg/new-bg-6.webp" }, ref) => {
		const svgRef = useRef<SVGSVGElement>(null);

		useGSAP(() => {
			if (!svgRef.current) return;
			gsap.to(svgRef.current, {
				rotation: 360,
				duration: 60,
				repeat: -1,
				ease: "none",
			});
		});

		return (
			<div
				ref={ref}
				className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
				style={{
					opacity: DEBUG_MODE ? 1 : 0,
					zIndex: 999999,
					transform: DEBUG_MODE ? "translateY(0%)" : "translateY(100%)",
					willChange: "transform, opacity",
				}}
			>
				{/* Background Image */}
				<Image
					src={backgroundImage}
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>

				{/* Dark overlay for better logo visibility */}
				<div className="absolute inset-0 bg-black/5" />

				{/* Subtle gradient overlay for depth */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

				{/* Decorative line at top */}
				<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-bronze/0 to-transparent z-10" />

				{/* Rotating Spiral SVG */}
				<div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none z-0">
					<FooterSVG
						ref={svgRef}
						className="md:w-[60vh] md:h-[60vh] w-[40vh] h-[40vh] text-bronze static inset-auto transition-svg drop-shadow-[0_0_4px_rgba(244,234,143,.3)]"
					/>
				</div>

				{/* Logo */}
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<div className="relative md:w-[400px] w-[260px] aspect-video">
						<Image
							fill
							style={{
								opacity: DEBUG_MODE ? 1 : 0,
								transform: DEBUG_MODE ? "scale(1)" : "scale(.8)",
							}}
							src="/images/static/page-transition-logo.png"
							alt="Throne of Gods"
							priority
							sizes="(max-width: 768px) 200px, (max-width: 1024px) 280px, 320px"
							className="object-scale-down transition-logo aspect-video will-change-transform drop-shadow-[0_0_30px_rgba(121,111,101,0.4)]"
						/>
					</div>
				</div>
			</div>
		);
	},
);

TransitionOverlay.displayName = "TransitionOverlay";

export default PageTransition;
