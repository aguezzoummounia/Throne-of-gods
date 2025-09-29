"use client";
import gsap from "gsap";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef, memo } from "react";
import { useGSAP } from "@gsap/react";
import Text from "@/components/ui/text";
import { SplitText } from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import TiltedCardWrapper from "@/components/tilted-card-wrapper";
import ElementsSvgOutline from "@/components/elements-svg-outline";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

interface PowerCardProps {
  name: string;
  image: string;
  overview: string;
  className?: string;
}

const PowerCard = memo<PowerCardProps>(function PowerCard({
  name,
  image,
  overview,
  className,
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          once: true, // Only animate once for better performance
        },
      });

      // Set initial will-change for better performance
      gsap.set(cardRef.current, { willChange: "transform, opacity" });
      gsap.set(".power-card-image", { willChange: "transform" });

      tl.to(cardRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power2.out",
        force3D: true, // Force hardware acceleration
      })
        .from(
          ".power-card-image",
          {
            scale: 1.3,
            duration: 1,
            ease: "power2.out",
            force3D: true,
          },
          "-=.4"
        )
        .addLabel("label", "-=.6")
        .addLabel("title", "-=.3");

      const titleSplit = new SplitText(".power-card-title", {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.chars, {
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: { from: "random", each: 0.05 },
          });
          tl.add(splitTween, "label");
          return splitTween;
        },
      });
      const pSplit = new SplitText(".power-card-details", {
        type: "words",
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.words, {
            duration: 1,
            stagger: 0.1,
            autoAlpha: 0,
            yPercent: 100,
            ease: "power4.out",
          });
          tl.add(splitTween, "title");
          return splitTween;
        },
      });

      return () => {
        // Clean up will-change properties
        gsap.set(cardRef.current, { willChange: "auto" });
        gsap.set(".power-card-image", { willChange: "auto" });
        pSplit.revert();
        titleSplit.revert();
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
        "absolute z-[1] md:w-[250px] w-[230px] aspect-[2/3] scale-0 invisible transform-gpu",
        className
      )}
    >
      <TiltedCardWrapper className={cn("w-full h-full")}>
        <div className="absolute inset-0 z-1 overflow-clip bg-blurred backdrop-blur-xl rounded-[10px] power-card-image-wrapper group">
          <Image
            fill
            src={image}
            sizes="50vw"
            alt={`${name} image`}
            className="object-cover power-item-image power-card-image transform-gpu"
            priority={false}
            loading="lazy"
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

          <ElementsSvgOutline className="drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]" />
        </div>
      </TiltedCardWrapper>
    </div>
  );
});

export default PowerCard;
