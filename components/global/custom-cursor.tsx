"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

const CustomCursor: React.FC = () => {
  const mouse = useRef<Point>({ x: 0, y: 0 });
  const delayedMouse = useRef<Point>({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const circle = useRef<HTMLImageElement | null>(null);

  const lerp = (x: number, y: number, a: number): number => x * (1 - a) + y * a;

  const manageMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;

    mouse.current = {
      x: clientX,
      y: clientY,
    };
  };

  const animate = () => {
    const { x, y } = delayedMouse.current;

    delayedMouse.current = {
      x: lerp(x, mouse.current.x, 0.075),
      y: lerp(y, mouse.current.y, 0.075),
    };

    moveCircle(delayedMouse.current.x, delayedMouse.current.y);

    rafId.current = window.requestAnimationFrame(animate);
  };

  const moveCircle = (x: number, y: number) => {
    if (circle.current) {
      gsap.set(circle.current, { x, y, xPercent: -50, yPercent: -50 });
    }
  };

  useEffect(() => {
    animate();
    window.addEventListener("mousemove", manageMouseMove);
    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <img
      ref={circle}
      src="/images/spheres/blue-sphere.png"
      className="w-16 h-16 object-scale-down top-0 left-0 fixed  mix-blend-difference pointer-events-none"
    />
  );
};

export default CustomCursor;
