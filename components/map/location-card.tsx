"use client";
import gsap from "gsap";
import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import Text from "@/components/ui/text";
import { SplitText } from "gsap/SplitText";
import ElementsSvgOutline from "@/components/elements-svg-outline";

interface PowerCardProps {
  image: string;
  title: string;
  isOpen: boolean;
  details: string;
  className?: string;
}

const LocationMap = ({
  image,
  title,
  isOpen,
  details,
  className,
}: PowerCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      tl.current = gsap.timeline({ paused: true });
      const titleSplit = new SplitText(".power-card-title", {
        type: "chars",
        smartWrap: true,
      });

      tl.current
        .to(cardRef.current, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          ".power-card-image-wrapper",
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.8,
            ease: "power3.inOut",
          },
          "<0.2" // Start 0.2s after the card reveal begins
        )
        .from(
          ".power-card-image",
          {
            scale: 1.3,
            duration: 0.8,
            ease: "power3.inOut",
          },
          "<" // Start at the same time as the wrapper animation
        )
        .from(
          titleSplit.chars,
          {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.out",
            stagger: { from: "random", each: 0.05 },
          },
          "-=0.5" // Overlap with previous animation for a smoother feel
        )
        .from(
          ".power-card-details",
          {
            filter: "blur(5px)",
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "<0.1" // Start 0.1s after the title animation begins
        );

      return () => {
        if (titleSplit) titleSplit.revert();
      };
    },
    {
      scope: cardRef, // <-- Set the scope here!
    }
  );

  useGSAP(
    () => {
      if (isOpen) {
        // If the card should be open, play the timeline forward.
        tl.current?.play(0);
      } else {
        tl.current?.progress(0).pause();
      }
    },
    { dependencies: [isOpen] }
  );
  return (
    <div
      ref={cardRef}
      className={cn(
        "max-h-[34rem] max-w-[14rem] h-auto w-full mix-blend-difference bg-blurred backdrop-blur-xl absolute px-4 py-4.5 z-20 rounded-lg overflow-clip",
        "transform-origin-center scale-0 invisible",
        className
      )}
    >
      <ElementsSvgOutline />
      <div className="flex flex-col gap-3">
        <div className="w-full aspect-[3/2] relative mb-2 overflow-hidden power-card-image-wrapper">
          <Image
            fill
            src={image}
            alt={`${title} power image`}
            sizes="14rem"
            className="object-cover power-card-image"
          />
        </div>
        <Text
          as="h4"
          variant="small"
          className="uppercase md:text-base power-card-title"
        >
          {title}
        </Text>
        <Text
          as="p"
          variant="xs"
          className="mb-2 md:text-[13px] text-xs power-card-details"
        >
          {details}
        </Text>
      </div>
    </div>
  );
};

export default LocationMap;
