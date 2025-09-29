"use client";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useRef, memo } from "react";
import { useGSAP } from "@gsap/react";
import Text from "@/components/ui/text";
import { SplitText } from "gsap/SplitText";
import SmartImage from "../ui/smart-image";
import AnimatedUnderline from "../ui/animated-underline";
import ElementsSvgOutline from "@/components/elements-svg-outline";

gsap.registerPlugin(useGSAP, SplitText);

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
      if (
        !cardRef.current ||
        !titleRef.current ||
        !labelRef.current ||
        !detailsRef.current
      )
        return;

      const tl = gsap.timeline();

      // Main card animation
      tl.to(cardRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power2.out",
      });

      // Image animation (if exists)
      if (imageRef.current) {
        tl.from(
          imageRef.current,
          {
            scale: 1.3,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }

      // Text animations with proper null checks
      const titleSplit = new SplitText(titleRef.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
      });

      const labelSplit = new SplitText(labelRef.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
      });

      const pSplit = new SplitText(detailsRef.current, {
        type: "words",
        autoSplit: true,
      });

      // Add text animations to timeline
      tl.from(
        labelSplit.chars,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: { from: "random", each: 0.03 },
        },
        "-=0.6"
      )
        .from(
          titleSplit.chars,
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: { from: "random", each: 0.03 },
          },
          "-=0.3"
        )
        .from(
          pSplit.words,
          {
            duration: 0.8,
            stagger: 0.05,
            autoAlpha: 0,
            yPercent: 50,
            ease: "power2.out",
          },
          "-=0.3"
        );

      // Cleanup
      return () => {
        tl.kill();
        titleSplit.revert();
        labelSplit.revert();
        pSplit.revert();
      };
    },
    {
      scope: cardRef,
      dependencies: [title, label, details], // Re-run if content changes
    }
  );

  return (
    <div
      role="dialog"
      aria-label={`${label}: ${title}`}
      aria-live="polite"
      ref={cardRef}
      className={cn(
        "aspect-[2/3] w-[220px] h-auto bg-blurred backdrop-blur-xl absolute z-20 rounded-lg overflow-clip group",
        "transform-origin-center scale-0 invisible focus-within:ring-2 focus-within:ring-foreground/50",
        className
      )}
    >
      {type === "new" ? (
        <div className="absolute inset-0 z-1 overflow-clip bg-blurred backdrop-blur-xl rounded-[10px]">
          <SmartImage
            fill
            src={image}
            ref={imageRef}
            sizes="50vw"
            alt={`${title} location in ${label}`}
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
          <ElementsSvgOutline className="group-hover:drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]" />
        </div>
      ) : (
        <div className="absolute inset-0 z-1 overflow-clip bg-blurred backdrop-blur-xl rounded-[10px]">
          <SmartImage
            fill
            src={"/images/bg/new-bg-6.webp"}
            alt=""
            role="presentation"
            sizes="220px"
            className="object-cover power-card-image blur-xs"
          />
          <div className="relative flex w-full h-full flex-col gap-2 px-3.5 py-4">
            {/* bg-gradient-to-t from-black via-zinc-900/60 */}

            <SmartImage
              width={220}
              src={image}
              height={100}
              ref={imageRef}
              sizes="220px"
              alt={`${title} location in ${label}`}
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

export default memo(LocationCard);
