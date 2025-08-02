"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";
import { useSound } from "@/context/sound-context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
  const divRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
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

  useGSAP(
    () => {
      if (href === path) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
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
      onMouseEnter={playHoverSound}
      onClick={() => playClickSound()}
      className={cn("relative cursor-pointer uppercase text-sm", className)}
    >
      {children}
      {href === path && (
        <Image
          width={100}
          height={50}
          ref={imageRef}
          src="/highlight-nobg-2.png"
          alt="highlight image - fiery line"
          className="absolute -bottom-2 w-fit"
        />
      )}
      {href === path && (
        <div
          ref={divRef}
          className="absolute left-[50%] -top-[90%] -translate-x-[50%]  mix-blend-screen rounded-[83%] w-[100px] h-[50px] blur-xl"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(244, 234, 143, 0.35) 0%,rgba(244, 234, 143, 0.1) 70%,transparent 100%)",
          }}
        />
      )}
    </a>
  );
};

export default NavLink;
