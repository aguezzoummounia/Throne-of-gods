"use client";
import {
  site_name,
  nav_links,
  email_address,
  chanel_handler,
} from "@/lib/consts";
import { gsap } from "gsap";
import Link from "next/link";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface SideMenuProps {
  open: boolean;
  pathname: string;
  handleClick: () => void;
  activeSection: string | null;
  horizontalST: ScrollTrigger | null;
  isScrollingRef: { current: boolean };
  setActiveSection: (id: string | null) => void;
}

const SideMenu = ({
  open,
  pathname,
  handleClick,
  horizontalST,
  setActiveSection,
  isScrollingRef,
}: SideMenuProps) => {
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
            duration: 1.2,
            ease: "power2.out",
          }
        )
        // Animate the main menu links, staggering from the bottom up
        .from(
          ".menu-item-main",
          {
            autoAlpha: 0,
            yPercent: 50,
            stagger: 0.25,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.8" // Overlap with the container animation for a smoother effect
        )
        // Animate the secondary links
        .from(
          ".menu-item-secondary",
          {
            duration: 1,
            autoAlpha: 0,
            stagger: 0.1,
            yPercent: 100,
            ease: "power2.out",
          },
          "-=.8" // Overlap with the container animation for a smoother effect
        )
        // Animate the footer
        .from(
          ".menu-item-footer",
          {
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "<"
        );
    },
    { scope: container }
  );

  useGSAP(
    () => {
      if (open) {
        tl.current?.timeScale(1).play();
      } else {
        // Reverse the animation with a slightly faster timescale for a snappy close
        tl.current?.timeScale(0.5).reverse();
      }
    },
    { scope: container, dependencies: [open] }
  );

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash?: string
  ) => {
    if (pathname === "/" && hash) {
      e.preventDefault();
      let scrollTarget: string | number = hash;

      if (hash === "#about" && horizontalST) {
        scrollTarget = horizontalST.start;
      }

      // Synchronously update the ref's current value.
      // This change is immediately visible to the observers.
      isScrollingRef.current = true;
      setActiveSection(hash.substring(1));

      gsap.to(window, {
        duration: 1.5,
        scrollTo: scrollTarget,
        ease: "power2.inOut",
        onComplete: () => {
          // Set it back to false when done
          isScrollingRef.current = false;
        },
        onInterrupt: () => {
          // Also set it back if interrupted
          isScrollingRef.current = false;
        },
      });
    }
  };

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
          {nav_links.map((link, index) => {
            return (
              <li className="menu-item-main" key={`mobile-nav-link-${index}`}>
                <SideMenuLink
                  href={`/${link.hash}`}
                  handleClick={(e) => {
                    handleClick();
                    handleNavClick(e, link.hash);
                  }}
                >
                  {link.label}
                </SideMenuLink>
              </li>
            );
          })}
        </ul>
        <ul className="flex flex-col gap-1.5">
          <li className="menu-item-secondary">
            <Link
              target="_blank"
              href={chanel_handler}
              className="text-center text-[rgba(255,255,255,0.4)]"
            >
              Youtube
            </Link>
          </li>
          <li className="menu-item-secondary">
            <Link
              target="_blank"
              href={`mailto:${email_address}`}
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
  children: React.ReactNode;
  handleClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
