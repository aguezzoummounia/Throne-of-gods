"use client";
import gsap from "gsap";
import { useRef, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import AnimatedUnderline from "./animated-underline";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";

// Only register GSAP plugins once at module level
gsap.registerPlugin(useGSAP);

interface NavLinkProps {
  href: string;
  bare?: boolean;
  isActive?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  "aria-current"?: "page" | undefined;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  onClick,
  isActive,
  children,
  className,
  bare = false,
  "aria-current": ariaCurrent,
}) => {
  const soundEvents = useInteractiveSound();
  const glowRef = useRef<HTMLDivElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  // Optimized glow animation for active state
  useGSAP(
    () => {
      if (isActive && glowRef.current) {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(glowRef.current, {
          scale: 1.1,
          opacity: 0.8,
          duration: 2,
          ease: "power2.inOut",
        });
        return () => tl.kill();
      }
    },
    { dependencies: [isActive] }
  );

  // Optimized click handler with proper event handling
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Play sound effect
      soundEvents.onClick();

      // Call custom onClick if provided
      if (onClick) {
        onClick(e);
      }
    },
    [soundEvents, onClick]
  );

  // Memoized class names for performance
  const linkClasses = useMemo(
    () =>
      cn(
        "relative cursor-pointer uppercase text-sm transition-colors duration-200",
        bare ? "" : "font-cinzel hover:text-primary/80 focus:text-primary/80",
        // "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm",
        className
      ),
    [bare, className]
  );

  // Destructure sound events for cleaner spreading
  const { onClick: soundOnClick, ...otherSoundEvents } = soundEvents;

  // Bare version for simple links
  if (bare) {
    return (
      <a
        ref={linkRef}
        href={href}
        {...soundEvents}
        className={linkClasses}
        aria-label={typeof children === "string" ? children : undefined}
      >
        {children}
      </a>
    );
  }

  // Full navigation link with active state indicators
  return (
    <a
      ref={linkRef}
      href={href}
      {...otherSoundEvents}
      onClick={handleClick}
      className={linkClasses}
      aria-current={ariaCurrent}
      aria-label={`Navigate to ${children}`}
      role="menuitem"
    >
      {children}

      {/* Active state indicators */}
      {isActive && (
        <>
          <AnimatedUnderline />
          <div
            className="absolute left-1/2 -top-[90%] -translate-x-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <div
              ref={glowRef}
              className="w-[100px] h-[50px] rounded-[83%] blur-xl mix-blend-screen"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(244, 234, 143, 0.35) 0%, rgba(244, 234, 143, 0.1) 70%, transparent 100%)",
              }}
            />
          </div>
        </>
      )}
    </a>
  );
};

export default NavLink;
