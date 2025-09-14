import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { shaderMaterial } from "@react-three/drei";
import { vertexShader, fragmentShader } from "@/glsl/hero-shape-shader";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";

const AbstractRingMaterial = shaderMaterial(
  {
    iTime: 0,
    iResolution: new THREE.Vector3(),
    iScale: 0.0,
    iColorShift: new THREE.Vector3(),
    iColorShiftSecondary: new THREE.Vector3(),
    iTexture: null,
    iUseTexture: false,
  },
  vertexShader,
  fragmentShader
);

extend({ AbstractRingMaterial });

const ShaderPlane = () => {
  const materialRef = useRef(null);
  const { size } = useThree();
  const animationState = useRef({ startTime: -1, triggered: false });

  useEffect(() => {
    const timer = setTimeout(() => {
      animationState.current.triggered = true;
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;

    const { clock } = state;
    const time = clock.getElapsedTime();
    material.iTime = time;
    material.iUseTexture = false;
    material.uniforms.iTexture.value = null;

    const dpr = state.viewport.dpr;
    material.iResolution.x = size.width * dpr;
    material.iResolution.y = size.height * dpr;
    material.iResolution.z = 1.0;

    // Primary color shift
    const r_shift1 = Math.sin(time * 0.2) * 0.15;
    const g_shift1 = Math.cos(time * 0.1) * 0.1;
    const b_shift1 = Math.sin(time * 0.3) * 0.2;
    material.iColorShift.set(r_shift1, g_shift1, b_shift1);

    // Secondary color shift with different frequencies
    const r_shift2 = Math.cos(time * 0.15) * 0.1;
    const g_shift2 = Math.sin(time * 0.25) * 0.15;
    const b_shift2 = Math.cos(time * 0.05) * 0.2;
    material.iColorShiftSecondary.set(r_shift2, g_shift2, b_shift2);

    if (animationState.current.triggered && material.iScale < 1.0) {
      if (animationState.current.startTime === -1) {
        animationState.current.startTime = clock.getElapsedTime();
      }

      const animationDuration = 1.0;
      const elapsedTime =
        clock.getElapsedTime() - animationState.current.startTime;

      if (elapsedTime < animationDuration) {
        let progress = elapsedTime / animationDuration;
        material.iScale = 1 - Math.pow(1 - progress, 5);
      } else {
        material.iScale = 1.0;
      }
    }
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <abstractRingMaterial ref={materialRef} />
    </mesh>
  );
};

const HeroShape = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <Canvas gl={{ alpha: true }}>
        <ShaderPlane />
      </Canvas>
    </div>
  );
};

export default HeroShape;
