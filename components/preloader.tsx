import Text from "./ui/text";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { lerp } from "@/lib/utils";
import AnimatedCounter from "./counter";
import LabelText from "./ui/label-text";
import Button from "./ui/button-or-link";
import { useRef, useEffect } from "react";

interface PreloaderProps {
  progress: number;
  isHiding: boolean;
}
const targetValue = 100;
const duration = 3000;

const Preloader = ({ isHiding, progress }: PreloaderProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef<number>();

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
      if (isHiding) {
        // Pause animation when hiding to save perf
        return;
      }

      // Increased lerp alpha by 50% for faster speed (0.1 * 1.5 = 0.15)
      currentX.current = lerp(currentX.current, targetX.current, 0.15);
      currentY.current = lerp(currentY.current, targetY.current, 0.15);

      if (imageRef.current) {
        imageRef.current.style.transform = `translate(${currentX.current}px, ${currentY.current}px) scale(1.1)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    if (!isHiding) {
      rafId.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isHiding]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 transition-opacity duration-500",
        isHiding ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          ref={imageRef}
          fill
          priority
          className="object-cover"
          alt="pre loader image"
          src="/images/bg/bg-2.webp"
        />
      </div>
      <div className="absolute flex inset-0">
        <div className="flex md:gap-10 gap-8 flex-col items-center justify-center text-center lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto">
          <LabelText>Welcome Stranger</LabelText>
          <Text as="h2" variant="title">
            Uncover a saga of gods, mortals, and endless strife…
          </Text>
          <Button
            disabled
            onClick={() => {
              return null;
            }}
          >
            {isHiding ? "Loading..." : "Start exploring"}
          </Button>
        </div>
        <div className="absolute md:bottom-12 bottom-6 left-0 right-0 flex items-center justify-end px-12 max-md:px-5">
          <Text
            as="p"
            variant="xs"
            className="mx-auto text-center absolute left-1/2 -translate-x-1/2 opacity-70"
          >
            Turn volume on, for the best experience
          </Text>
          <AnimatedCounter progress={20} />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
