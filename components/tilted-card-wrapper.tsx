"use client";
import { cn } from "@/lib/utils";
import { lerp } from "@/lib/utils";
import { useRef, useEffect } from "react";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";

// config
const MAX_TILT = 12; // degrees
const MAX_LIFT = 14; // px upward (towards cursor)
const SMOOTHING = 0.12; // lower = smoother (slower)

interface TiltedCardWarperProps {
  className?: string;
  children: React.ReactNode;
}

const TiltedCardWrapper = ({ children, className }: TiltedCardWarperProps) => {
  const soundEvents = useInteractiveSound();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Cached target values and current (for smoothing)
  const target = useRef({ rx: 0, ry: 0, ty: 0 });
  const current = useRef({ rx: 0, ry: 0, ty: 0 });

  // Last pointer position (updated by pointer events)
  const lastPointer = useRef({ x: 0, y: 0, inside: false });

  const rafId = useRef<number | null>(null);
  const rectCache = useRef({ left: 0, top: 0, width: 1, height: 1 });

  // update the cached bounding rect (call on enter & resize)
  const updateRect = () => {
    const el = wrapperRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rectCache.current = {
      left: r.left,
      top: r.top,
      width: Math.max(r.width, 1),
      height: Math.max(r.height, 1),
    };
  };

  // pointer move handler: store pointer coords, don't write styles here
  const handlePointerMove = (e: React.PointerEvent) => {
    // ensure we have rect
    if (rectCache.current.width === 1) updateRect();

    lastPointer.current.x = e.clientX;
    lastPointer.current.y = e.clientY;
  };

  // on enter - mark inside and refresh rect
  const handlePointerEnter = (e: React.PointerEvent) => {
    lastPointer.current.inside = true;
    updateRect();
    // kick the loop if needed
    if (rafId.current == null) startLoop();
  };

  // on leave - reset target and mark outside
  const handlePointerLeave = () => {
    lastPointer.current.inside = false;
    // reset target to neutral
    target.current.rx = 0;
    target.current.ry = 0;
    target.current.ty = 0;
  };

  // main animation loop: compute target based on lastPointer, then lerp current -> target and apply transform
  const animate = () => {
    const el = cardRef.current;
    if (!el) {
      rafId.current = null;
      return;
    }

    // compute target if inside
    if (lastPointer.current.inside) {
      const { x, y } = lastPointer.current;
      const { left, top, width, height } = rectCache.current;

      // normalized (-1 .. 1) with origin at center, flip Y to match rotateX convention
      const nx = ((x - left) / width - 0.5) * 2; // -1 left, +1 right
      const ny = ((y - top) / height - 0.5) * 2; // -1 top, +1 bottom

      // rotateY should follow cursor left/right, rotateX should react as if camera is above => invert ny
      target.current.ry = nx * MAX_TILT * -1; // invert if you want opposite direction
      target.current.rx = ny * MAX_TILT;
      // small lift: move up when pointer is near top (negative ny -> lift positive)
      target.current.ty = (1 - Math.abs(ny)) * (MAX_LIFT * 0.6); // subtle lift
    } else {
      // not inside -> target neutral (already set in leave, but safe)
      target.current.rx = 0;
      target.current.ry = 0;
      target.current.ty = 0;
    }

    // smoothing: lerp current -> target
    current.current.rx = lerp(current.current.rx, target.current.rx, SMOOTHING);
    current.current.ry = lerp(current.current.ry, target.current.ry, SMOOTHING);
    current.current.ty = lerp(current.current.ty, target.current.ty, SMOOTHING);

    // apply transform once per frame (GPU-accelerated)
    // include translateZ(0) or translate3d for GPU boost and preserve-3d for children
    el.style.transform = `perspective(1000px) translate3d(0, ${-current.current
      .ty}px, 0) rotateX(${current.current.rx}deg) rotateY(${
      current.current.ry
    }deg)`;

    // keep loop running if not at rest
    const atRest =
      Math.abs(current.current.rx - target.current.rx) < 0.01 &&
      Math.abs(current.current.ry - target.current.ry) < 0.01 &&
      Math.abs(current.current.ty - target.current.ty) < 0.1;

    if (!atRest || lastPointer.current.inside) {
      rafId.current = requestAnimationFrame(animate);
    } else {
      // stop loop
      rafId.current = null;
    }
  };

  const startLoop = () => {
    if (rafId.current == null) {
      rafId.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    // cancel on unmount
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // update rect on window resize
  useEffect(() => {
    const onResize = () => updateRect();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      ref={wrapperRef}
      {...soundEvents}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "will-change-transform transform-3d backface-hidden",
        className
      )}
      onMouseDown={startLoop} // optional: kick the loop on first interaction if needed
    >
      <div ref={cardRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default TiltedCardWrapper;
