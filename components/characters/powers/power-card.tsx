"use client";
import gsap from "gsap";
import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import Text from "@/components/ui/text";
import { SplitText } from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import TiltedCardWrapper from "@/components/tilted-card-wrapper";
import ElementsSvgOutline from "@/components/elements-svg-outline";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface PowerCardProps {
  name: string;
  image: string;
  overview: string;
  className?: string;
}

const PowerCard: React.FC<PowerCardProps> = ({
  name,
  image,
  overview,
  className,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        },
      });
      const titleSplit = new SplitText(".power-card-title", {
        type: "chars",
        smartWrap: true,
      });
      const pSplit = new SplitText(".power-card-details", {
        type: "words",
      });

      tl.to(cardRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power2.out",
      })
        .from(".power-card-image", {
          scale: 1.3,
          duration: 1,
          filter: "blur(5px)",
          ease: "power2.out",
        })
        .from(
          titleSplit.chars,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            stagger: { from: "random", each: 0.05 },
          },
          "-=0.3" // Overlap with previous animation for a smoother feel
        )
        .from(
          pSplit.words,
          {
            y: 10,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power2.out",
          },

          "<0.2" // Start 0.1s after the title animation begins
        );

      return () => {
        if (titleSplit) titleSplit.revert();
        if (pSplit) pSplit.revert();
      };
    },
    {
      scope: cardRef,
    }
  );

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute md:w-[250px] w-[230px] aspect-[2/3] scale-0 invisible",
        className
      )}
    >
      <TiltedCardWrapper className={cn("w-full h-full")}>
        {/* TODO: change this shape into the one similar to the custom 3d slider */}
        <div
          className="w-full h-full rounded-[83%] blur-xl mix-blend-difference rotate-scale absolute -z-1 group-hover:scale-100 transition-transform duration-500 delay-50 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(244, 234, 143, 0.5) 0%, rgba(244, 234, 143, 0.1) 70%, transparent 100%)",
          }}
        ></div>
        <div className="absolute inset-0 z-1 overflow-clip bg-blurred backdrop-blur-xl rounded-[10px] power-card-image-wrapper">
          <Image
            fill
            src={image}
            alt={`${name} image`}
            className="object-cover power-item-image power-card-image"
          />

          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-zinc-900/60 to-transparent flex flex-col px-4 py-4.5 pt-30 gap-2">
            <Text
              as="h4"
              variant="small"
              className="uppercase md:text-base text-base power-card-title"
            >
              {name}
            </Text>
            <Text
              as="p"
              variant="xs"
              className="md:text-[13px] text-xs power-card-details"
            >
              {overview}
            </Text>
          </div>
          <ElementsSvgOutline />
        </div>
      </TiltedCardWrapper>
    </div>
  );
};

export default PowerCard;
