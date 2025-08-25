"use client";
import * as THREE from "three";
import React, { useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { vertexShader_1, fragmentShader_1 } from "@/glsl/water-shaders";

const SunMaterial = shaderMaterial(
  {
    u_time: 0,
    u_intensity: 1.5,
    u_color_core: new THREE.Color("#FFD700"),
    u_color_edge: new THREE.Color("#FFFFE0"),
  },
  vertexShader_1,
  fragmentShader_1
);

extend({ SunMaterial });

export const SunSphere = (props) => {
  const materialRef = useRef(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.u_time = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh {...props}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <sunMaterial ref={materialRef} key={SunMaterial.key} />
    </mesh>
  );
};
