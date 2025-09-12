"use client";
import gsap from "gsap";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import AnimatedUnderline from "./animated-underline";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

interface SoundButtonProps {
  href: string;
  bare?: boolean;
  isActive?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavLink: React.FC<SoundButtonProps> = ({
  href,
  onClick,
  isActive,
  children,
  className,
  bare = false,
}) => {
  const soundEvents = useInteractiveSound();
  const divRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (href === "/" && !bare) {
        gsap.fromTo(
          divRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
        );
      }
    },
    { dependencies: [href] }
  );

  // Create a new, correctly typed handler that combines both actions
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    soundEvents.onClick(); // Call the sound hook's onClick
    if (onClick) onClick(e); // Call the onClick passed down from the Nav parent
  };

  // The rest of the sound events (onMouseEnter, onMouseLeave, etc.) can be spread
  const { onClick: soundOnClick, ...otherSoundEvents } = soundEvents;

  if (bare)
    return (
      <a
        href={href}
        {...soundEvents}
        className={cn("relative cursor-pointer uppercase text-sm", className)}
      >
        {children}
      </a>
    );
  return (
    <a
      href={href}
      {...otherSoundEvents}
      onClick={handleClick}
      className={cn(
        "relative cursor-pointer uppercase text-sm font-cinzel",
        className
      )}
    >
      {children}
      {isActive && <AnimatedUnderline />}
      {isActive && (
        <div className="absolute left-1/2 -top-[90%] -translate-x-1/2 pointer-events-none">
          {/* rotating element */}
          <div
            ref={divRef}
            className="w-[100px] h-[50px] rounded-[83%] blur-xl mix-blend-screen rotate-scale"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(244, 234, 143, 0.35) 0%, rgba(244, 234, 143, 0.1) 70%, transparent 100%)",
            }}
          />
        </div>
      )}
    </a>
  );
};

export default NavLink;
