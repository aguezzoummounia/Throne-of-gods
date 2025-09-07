"use client";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface RotatingDiv {
  className?: string;
  children: React.ReactNode;
}

const MAX_ROTATION_ANGLE = 15;

function RotatingDiv({ children, className }: RotatingDiv) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canHover = useMediaQuery("(hover: hover)");

  // We use refs to store these values because they will change frequently
  // and we don't want to trigger React re-renders.
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  useEffect(() => {
    if (!canHover) {
      gsap.to(boxRef.current, { rotation: 0, duration: 0.1 });
      return;
    }

    // 1. The mousemove handler now ONLY updates the target value.
    // It no longer triggers any animations itself.
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const width = window.innerWidth;
      const progress = x / width;
      targetRotation.current = progress * MAX_ROTATION_ANGLE;
    };

    // 2. We create an "update" function that will run on every frame.
    // This is the core of the smoothing logic.
    const updateRotation = () => {
      // Calculate the difference between the target and current rotation
      const diff = targetRotation.current - currentRotation.current;

      // Move the current rotation a fraction of the way towards the target.
      // The "0.05" is the easing factor. A smaller number means more "lag" and a smoother effect.
      // A larger number makes it more responsive. Feel free to tweak this!
      currentRotation.current += diff * 0.05;

      // Apply the new rotation directly to the element.
      // We use gsap.set for direct manipulation on each frame.
      gsap.set(boxRef.current, { rotation: currentRotation.current });
    };

    // 3. Add the event listener for mouse movement.
    window.addEventListener("mousemove", handleMouseMove);

    // 4. Add our update function to GSAP's ticker, so it runs on every frame.
    gsap.ticker.add(updateRotation);

    // 5. Cleanup: It is CRUCIAL to remove BOTH the listener and the ticker function.
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(updateRotation);
    };
  }, [canHover]);

  return (
    <div ref={boxRef} className={cn("bg-red-950 p-4", className)}>
      {children}
    </div>
  );
}
export default RotatingDiv;
