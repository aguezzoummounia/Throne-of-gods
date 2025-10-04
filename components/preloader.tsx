"use client";
import { gsap } from "gsap";
import Text from "./ui/text";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import AnimatedCounter from "./counter";
import LabelText from "./ui/label-text";
import Button from "./ui/button-or-link";
import Container from "./global/container";
import ImagesUnderline from "./global/images-underline";
import { usePreloader } from "@/context/asset-loader-provider";
import { useRef, useState, useCallback, useMemo } from "react";

gsap.registerPlugin(useGSAP, SplitText);

interface PreloaderProps {
  children: React.ReactNode;
}

// Memoized component to prevent unnecessary re-renders
const PreloaderContent = ({
  progress,
  isLoaded,
  onEnterClick,
  isExiting,
  deviceCapability,
}: {
  progress: number;
  isLoaded: boolean;
  onEnterClick: () => void;
  isExiting: boolean;
  deviceCapability: {
    deviceTier: "high" | "medium" | "low" | null;
    shouldUseShaders: boolean;
    isProfiled: boolean;
    capabilities: any;
  };
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const h4Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loadedTextRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({ paused: true });

      tl.from(h4Ref.current, {
        autoAlpha: 0,
        yPercent: 100,
        duration: 1.2,
        ease: "power2.out",
      }).add("startH2", "-=.3");
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.chars, {
            autoAlpha: 0,
            stagger: { amount: 1.2, from: "center" },
          });
          tl.add(splitTween, "startH2");
          return splitTween;
        },
      });
      tl.from(
        buttonRef.current,
        {
          yPercent: 100,
          autoAlpha: 0,
          duration: 1.2,
          ease: "power2.out",
        },
        "-=.3"
      );
      // Play entrance animation
      tl.play();

      return () => {
        tl.kill();
        h2Split?.revert();
      };
    },
    { scope: containerRef }
  );
  useGSAP(
    () => {
      if (isLoaded) {
        gsap.from(loadedTextRef.current, {
          autoAlpha: 0,
          yPercent: 100,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3,
        });
      }
    },
    {
      dependencies: [isLoaded],
      scope: containerRef,
    }
  );
  return (
    <Container
      as="section"
      ref={containerRef}
      className="absolute flex inset-0"
    >
      <div className="flex md:gap-10 gap-8 flex-col items-center justify-center text-center lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto">
        <LabelText>
          <h4
            ref={h4Ref}
            className="font-alegreya uppercase"
            aria-label="Welcome message"
          >
            Welcome Stranger
          </h4>
        </LabelText>
        <Text
          as="h2"
          ref={h2Ref}
          variant="title"
          aria-label="Main preloader message"
        >
          Uncover a saga of gods, mortals, and endless strife…
        </Text>
        <div className="flex w-full gap-4 max-md:flex-col items-center justify-center relative px-5">
          <Button
            animated
            ref={buttonRef}
            onClick={onEnterClick}
            disabled={!isLoaded || !deviceCapability.isProfiled || isExiting}
            aria-label={
              !isLoaded
                ? "Loading in progress"
                : !deviceCapability.isProfiled
                ? "Optimizing for your device..."
                : "Start the experience"
            }
          >
            {!isLoaded
              ? "Loading the experience..."
              : !deviceCapability.isProfiled
              ? "Optimizing for your device..."
              : "Start exploring"}
          </Button>
          {isLoaded && deviceCapability.isProfiled && (
            <Text
              as="p"
              variant="small"
              ref={loadedTextRef}
              className="md:absolute right-[5%] top-0 md:text-[16px] text-[14px] max-md:ml-auto max-md:mt-4"
              aria-live="polite"
            >
              {deviceCapability.deviceTier && <>Experience Loaded.</>}
            </Text>
          )}
        </div>
      </div>
      <div className="absolute md:bottom-12 bottom-6 left-0 right-0 flex items-end justify-between px-12 max-md:px-6 gap-4">
        <Text
          as="p"
          variant="xs"
          className="text-left opacity-70 md:absolute md:left-1/2 md:-translate-x-1/2 max-md:text-[10px] max-md:max-w-[150px] leading-tight"
          aria-label="Audio recommendation"
        >
          "Turn volume on, for the best experience"
        </Text>
        <AnimatedCounter progress={progress} />
      </div>
    </Container>
  );
};

const Preloader = ({ children }: PreloaderProps) => {
  const { progress, isLoaded, deviceCapability } = usePreloader();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Handle hash scrolling after preloader exit
  const handleHashScroll = useCallback(() => {
    const hash = window.location.hash;
    if (hash) {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  }, []);

  // Memoize the enter click handler to prevent unnecessary re-renders
  const handleEnterClick = useCallback(() => {
    if (isExiting || !containerRef.current) return;

    // Ensure device profiling is complete before allowing exit
    if (!deviceCapability.isProfiled) {
      if (process.env.NODE_ENV === "development") {
        console.log("[Preloader] Device profiling not complete, waiting...");
      }
      return;
    }

    setIsExiting(true);

    // Animate preloader out
    gsap.to(containerRef.current, {
      opacity: 0,
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        setHasEntered(true);
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
        // Handle hash scrolling after animation completes
        handleHashScroll();
      },
    });
  }, [isExiting, handleHashScroll, deviceCapability.isProfiled]);

  // Memoize content props to prevent unnecessary re-renders
  const contentProps = useMemo(
    () => ({
      progress,
      isLoaded,
      onEnterClick: handleEnterClick,
      isExiting,
      deviceCapability,
    }),
    [progress, isLoaded, handleEnterClick, isExiting, deviceCapability]
  );

  return (
    <>
      {/* Always render images underline as seamless background */}
      <ImagesUnderline />

      {/* Render children after preloader is dismissed */}
      {hasEntered && children}

      {/* Preloader overlay - only show when not entered */}
      {!hasEntered && (
        <div
          ref={containerRef}
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500"
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="preloader-title"
          aria-describedby="preloader-description"
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              fill
              priority
              sizes="100vw"
              alt="Preloader background showing mythological scene"
              className="object-cover"
              src="/images/bg/new-bg-2.webp"
            />
          </div>
          <PreloaderContent {...contentProps} />
        </div>
      )}
    </>
  );
};

export default Preloader;
