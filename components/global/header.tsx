"use client";
import Link from "next/link";
import NavLink from "../ui/nav-link";
import { useHash } from "@/hooks/useHash";
import SoundToggle from "../ui/sound-toggle";

const Header: React.FC = () => {
  const hash = useHash();

  return (
    <header className="fixed top-0 left-0 w-full px-12 max-md:px-6 md:h-22 h-16 flex items-center justify-between  z-20 text-primary">
      <Link href="/" className="w-[100px]">
        Home
      </Link>

      <nav className="md:flex hidden gap-6 bg-green-300">
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
      <div className="bg-red-300 w-[100px] flex items-center justify-end">
        <SoundToggle />
      </div>
    </header>
  );
};

export default Header;
