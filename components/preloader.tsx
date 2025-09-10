"use client";
import Text from "./ui/text";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { lerp } from "@/lib/utils";
import AnimatedCounter from "./counter";
import LabelText from "./ui/label-text";
import Button from "./ui/button-or-link";
import { useRef, useEffect } from "react";
import { useAssetLoader } from "@/hooks/useAssetLoader";

interface PreloaderProps {
  children: React.ReactNode;
}

const Preloader = ({ children }: PreloaderProps) => {
  const { errors, progress, isLoaded, notifyShaderReady } = useAssetLoader();

  const imageRef = useRef<HTMLImageElement>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef<number | null>(null);

  // Mouse move handler to update targets
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Increased multiplier by 50% for more intensity (0.01 * 1.5 = 0.015)
      targetX.current = Math.max(
        -28,
        Math.min(28, (clientX - centerX) * 0.015)
      );
      targetY.current = Math.max(
        -28,
        Math.min(28, (clientY - centerY) * 0.015)
      );
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation loop for lerping and updating transform
  useEffect(() => {
    const animate = () => {
      // Increased lerp alpha by 50% for faster speed (0.1 * 1.5 = 0.15)
      currentX.current = lerp(currentX.current, targetX.current, 0.15);
      currentY.current = lerp(currentY.current, targetY.current, 0.15);

      if (imageRef.current) {
        imageRef.current.style.transform = `translate(${currentX.current}px, ${currentY.current}px) scale(1.1)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // if (!isLoaded)
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500"
      )}
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          ref={imageRef}
          fill
          priority
          className="object-cover"
          alt="pre loader image"
          src="/images/bg/new-bg-2.webp"
        />
      </div>
      <div className="absolute flex inset-0">
        <div className="flex md:gap-10 gap-8 flex-col items-center justify-center text-center lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto">
          <LabelText>
            <h4 className="font-alegreya uppercase">Welcome Stranger</h4>
          </LabelText>
          <Text as="h2" variant="title">
            Uncover a saga of gods, mortals, and endless strife…
          </Text>
          <Button
            disabled
            onClick={() => {
              return null;
            }}
          >
            {!isLoaded ? "Loading the experience..." : "Start exploring"}
          </Button>
        </div>
        <div className="absolute md:bottom-12 bottom-6 left-0 right-0 flex items-end justify-end px-12 max-md:px-6">
          <Text
            as="p"
            variant="xs"
            className="mx-auto text-center absolute left-1/2 -translate-x-1/2 opacity-70 mb-4"
          >
            * Turn volume on, for the best experience
          </Text>
          <AnimatedCounter progress={progress} />
        </div>
      </div>
    </div>
  );
  // return <>{children}</>;
};

export default Preloader;
