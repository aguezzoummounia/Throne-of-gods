"use client";
import gsap from "gsap";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import AnimatedUnderline from "./animated-underline";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";

interface SoundButtonProps {
  href: string;
  path: string;
  className?: string;
  children: React.ReactNode;
}

const NavLink: React.FC<SoundButtonProps> = ({
  href,
  path,
  children,
  className,
}) => {
  const soundEvents = useInteractiveSound();
  const divRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (href === path) {
        gsap.fromTo(
          divRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
        );
      }
    },
    { dependencies: [href, path] }
  );

  return (
    <a
      href={href}
      {...soundEvents}
      className={cn("relative cursor-pointer uppercase text-sm", className)}
    >
      {children}
      {href === path && <AnimatedUnderline />}
      {href === path && (
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
