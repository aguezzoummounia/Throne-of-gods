import "@react-three/fiber";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { TextureLoader, Vector2 } from "three";
import { vertexShader, fragmentShader } from "../glsl/ripple-shader";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { cn } from "@/lib/utils";

const START_DELAY_MS = 400;

const RippleScene = forwardRef(
  (
    {
      src,
      planeArgs,
      animationDuration = 2.5,
      quality = "medium",
      onContextLoss,
    },
    ref
  ) => {
    const material = useRef(null);
    const texture = useLoader(TextureLoader, src);

    const { invalidate, gl, size, viewport } = useThree();
    const [playing, setPlaying] = useState(false);
    const [contextLost, setContextLost] = useState(false);

    // Force invalidation when size changes to ensure proper rendering
    useEffect(() => {
      invalidate();
    }, [size.width, size.height, invalidate]);

    // Expose methods to parent component
    useImperativeHandle(
      ref,
      () => ({
        restoreContext: () => {
          if (gl && gl.isContextLost()) {
            console.log("Attempting to restore WebGL context...");
            // Context restoration is handled automatically by WebGL
            setContextLost(false);
          }
        },
        replay: () => {
          if (material.current?.uniforms?.uTime) {
            material.current.uniforms.uTime.value = 0;
            setPlaying(true);
            invalidate();
          }
        },
      }),
      [gl, invalidate]
    );

    // Handle WebGL context loss
    useEffect(() => {
      if (!gl) return;

      const handleContextLoss = (event) => {
        console.warn("WebGL context lost in RippleScene");
        event.preventDefault();
        setContextLost(true);
        onContextLoss?.();
      };

      const handleContextRestore = () => {
        console.log("WebGL context restored in RippleScene");
        setContextLost(false);
      };

      const canvas = gl.domElement;
      canvas.addEventListener("webglcontextlost", handleContextLoss);
      canvas.addEventListener("webglcontextrestored", handleContextRestore);

      return () => {
        canvas.removeEventListener("webglcontextlost", handleContextLoss);
        canvas.removeEventListener(
          "webglcontextrestored",
          handleContextRestore
        );
      };
    }, [gl, onContextLoss]);

    // auto-start after mount & the given delay
    useEffect(() => {
      if (contextLost) return;

      const t = window.setTimeout(() => {
        // reset shader time and start animating
        if (material.current?.uniforms?.uTime) {
          material.current.uniforms.uTime.value = 0;
        }
        setPlaying(true);
        invalidate();
      }, START_DELAY_MS);
      return () => clearTimeout(t);
    }, [invalidate, contextLost]);

    // Animate the time uniform on every frame with quality-based optimizations
    useFrame((_, delta) => {
      if (!playing || !material.current?.uniforms?.uTime || contextLost) return;

      const uTime = material.current.uniforms.uTime;

      // Adjust delta based on quality setting for performance
      let adjustedDelta = delta;
      if (quality === "low") {
        adjustedDelta = delta * 0.8; // Slower animation for better performance
      } else if (quality === "high") {
        adjustedDelta = delta * 1.2; // Slightly faster for smoother animation
      }

      uTime.value += adjustedDelta;
      invalidate();

      if (animationDuration > 0 && uTime.value >= animationDuration) {
        setPlaying(false);
      }
    });

    const uniforms = useMemo(() => {
      // Calculate aspect ratios once the texture is loaded
      const imageAspect = texture.image
        ? texture.image.naturalWidth / texture.image.naturalHeight
        : 1;
      const planeAspect = planeArgs[0] / planeArgs[1];

      // Quality-based texture scaling
      const textureScale =
        quality === "low" ? 0.5 : quality === "high" ? 1.0 : 0.75;

      // Quality-based ripple intensity
      const rippleIntensity =
        quality === "low" ? 0.6 : quality === "high" ? 1.2 : 1.0;

      return {
        uTime: { value: 0.0 },
        uTexture: { value: texture },
        uImageAspect: { value: imageAspect },
        uPlaneAspect: { value: planeAspect },
        uMouse: { value: new Vector2(0.5, 0.5) }, // normalized UV (0..1)
        uTextureScale: { value: textureScale },
        uRippleIntensity: { value: rippleIntensity },
        uQuality: {
          value: quality === "low" ? 0.0 : quality === "high" ? 2.0 : 1.0,
        },
      };
    }, [texture, planeArgs, quality]);

    // cleanup material on unmount
    useEffect(() => {
      return () => {
        if (material.current) {
          try {
            material.current.dispose();
          } catch (e) {
            console.warn("Error disposing material:", e);
          }
        }
      };
    }, []);

    // pointer handler on the mesh: uses event.uv (plane has UVs)
    const onPointerDown = (e) => {
      e.stopPropagation();

      // Don't handle interactions if context is lost
      if (contextLost) return;

      const uv = e.uv; // r3f pointer event provides uv for geometry with UVs
      if (!uv || !material.current?.uniforms) return;

      // If your shader expects flipped Y, flip here: newY = 1.0 - uv.y
      const useFlippedY = false; // set to true if ripple appears vertically inverted
      const mouseY = useFlippedY ? 1 - uv.y : uv.y;

      material.current.uniforms.uMouse.value.set(uv.x, mouseY);
      // reset time and start playing
      material.current.uniforms.uTime.value = 0;
      setPlaying(true);
      invalidate();
    };

    // Don't render if context is lost
    if (contextLost) {
      return (
        <mesh>
          <planeGeometry args={planeArgs} />
          <meshBasicMaterial color="#cccccc" transparent opacity={0.3} />
        </mesh>
      );
    }

    return (
      <mesh onPointerDown={onPointerDown}>
        <planeGeometry args={planeArgs} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
        />
      </mesh>
    );
  }
);

export const RippleImage = React.forwardRef(
  (
    {
      src = "/images/static/footer-image.png",
      alt = "Glassy vertical-slit 'eye' and a small central flame",
      animationDuration = 2.5,
      quality = "medium",
      onContextLoss,
      className,
    },
    ref
  ) => {
    // Use a square plane (10x10) for a 1:1 aspect ratio.
    const planeArgs = useMemo(() => [10, 10], []);
    const containerRef = useRef(null);

    // Force canvas resize on mount and when container size changes
    useEffect(() => {
      if (!containerRef.current) return;

      const resizeObserver = new ResizeObserver((entries) => {
        // Force a small delay to ensure the canvas has time to mount
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 10);
      });

      resizeObserver.observe(containerRef.current);

      // Initial resize trigger
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full h-full", className)}
        aria-label={alt}
      >
        {/* 
        The camera is positioned to perfectly frame the 10x10 square plane.
        Calculation: distance = (plane_height / 2) / tan(fov / 2)
        New distance is ~10.72 for a 10-unit high plane.
      */}
        <Canvas
          camera={{ position: [0, 0, 10.72], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          {/* Use the src as a key to force re-creation if the image source changes */}
          <RippleScene
            ref={ref}
            src={src}
            planeArgs={planeArgs}
            animationDuration={animationDuration}
            quality={quality}
            onContextLoss={onContextLoss}
          />
        </Canvas>
      </div>
    );
  }
);

RippleImage.displayName = "RippleImage";
