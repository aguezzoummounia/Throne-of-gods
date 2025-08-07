"use client";
import Link from "next/link";
import Portal from "./portal";
import { useState } from "react";
import SideMenu from "./side-menu";
import NavLink from "../ui/nav-link";
import { useHash } from "@/hooks/useHash";
import MenuToggle from "../ui/menu-toggle";
import SoundToggle from "../ui/sound-toggle";

const Header: React.FC = () => {
  const hash = useHash();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full px-12 max-md:px-8 h-16 flex items-center justify-between z-20 text-primary">
      <Link href="/" className="w-[100px]">
        Home
      </Link>

      <nav className="md:flex hidden gap-8">
        <NavLink href="#about" path={hash}>
          About
        </NavLink>
        <NavLink href="#ereosa" path={hash}>
          Ereosa
        </NavLink>
        <NavLink path={hash} href="#characters">
          Roles
        </NavLink>
        <NavLink href="#quiz" path={hash}>
          Quiz
        </NavLink>
      </nav>
      <div className="md:w-[100px] w-fit flex items-center md:justify-end justify-center gap-1">
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
