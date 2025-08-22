"use client";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import PowerCard from "./power-card";
import { useGSAP } from "@gsap/react";
import SVGElement from "./svg-elements";

const powerItemPositions = [
  {
    // index 0
    item: "md:top-[3%] top-[3%] md:left-[30%] left-[3%]",
    card: "md:top-[3%] -top-10 md:left-[calc(30%_+_185px)] left-[calc(3%_+_70px)]",
  },
  {
    // index 1
    item: "top-[30%] md:right-[5%] right-[3%]",
    card: "md:top-[30%] top-[20%] md:right-[calc(180px_+_5%)] right-[calc(3%_+_70px)]",
  },
  {
    // index 2
    item: "md:top-[45%] top-[50%] md:left-[5%] left-0",
    card: "md:top-[45%] top-[40%] md:left-[calc(5%_+_180px)] left-[70px]",
  },
  {
    // index 3
    item: "md:bottom-[5%] bottom-[5%] md:right-[20%] right-0",
    card: "md:-bottom-0 -bottom-[5%] md:right-[calc(20%_+_180px)] right-[70px]",
  },
  // You can now easily add a 5th, 6th, etc. item here without crashing the app.
];

interface PowerItemProps {
  index: number;
  power: string;
  image: string;
  className?: string;
  isSelected?: boolean;
  onHoverEnd: () => void;
  onHoverStart: () => void;
  activeIndex: number | null;
  handleSelected?: () => void;
  onTogglePin: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>; //
}
const PowerItem: React.FC<PowerItemProps> = ({
  index,
  power,
  image,
  className,
  activeIndex,
  onHoverEnd,
  onTogglePin,
  onHoverStart,
  containerRef,
}) => {
  const isOpen = activeIndex === index;
  const itemRef = useRef<HTMLDivElement>(null);

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") {
      onHoverStart();
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") {
      onHoverEnd();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin(index);
  };

  // Keyboard: Enter/Space toggle, Escape to close
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTogglePin(index);
    }
  };

  const position = powerItemPositions[index] || { item: "", card: "" };

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      // Clear CSS transitions to avoid conflicts
      gsap.set(itemRef.current, { clearProps: "transform" });
      gsap.set(".power-item-svg", { clearProps: "transform" });

      // Animate the card
      tl.from(itemRef.current, {
        duration: 2,
        opacity: 0,
        y: 100,
        scale: 0.5,
        rotation: 90,
        ease: "power3.out",
        delay: index * 0.3, // Delay based on index
      });

      // Animate image
      tl.from(
        ".power-item-image",
        {
          duration: 1,
          opacity: 0,
          scale: 0.5,
          ease: "power3.out",
        },
        0.6 // Slight offset after SVG
      );
    },
    { scope: itemRef, dependencies: [index, containerRef] }
  );

  return (
    <>
      <div
        ref={itemRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-label={`Show details for ${power}`}
        className={cn(
          "power-item flex items-center justify-center group cursor-pointer md:size-[200px] size-[130px] group absolute",
          position.item,
          className
        )}
      >
        <div
          // color-dodge hard-light luminosity
          className="w-full h-full rounded-[83%] blur-xl mix-blend-difference rotate-scale absolute scale-80 group-hover:scale-100 transition-transform duration-500 delay-50 ease-[cubic-bezier(.16,1,.3,1)] z-2"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(244, 234, 143, 0.5) 0%, rgba(244, 234, 143, 0.1) 70%, transparent 100%)",
          }}
        ></div>
        <div className="md:size-[55%] size-[60%] flex items-center justify-center relative z-3">
          <Image
            fill
            src={image}
            alt="planet image"
            className="object-cover overflow-clip rounded-full power-item-image"
          />
        </div>
        <SVGElement
          index={index}
          className="transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] svg-element group-hover:scale-102 power-item-svg"
        />
      </div>

      <PowerCard
        isOpen={isOpen}
        title="Power title"
        className={cn(position.card)}
        image="/images/characters/character-3.jpeg"
        details="Sacred Flame / Purifying Fire: A divine power he possessed and corrupted for monetary gain. This power, when corrupted, led to the blood curse."
      />
    </>
  );
};

export default PowerItem;
