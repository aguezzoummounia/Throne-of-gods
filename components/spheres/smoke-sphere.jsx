"use client";
import * as THREE from "three";
import React, { useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { vertexShader, fragmentShader } from "@/glsl/smoke-shaders";

const SmokyMaterial = shaderMaterial(
  {
    u_time: 0,
    u_intensity: 2.0,
  },
  vertexShader,
  fragmentShader
);

extend({ SmokyMaterial });

export const SmokySphere = (props) => {
  const materialRef = useRef(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.u_time = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh {...props}>
      <sphereGeometry args={[1.6, 128, 128]} />
      <smokyMaterial ref={materialRef} key={SmokyMaterial.key} />
    </mesh>
  );
};
