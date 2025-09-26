"use client";
import {
  site_name,
  nav_links,
  email_address,
  channel_handler,
} from "@/lib/consts";
import { gsap } from "gsap";
import Link from "next/link";
import Text from "../ui/text";
import { useGSAP } from "@gsap/react";
import { useRef, useCallback, useMemo, useEffect } from "react";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";

gsap.registerPlugin(useGSAP);

interface SideMenuProps {
  open: boolean;
  handleClick: () => void;
  id?: string;
}

const SideMenu = ({ open, handleClick, id = "side-menu" }: SideMenuProps) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainLinksRef = useRef<HTMLUListElement>(null);
  const secondaryLinksRef = useRef<HTMLUListElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Initialize timeline once
  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Set initial hidden state
      gsap.set(containerRef.current, {
        clipPath: "circle(0% at 50% 0)",
        pointerEvents: "none",
      });

      // Create optimized timeline with direct refs
      timelineRef.current = gsap
        .timeline({ paused: true })
        .to(containerRef.current, {
          clipPath: "circle(150% at 50% 0)",
          pointerEvents: "auto",
          duration: 0.8,
          ease: "power2.out",
        })
        .from(
          mainLinksRef.current?.children || [],
          {
            autoAlpha: 0,
            yPercent: 30,
            stagger: 0.15,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .from(
          secondaryLinksRef.current?.children || [],
          {
            autoAlpha: 0,
            yPercent: 50,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .from(
          footerRef.current,
          {
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.3"
        );

      return () => {
        timelineRef.current?.kill();
      };
    },
    { scope: containerRef }
  );

  // Handle open/close state changes
  useGSAP(
    () => {
      if (!timelineRef.current) return;

      if (open) {
        timelineRef.current.timeScale(1).play();
      } else {
        timelineRef.current.timeScale(1.5).reverse();
      }
    },
    { dependencies: [open] }
  );

  // Handle escape key and focus management
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClick();
      }
    };

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key === "Tab" && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleFocusTrap);

    // Focus first element when menu opens
    const firstFocusable = containerRef.current?.querySelector(
      "a[href]"
    ) as HTMLElement;
    firstFocusable?.focus();

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [open, handleClick]);

  // Memoized navigation links
  const navigationLinks = useMemo(
    () =>
      nav_links.map((link) => (
        <li key={link.hash}>
          <SideMenuLink
            href={link.hash}
            handleClick={handleClick}
            aria-label={`Navigate to ${link.label}`}
          >
            {link.label}
          </SideMenuLink>
        </li>
      )),
    [handleClick]
  );

  // Memoized secondary links
  const secondaryLinks = useMemo(
    () => [
      {
        href: channel_handler,
        label: "Youtube",
        external: true,
        ariaLabel: "Visit our YouTube channel (opens in new tab)",
      },
      {
        href: `mailto:${email_address}`,
        label: "Reach out",
        external: true,
        ariaLabel: "Send us an email (opens email client)",
      },
    ],
    []
  );

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="side-menu-title"
      aria-describedby="side-menu-description"
      id={id}
      className="bg-[rgba(0,0,0,.05)] w-full h-full fixed inset-0 z-10 backdrop-blur-xl md:max-h-[80vh] rounded-lg flex-1 md:hidden flex flex-col gap-10 pt-[80px] px-8 pb-6"
    >
      <h2 id="side-menu-title" className="sr-only">
        Main Navigation Menu
      </h2>
      <p id="side-menu-description" className="sr-only">
        Use arrow keys to navigate, Enter to select, or Escape to close
      </p>

      <div className="flex flex-col gap-12 flex-1 justify-center">
        <nav role="navigation" aria-label="Main menu">
          <ul
            ref={mainLinksRef}
            className="flex flex-col gap-[10px] font-cinzel"
            role="menubar"
          >
            {navigationLinks}
          </ul>
        </nav>

        <nav role="navigation" aria-label="External links">
          <ul ref={secondaryLinksRef} className="flex flex-col gap-1.5">
            {secondaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.6)] transition-colors duration-200"
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div ref={footerRef} className="flex items-center justify-center pb-1">
        <Text
          variant="xs"
          color="lightDark"
          className="text-center"
          role="contentinfo"
        >
          &#169; {site_name} | {new Date().getFullYear()}
        </Text>
      </div>
    </div>
  );
};

export default SideMenu;

// Optimized SideMenuLink component
const SideMenuLink: React.FC<{
  href: string;
  children: React.ReactNode;
  handleClick: () => void;
  "aria-label"?: string;
}> = ({ href, handleClick, children, "aria-label": ariaLabel }) => {
  const soundEvents = useInteractiveSound();

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      soundEvents.onClick();
      handleClick();
    },
    [soundEvents, handleClick]
  );

  return (
    <Link
      href={href}
      {...soundEvents}
      onClick={handleLinkClick}
      className="uppercase transition-all duration-200 hover:opacity-70 focus:opacity-70 flex items-end gap-4 font-semibold text-[10vw]"
      role="menuitem"
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
};
