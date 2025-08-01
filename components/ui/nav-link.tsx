"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";
import { useSound } from "@/context/sound-context";

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
  const { isSoundEnabled } = useSound();
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create the audio objects and assign them to the refs
    hoverSoundRef.current = new Audio("/sounds/hover-sf.wav");
    clickSoundRef.current = new Audio("/sounds/click-sf.wav");
  }, []);

  const playHoverSound = () => {
    if (isSoundEnabled && hoverSoundRef.current) {
      // Check if sound is enabled
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play();
    }
  };

  const playClickSound = () => {
    if (isSoundEnabled && clickSoundRef.current) {
      // Check if sound is enabled
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }
  };

  return (
    <a
      href={href}
      onMouseEnter={playHoverSound}
      onClick={() => playClickSound()}
      className={cn("relative cursor-pointer uppercase text-sm", className)}
    >
      {children}
      {href === path && (
        <Image
          width={100}
          height={50}
          src="/highlight-nobg-2.png"
          alt="highlight image - fiery line"
          className="absolute -bottom-2 w-fit"
        />
      )}
    </a>
  );
};

export default NavLink;
