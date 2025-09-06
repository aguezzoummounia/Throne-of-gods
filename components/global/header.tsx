"use client";
import gsap from "gsap";
import Link from "next/link";
import Portal from "./portal";
import SideMenu from "./side-menu";
import NavLink from "../ui/nav-link";
import { useGSAP } from "@gsap/react";
import { useHash } from "@/hooks/useHash";
import MenuToggle from "../ui/menu-toggle";
import { useRef, useState } from "react";
import SoundToggle from "../sound/sound-toggle";
import useBodyLockScroll from "@/hooks/useBodyLockScroll";
import Image from "next/image";

type ScreenConditions = {
  isDesktop: boolean;
  isMobile: boolean;
};

const Header: React.FC = () => {
  const hash = useHash();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  useBodyLockScroll(isOpen);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: `(min-width: 768px)`,
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          // mobile version (shorter)
          const { isDesktop, isMobile } =
            context.conditions as ScreenConditions;

          const duration = isDesktop ? 0.7 : 0; // shorter

          tl.from(".header-main-link", {
            scale: 0,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          })
            .from(
              ".header-main-nav .header-nav-link",
              {
                yPercent: -100,
                autoAlpha: 0,
                ease: "power1.out",
                duration: duration,
                stagger: 0.15, // stagger links nicely
              },
              "-=0.3" // slight overlap with logo
            )

            .from(
              ".header-main-options",
              {
                yPercent: -100,
                autoAlpha: 0,
                duration: 0.6,
                ease: "power1.out",
              },
              "-=0.2"
            );
        }
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
