"use client";
import gsap from "gsap";
import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import Text from "@/components/ui/text";
import { SplitText } from "gsap/SplitText";
import AnimatedUnderline from "../ui/animated-underline";
import ElementsSvgOutline from "@/components/elements-svg-outline";

gsap.registerPlugin(SplitText);

type CardType = "new" | "default";

interface PowerCardProps {
  image: string;
  title: string;
  label: string;
  type?: CardType;
  details: string;
  className?: string;
}

const LocationCard = ({
  image,
  title,
  label,
  type,
  details,
  className,
}: PowerCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const detailsRef = useRef<HTMLParagraphElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      const titleSplit = new SplitText(titleRef.current, {
        type: "chars",
        smartWrap: true,
      });
      const labelSplit = new SplitText(labelRef.current, {
        type: "chars",
        smartWrap: true,
      });
      const pSplit = new SplitText(detailsRef.current, {
        type: "words",
      });

      tl.to(cardRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 1,
        ease: "power2.out",
      })
        .from(
          imageRef.current,
          {
            scale: 1.3,
            duration: 1,
            filter: "blur(5px)",
            ease: "power2.out",
          },
          "<.3" // Start at the same time as the wrapper animation
        )
        .from(
          labelSplit.chars,
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: { from: "random", each: 0.05 },
          },
          "-=0.3" // Overlap with previous animation for a smoother feel
        )
        .from(
          titleSplit.chars,
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: { from: "random", each: 0.05 },
          },
          "<" // Overlap with previous animation for a smoother feel
        )
        .from(
          pSplit.words,
          {
            y: 10,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
            ease: "power2.out",
          },

          "<0.2" // Start 0.1s after the title animation begins
        );

      return () => {
        if (titleSplit) titleSplit.revert();
        if (labelSplit) labelSplit.revert();
        if (pSplit) pSplit.revert();
      };
    },
    {
      scope: cardRef, // <-- Set the scope here!
    }
  );

  return (
    <div
      role="dialog"
      aria-label={title}
      ref={cardRef}
      className={cn(
        "aspect-[2/3] w-[220px] h-auto bg-blurred backdrop-blur-xl absolute z-20 rounded-lg overflow-clip",
        "transform-origin-center scale-0 invisible",
        className
      )}
    >
      {type === "new" ? (
        <div className="absolute inset-0 z-1 overflow-clip bg-blurred backdrop-blur-xl rounded-[10px]">
          <Image
            fill
            src={image}
            ref={imageRef}
            sizes="500px"
            alt={`${title} power image`}
            className="object-cover power-card-image"
          />

          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-zinc-900/60 to-transparent flex flex-col px-4 py-4.5 pt-30 gap-2">
            <div className="flex flex-col gap-1">
              <Text
                as="p"
                variant="xs"
                ref={labelRef}
                className="md:text-[10px] text-[10px] power-card-label uppercase"
              >
                {label}
              </Text>
              <Text
                as="h4"
                ref={titleRef}
                variant="small"
                className="uppercase md:text-base power-card-title"
              >
                {title}
              </Text>
            </div>
            <Text
              as="p"
              ref={detailsRef}
              variant="xs"
              className="md:text-[13px] text-xs power-card-details"
            >
              {details}
            </Text>
          </div>
          <ElementsSvgOutline />
        </div>
      ) : (
        <div className="absolute inset-0 z-1 overflow-clip bg-blurred backdrop-blur-xl rounded-[10px]">
          <Image
            fill
            src={"/images/bg/new-bg-6.webp"}
            alt={`${title} power image`}
            sizes="220px"
            className="object-cover power-card-image blur-xs"
          />
          <div className="relative flex w-full h-full flex-col gap-2 px-3.5 py-4">
            {/* bg-gradient-to-t from-black via-zinc-900/60 */}

            <Image
              width={220}
              src={image}
              height={100}
              ref={imageRef}
              sizes="220px"
              alt={`${title} power image`}
              className="object-cover aspect-[5/4] rounded-[5px] power-card-image"
            />

            <div className="mt-auto to-transparent flex flex-col gap-2 text-center">
              <Text
                as="p"
                variant="xs"
                ref={labelRef}
                className="md:text-[10px] text-[10px] power-card-label uppercase"
              >
                {label}
              </Text>
              <div className="relative pb-3">
                <Text
                  as="h4"
                  ref={titleRef}
                  variant="small"
                  className="uppercase md:text-base power-card-title"
                >
                  {title}
                </Text>
                <AnimatedUnderline className="-bottom-0.5" />
              </div>
              <Text
                as="p"
                variant="xs"
                ref={detailsRef}
                className="md:text-[13px] text-xs power-card-details line-clamp-4"
              >
                {details}
              </Text>
            </div>
          </div>
          <ElementsSvgOutline />
        </div>
      )}
    </div>
  );
};

export default LocationCard;
