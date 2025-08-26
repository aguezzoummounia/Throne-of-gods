"use client";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Power } from "@/lib/types";
import PowerCard from "./power-card";
import { useGSAP } from "@gsap/react";
import SVGElement from "./svg-elements";
import { power_item_positions } from "@/lib/consts";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";

interface PowerItemProps {
  index: number;
  power: Power;
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
  className,
  activeIndex,
  onHoverEnd,
  onTogglePin,
  onHoverStart,
  containerRef,
}) => {
  const isOpen = activeIndex === index;
  const soundEvents = useInteractiveSound();
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
    soundEvents.onClick();
  };

  // Keyboard: Enter/Space toggle, Escape to close
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTogglePin(index);
    }
  };

  const position = power_item_positions[index] || { item: "", card: "" };

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
        {...soundEvents}
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
            src={power.image}
            alt={`${power.name} image`}
            sizes="(min-width: 768px) 110px, 78px"
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
        name={power.name}
        image={power.image}
        overview={power.overview}
        className={cn(position.card)}
      />
    </>
  );
};

export default PowerItem;
