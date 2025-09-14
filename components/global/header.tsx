"use client";
import gsap from "gsap";
import Portal from "./portal";
import Image from "next/image";
import SideMenu from "./side-menu";
import NavLink from "../ui/nav-link";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { nav_links } from "@/lib/consts";
import MenuToggle from "../ui/menu-toggle";
import { usePathname } from "next/navigation";
import SoundToggle from "../sound/sound-toggle";
import useBodyLockScroll from "@/hooks/useBodyLockScroll";
import { useScrollTriggerContext } from "@/context/scroll-trigger-context";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";

gsap.registerPlugin(useGSAP);

export function slideInOut() {
  document.documentElement.animate(
    [
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transform: "translateY(0%) translateZ(0) rotateX(0deg)",
      },
      {
        opacity: 0.2,
        scale: 0.5,
        filter: "blur(35px)",
        transform: "translateY(-50%) translateZ(250px) rotateX(-80deg)",
      },
    ],
    {
      duration: 3000,
      easing: "cubic-bezier(.87,0,0.13,1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );
  document.documentElement.animate(
    [
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      },
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      },
    ],
    {
      duration: 3000,
      easing: "cubic-bezier(.87,0,0.13,1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  useBodyLockScroll(isOpen);
  const router = useTransitionRouter();

  useGSAP(
    () => {
      const tl = gsap.timeline();
      const root = (containerRef.current ?? document) as Element | Document;
      tl.from(".header-main-link", {
        scale: 0,
        duration: 1,
        autoAlpha: 0,
        ease: "power2.out",
      });

      // querySelectorAll generic ensures we get HTMLElement nodes
      const nodeList = root.querySelectorAll<HTMLElement>(
        ".header-main-nav .header-nav-link"
      );
      // turn NodeList -> Array<HTMLElement> and use a type predicate for the filter
      const navLinks = Array.from(nodeList).filter((el): el is HTMLElement => {
        // el is already HTMLElement, but this explicit predicate helps TS with later usage
        const cs = window.getComputedStyle(el);
        return (
          cs.display !== "none" &&
          cs.visibility !== "hidden" &&
          el.offsetParent !== null
        );
      });

      if (navLinks.length) {
        tl.from(
          navLinks,
          {
            yPercent: -100,
            autoAlpha: 0,
            ease: "power1.out",
            duration: 0.6,
            stagger: 0.15,
          },
          "-=0.3"
        );
      }

      tl.from(
        ".header-main-options > *",
        {
          yPercent: -100,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power1.out",
          stagger: 0.15,
        },
        "-=0.3"
      );
    },
    { scope: containerRef }
  );

  const pathname = usePathname();
  const { horizontalST, activeSection, setActiveSection, isScrollingRef } =
    useScrollTriggerContext();

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
    <header
      ref={containerRef}
      className="fixed top-0 left-0 w-full px-12 max-md:px-8 h-16 flex items-center justify-between z-20 text-primary"
    >
      <Link
        href="/"
        onClick={(e) => {
          if (pathname === "/") {
            e.preventDefault();
            return;
          }
          router.push("/", {
            onTransitionReady: slideInOut,
          });
        }}
        className="relative cursor-pointer uppercase text-sm md:w-[200px] w-[100px] h-full inline-flex header-main-link md:mt-8"
      >
        <Image
          width={300}
          height={150}
          alt="throne of gods logo"
          src="/images/temp-logo.png"
          className="md:object-scale-down object-contain"
        />
      </Link>

      <nav className="md:flex hidden gap-8 header-main-nav">
        {nav_links.map((link, index) => {
          let isActive = false;
          if (pathname === "/") {
            // If on the homepage, the active link is determined by the scrolled section
            // We strip the '#' from link.hash to compare it to the section's id

            isActive = activeSection === link.hash?.substring(1);
          } else {
            // If on another page, the active link is determined by the page's path
            isActive = pathname === link.href;
          }

          return (
            <NavLink
              isActive={isActive}
              href={`/${link.hash}`}
              key={`nav-link-${index}`}
              className="header-nav-link"
              onClick={(e) => handleNavClick(e, link.hash)}
            >
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="md:w-[100px] w-fit flex items-center md:justify-end justify-center gap-1 header-main-options">
        <SoundToggle />
        <MenuToggle open={isOpen} handleClick={() => setIsOpen(!isOpen)} />
      </div>
      <Portal>
        {isOpen && (
          <SideMenu
            open={isOpen}
            pathname={pathname}
            handleClick={() => setIsOpen(false)}
            horizontalST={horizontalST}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isScrollingRef={isScrollingRef}
          />
        )}
      </Portal>
    </header>
  );
};

export default Header;
