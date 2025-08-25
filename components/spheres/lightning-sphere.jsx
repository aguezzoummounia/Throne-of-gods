"use client";
import * as THREE from "three";
import React, { useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { vertexShader, fragmentShader } from "@/glsl/lightning-ball-shaders";

// Define the custom material using drie's shaderMaterial helper
const EnergyMaterial = shaderMaterial(
  {
    u_time: 0,
    u_intensity: 1.8,
    u_color_core: new THREE.Color("#ffffff"),
    u_color_edge: new THREE.Color("#87CEEB"),
  },
  vertexShader,
  fragmentShader
);

extend({ EnergyMaterial });

export const EnergySphere = (props) => {
  const materialRef = useRef(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.u_time = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh {...props}>
      <sphereGeometry args={[1.7, 128, 128]} />
      <energyMaterial ref={materialRef} key={EnergyMaterial.key} />
    </mesh>
  );
};
