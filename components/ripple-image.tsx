import "@react-three/fiber";
import { TextureLoader, ShaderMaterial, Vector2 } from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { vertexShader, fragmentShader } from "@/glsl/ripple-shader";

const START_DELAY_MS = 400;

interface RippleSceneProps {
  src: string;
  planeArgs: [number, number];
  animationDuration?: number; // seconds
}

const RippleScene: React.FC<RippleSceneProps> = ({
  src,
  planeArgs,
  animationDuration = 2.5,
}) => {
  const material = useRef<ShaderMaterial>(null);
  const texture = useLoader(TextureLoader, src);

  const { invalidate } = useThree();
  const [playing, setPlaying] = useState(false);

  // auto-start after mount & the given delay
  useEffect(() => {
    const t = window.setTimeout(() => {
      // reset shader time and start animating
      if (material.current?.uniforms?.uTime) {
        material.current.uniforms.uTime.value = 0;
      }
      setPlaying(true);
      invalidate();
    }, START_DELAY_MS);
    return () => clearTimeout(t);
  }, [invalidate]);

  // Animate the time uniform on every frame
  useFrame((_, delta) => {
    if (!playing || !material.current?.uniforms?.uTime) return;

    const uTime = material.current.uniforms.uTime;
    uTime.value += delta;
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

    return {
      uTime: { value: 0.0 },
      uTexture: { value: texture },
      uImageAspect: { value: imageAspect },
      uPlaneAspect: { value: planeAspect },
      uMouse: { value: new Vector2(0.5, 0.5) }, // normalized UV (0..1)
    };
  }, [texture, planeArgs]);

  // cleanup material on unmount
  useEffect(() => {
    return () => {
      if (material.current) {
        try {
          material.current.dispose();
        } catch (e) {}
      }
    };
  }, []);

  // pointer handler on the mesh: uses event.uv (plane has UVs)
  const onPointerDown = (e: any) => {
    e.stopPropagation();
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
};

export const RippleImage: React.FC<{
  src: string;
  alt: string;
  animationDuration?: number;
}> = ({ src, alt, animationDuration = 2.5 }) => {
  // Use a square plane (10x10) for a 1:1 aspect ratio.
  const planeArgs: [number, number] = useMemo(() => [10, 10], []);

  return (
    <div
      // onClick={replayAnimation}
      className="relative w-full h-full bg-transparent"
      aria-label={alt}
    >
      {/* 
        The camera is positioned to perfectly frame the 10x10 square plane.
        Calculation: distance = (plane_height / 2) / tan(fov / 2)
        New distance is ~10.72 for a 10-unit high plane.
      */}
      <Canvas camera={{ position: [0, 0, 10.72], fov: 50 }}>
        {/* Use the src as a key to force re-creation if the image source changes */}
        <RippleScene
          src={src}
          planeArgs={planeArgs}
          animationDuration={animationDuration}
        />
      </Canvas>
    </div>
  );
};
