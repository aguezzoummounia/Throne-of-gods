"use client";
import gsap from "gsap";
import Portal from "./portal";
import Image from "next/image";
import SideMenu from "./side-menu";
import NavLink from "../ui/nav-link";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { useHash } from "@/hooks/useHash";
import MenuToggle from "../ui/menu-toggle";
import SoundToggle from "../sound/sound-toggle";
import useBodyLockScroll from "@/hooks/useBodyLockScroll";

gsap.registerPlugin(useGSAP);

const Header: React.FC = () => {
  const hash = useHash();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  useBodyLockScroll(isOpen);

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

  return (
    <header
      ref={containerRef}
      className="fixed top-0 left-0 w-full px-12 max-md:px-8 h-16 flex items-center justify-between z-20 text-primary"
    >
      <NavLink
        href="/"
        path={`/`}
        bare={true}
        className="md:w-[200px] w-[100px] h-full inline-flex header-main-link md:mt-8"
      >
        <Image
          width={300}
          height={150}
          alt="throne of gods logo"
          src="/images/temp-logo.png"
          className="md:object-scale-down object-contain"
        />
      </NavLink>

      <nav className="md:flex hidden gap-8 header-main-nav">
        <NavLink className="header-nav-link" href="/#about" path={`/${hash}`}>
          About
        </NavLink>
        <NavLink className="header-nav-link" href="/#ereosa" path={`/${hash}`}>
          Ereosa
        </NavLink>
        <NavLink
          className="header-nav-link"
          path={`/${hash}`}
          href="/#characters"
        >
          Roles
        </NavLink>
        <NavLink className="header-nav-link" href="/#quiz" path={`/${hash}`}>
          Quiz
        </NavLink>
      </nav>
      <div className="md:w-[100px] w-fit flex items-center md:justify-end justify-center gap-1 header-main-options">
        <SoundToggle />
        <MenuToggle open={isOpen} handleClick={() => setIsOpen(!isOpen)} />
      </div>
      <Portal>
        {isOpen && (
          <SideMenu open={isOpen} handleClick={() => setIsOpen(false)} />
        )}
      </Portal>
    </header>
  );
};

export default Header;
