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
            y: -60,
            opacity: 0,
            duration: 0.7,
            ease: "power1.out",
          })
            .from(
              ".header-main-nav",
              {
                y: -60,
                opacity: 0,
                duration,
                ease: "power1.out",
              },
              "-=0.2"
            )
            .from(
              ".header-main-options",
              {
                y: -60,
                opacity: 0,
                duration: 0.7,
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
      <Link href="/" className="w-[100px] header-main-link">
        Home
      </Link>

      <nav className="md:flex hidden gap-8 header-main-nav">
        <NavLink href="/#about" path={`/${hash}`}>
          About
        </NavLink>
        <NavLink href="/#ereosa" path={`/${hash}`}>
          Ereosa
        </NavLink>
        <NavLink path={`/${hash}`} href="/#characters">
          Roles
        </NavLink>
        <NavLink href="/#quiz" path={`/${hash}`}>
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
