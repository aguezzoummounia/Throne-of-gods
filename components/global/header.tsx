"use client";
import gsap from "gsap";
import Link from "next/link";
import Portal from "./portal";
import SmartImage from "../ui/smart-image";
import SideMenu from "./side-menu";
import NavLink from "../ui/nav-link";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useCallback, useMemo } from "react";
import { nav_links } from "@/lib/consts";
import { useHash } from "@/hooks/useHash";
import MenuToggle from "../ui/menu-toggle";
import { usePathname } from "next/navigation";
import SoundToggle from "../sound/sound-toggle";
import useBodyLockScroll from "@/hooks/useBodyLockScroll";
import { usePreloader } from "@/context/asset-loader-provider";

gsap.registerPlugin(useGSAP);

const Header: React.FC = () => {
	const { deviceCapability } = usePreloader();
	const canAnimate = deviceCapability.deviceTier === "high";

	const [isOpen, setIsOpen] = useState(false);

	const navRef = useRef<HTMLElement>(null);
	const containerRef = useRef<HTMLElement>(null);
	const logoRef = useRef<HTMLAnchorElement>(null);
	const optionsRef = useRef<HTMLDivElement>(null);

	useBodyLockScroll(isOpen);
	const hash = useHash();
	const pathname = usePathname();

	// Optimized GSAP animation with direct refs
	useGSAP(
		() => {
			if (!containerRef.current || !canAnimate) return;

			const tl = gsap.timeline();

			// Animate logo with direct ref
			if (logoRef.current) {
				tl.from(logoRef.current, {
					scale: 0,
					duration: 0.8,
					autoAlpha: 0,
					ease: "power2.out",
				});
			}

			// Animate nav links with direct ref and optimized selector
			if (navRef.current) {
				const navLinks = navRef.current.querySelectorAll(".header-nav-link");
				if (navLinks.length) {
					tl.from(
						navLinks,
						{
							yPercent: -100,
							autoAlpha: 0,
							ease: "power1.out",
							duration: 0.5,
							stagger: 0.1,
						},
						"-=0.4",
					);
				}
			}

			// Animate options with direct ref
			if (optionsRef.current) {
				const options = optionsRef.current.children;
				if (options.length) {
					tl.from(
						options,
						{
							yPercent: -100,
							autoAlpha: 0,
							duration: 0.5,
							ease: "power1.out",
							stagger: 0.1,
						},
						"-=0.4",
					);
				}
			}

			return () => {
				tl.kill();
			};
		},
		{ scope: containerRef, dependencies: [canAnimate] },
	);

	// Logo click handler - links are auto-intercepted, but we still prevent navigation to current page
	const handleLogoClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>) => {
			if (pathname === "/") {
				e.preventDefault();
				return;
			}
			// Let the link click through - PageTransition will intercept it
		},
		[pathname],
	);

	const handleMenuToggle = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	const handleMenuClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	// Memoized navigation links to prevent unnecessary re-renders
	const navigationLinks = useMemo(
		() =>
			nav_links.map((link, index) => (
				<NavLink
					href={link.hash}
					key={link.hash}
					className="header-nav-link"
					isActive={pathname === "/" && hash === link.hash}
					aria-current={
						pathname === "/" && hash === link.hash ? "page" : undefined
					}
				>
					{link.label}
				</NavLink>
			)),
		[hash, pathname],
	);

	return (
		<header
			ref={containerRef}
			role="banner"
			className="fixed top-0 left-0 w-full px-12 max-md:px-8.5 h-16 flex items-center justify-between z-20 text-primary"
			aria-label="Main navigation"
		>
			<Link
				ref={logoRef}
				href="/"
				onClick={handleLogoClick}
				className="relative cursor-pointer uppercase text-sm lg:w-[200px] w-[150px] aspect-video h-full inline-flex items-center max-md:-mt-1"
				aria-label="Throne of Gods - Home"
			>
				<SmartImage
					fill
					priority
					alt="Throne of Gods logo"
					className="object-contain"
					src="/images/static/logo.png"
				/>
			</Link>

			<nav
				ref={navRef}
				className="md:flex hidden gap-8 absolute left-1/2 -translate-x-1/2"
				role="navigation"
				aria-label="Main menu"
			>
				{navigationLinks}
			</nav>

			<div
				ref={optionsRef}
				className="md:w-[100px] w-fit flex items-center md:justify-end justify-center gap-1"
				role="group"
				aria-label="Header options"
			>
				<SoundToggle />
				<MenuToggle
					open={isOpen}
					handleClick={handleMenuToggle}
					aria-expanded={isOpen}
					aria-controls="mobile-menu"
				/>
			</div>

			<Portal>
				<SideMenu
					open={isOpen}
					handleClick={handleMenuClose}
					id="mobile-menu"
				/>
			</Portal>
		</header>
	);
};

export default Header;
