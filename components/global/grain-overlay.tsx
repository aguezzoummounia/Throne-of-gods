"use client";
import { useRef, useEffect } from "react";

const GrainOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Function to create a small, tilable canvas with noise
  const createNoisePattern = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const patternSize = 128;
    canvas.width = patternSize;
    canvas.height = patternSize;

    const imageData = ctx.createImageData(patternSize, patternSize);
    const data = imageData.data;

    // Generate grayscale noise
    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value; // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
      data[i + 3] = 40; // Alpha (controls intensity of the noise pixels)
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // Create the noise pattern once
    const noisePatternCanvas = createNoisePattern();
    if (!noisePatternCanvas) return;

    // Create a pattern from the noise canvas
    const pattern = ctx.createPattern(noisePatternCanvas, "repeat");

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      if (!pattern) return;

      // Use random offsets to make the static pattern appear animated
      const randomX = Math.random() * canvas.width;
      const randomY = Math.random() * canvas.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(randomX, randomY);
      ctx.fillStyle = pattern;
      ctx.fillRect(-randomX, -randomY, canvas.width, canvas.height);
      ctx.restore();

      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99] opacity-50"
    />
  );
};

export default GrainOverlay;
