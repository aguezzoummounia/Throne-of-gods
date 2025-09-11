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
import { useRef, useState } from "react";
import { useAssetLoaderContext } from "@/context/asset-loader-provider";

gsap.registerPlugin(useGSAP, SplitText);

// todo:
// add logic load and cach audio, images for then reuse them on the accual components no need to reload them again
// add new svgs including the global outline lines
// add custom svgs to each section
// fix the canvas error/warning on characters slider
// improve the hero shape changes the colorSpaceToWorking, add interactivity mouse follow....
// fix footer animation breaking on other pages, has to do with scrolltrigger
// finish the powers cards container svg animations and optimize its login into a custom hooks
// change the bg images into dark images and account for home screen long height

interface PreloaderProps {
  children: React.ReactNode;
}

const Preloader = ({ children }: PreloaderProps) => {
  // const { errors, progress, isLoaded } = useAssetLoader();
  const { progress, isLoaded } = useAssetLoaderContext();

  const h4Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedTextRef = useRef<HTMLParagraphElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.addLabel("startH4", 0);
      tl.addLabel("startH2", "-=0.3"); // Start h2 0.6s after the previous animation starts

      const h4Split = new SplitText(h4Ref.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.chars, {
            autoAlpha: 0,
            stagger: { amount: 1, from: "random" },
          });
          tl.add(splitTween, "startH4");
          return splitTween;
        },
      });
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.chars, {
            autoAlpha: 0,
            stagger: { amount: 1.3, from: "start" },
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
          duration: 1,
          ease: "power2.out",
        },
        "-=.6"
      );

      return () => {
        h4Split.revert();
        h2Split.revert();
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

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleEnterClick = contextSafe(() => {
    if (isExiting) return; // Prevent multiple clicks
    setIsExiting(true);

    gsap.to(containerRef.current, {
      opacity: 0,
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        setHasEntered(true); // Mark as entered only after animation is done
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
      },
    });
  });

  if (hasEntered) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500"
      )}
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          fill
          priority
          sizes="100vw"
          alt="pre loader image"
          className="object-cover"
          src="/images/bg/new-bg-2.webp"
        />
      </div>
      <div className="absolute flex inset-0">
        <div className="flex md:gap-10 gap-8 flex-col items-center justify-center text-center lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto">
          <LabelText>
            <h4 ref={h4Ref} className="font-alegreya uppercase">
              Welcome Stranger
            </h4>
          </LabelText>
          <Text as="h2" ref={h2Ref} variant="title">
            Uncover a saga of gods, mortals, and endless strife…
          </Text>
          <div className="flex w-full items-center justify-center relative">
            <Button
              animated
              ref={buttonRef}
              onClick={handleEnterClick}
              disabled={!isLoaded || isExiting}
            >
              {!isLoaded ? "Loading the experience..." : "Start exploring"}
            </Button>
            {isLoaded && (
              <Text
                as="p"
                variant="small"
                ref={loadedTextRef}
                className="absolute right-[5%] top-0 md:text-[16px] text-[16px]"
              >
                Experience loaded
              </Text>
            )}
          </div>
        </div>
        <div className="absolute md:bottom-12 bottom-6 left-0 right-0 flex items-end justify-end px-12 max-md:px-6">
          <Text
            as="p"
            variant="xs"
            className="mx-auto text-center absolute md:left-1/2 left-6 md:-translate-x-1/2 opacity-70 md:mb-4 mb-2"
          >
            "Turn volume on, for the best experience"
          </Text>
          <AnimatedCounter progress={progress} />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
