"use client";
import { gsap } from "gsap";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import useEscape from "@/hooks/useEscape";
import useBodyLockScroll from "@/hooks/useBodyLockScroll";
import Text from "../ui/text";

const site_name = process.env.NEXT_PUBLIC_SITE_NAME;

const SideMenu: React.FC<{ open: boolean; handleClick: () => void }> = ({
  open,
  handleClick,
}) => {
  // hooks
  useEscape(handleClick);
  useBodyLockScroll(open);
  // refs
  const tl = useRef<gsap.core.Timeline>(null);
  const container = useRef<HTMLDivElement>(null);

  // animations
  useGSAP(
    () => {
      // Set initial state to invisible before animation
      gsap.set(container.current, { visibility: "hidden" });

      // Create a timeline for our animations
      tl.current = gsap
        .timeline({ paused: true })
        // Animate the container reveal (the "circle polygon" effect)
        .fromTo(
          container.current,
          {
            clipPath: "circle(0% at 50% 0)", // Start as a tiny circle at the top center
            visibility: "visible",
          },
          {
            clipPath: "circle(150% at 50% 0)", // Grow to a large circle to cover the screen
            duration: 1,
            ease: "power2.inOut",
          }
        )
        // Animate the main menu links, staggering from the bottom up
        .from(
          ".menu-item-main",
          {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.1" // Overlap with the container animation for a smoother effect
        )
        // Animate the secondary links
        .from(
          ".menu-item-secondary",
          {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power3.out",
          },
          "<" // Overlap with the container animation for a smoother effect
        )
        // Animate the footer
        .from(".menu-item-footer", {
          opacity: 0,
          duration: 0.2,
        });
    },
    { scope: container }
  );

  useGSAP(
    () => {
      if (open) {
        tl.current?.timeScale(1).play();
      } else {
        // Reverse the animation with a slightly faster timescale for a snappy close
        tl.current?.timeScale(1.5).reverse();
      }
    },
    { dependencies: [open] }
  );

  return (
    <div
      ref={container}
      role="dialog"
      aria-modal="true"
      aria-labelledby="side-menu-title"
      className="bg-[rgba(0,0,0,.05)] w-full h-full fixed inset-0 z-10 backdrop-blur-xl md:max-h-[80vh] rounded-lg flex-1 md:hidden flex flex-col gap-10 pt-[80px] px-8 pb-6"
    >
      {/* hidden title for screen readers */}
      <h2 id="side-menu-title" className="sr-only">
        Main Menu
      </h2>
      <div className="flex flex-col gap-12 flex-1 justify-center">
        <ul className="flex flex-col gap-[10px] font-cinzel">
          <li className="menu-item-main">
            <SideMenuLink href="#about" handleClick={handleClick}>
              About
            </SideMenuLink>
          </li>
          <li className="menu-item-main">
            <SideMenuLink href="#Ereosa" handleClick={handleClick}>
              Ereosa
            </SideMenuLink>
          </li>
          <li className="menu-item-main">
            <SideMenuLink href="#characters" handleClick={handleClick}>
              Roles
            </SideMenuLink>
          </li>
          <li className="menu-item-main">
            <SideMenuLink href="#quiz" handleClick={handleClick}>
              Quiz
            </SideMenuLink>
          </li>
        </ul>
        <ul className="flex flex-col gap-1.5">
          <li className="menu-item-secondary">
            <Link
              target="_blank"
              href="https://www.youtube.com/@ThroneofGods"
              className="text-center text-[rgba(255,255,255,0.4)]"
            >
              Youtube
            </Link>
          </li>
          <li className="menu-item-secondary">
            <Link
              target="_blank"
              href="mailto:throneofgods@gmail.com"
              className="text-center text-[rgba(255,255,255,0.4)]"
            >
              Reach out
            </Link>
          </li>
        </ul>
      </div>
      <Text
        variant="xs"
        color="lightDark"
        className="text-center menu-item-footer"
      >
        &#169; {site_name} | {new Date().getFullYear()}
      </Text>
    </div>
  );
};

export default SideMenu;

const SideMenuLink: React.FC<{
  href: string;
  target?: string;
  handleClick: () => void;
  children: React.ReactNode;
}> = ({ href, target, handleClick, children, ...props }) => {
  return (
    <Link
      {...props}
      href={href}
      target={target}
      onClick={handleClick}
      className="uppercase transition-opacity hover:opacity-70 flex items-end md:gap-8 gap-4 font-semibold text-[10vw]"
    >
      {children}
    </Link>
  );
};
