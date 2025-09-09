"use client";
import React, { useRef } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// FIX: An interface cannot extend a complex type like JSX.IntrinsicElements['shaderMaterial'].
// Switched to a type alias with an intersection (&) to correctly combine the base shaderMaterial props
// (which includes 'ref', solving the second error) with custom uniforms.
// @google/genai-fix: Property 'shaderMaterial' does not exist on type 'IntrinsicElements'. Replaced 'shaderMaterial' with 'rawShaderMaterial' as it has a similar API and is available as an intrinsic element in @react-three/fiber.
type AbstractRingMaterialProps =
  React.JSX.IntrinsicElements["rawShaderMaterial"] & {
    iTime?: number;
    iResolution?: THREE.Vector3;
  };

declare module "@react-three/fiber" {
  interface ThreeElements {
    abstractRingMaterial: AbstractRingMaterialProps;
  }
}

// Vertex shader: a simple pass-through to position the vertices of our plane.
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader: A "Phosphor 2" style shader with a different rotation, sharper falloff, and dual-color scheme.
const fragmentShader = `
  precision highp float;
  uniform vec3 iResolution;
  uniform float iTime;

  void main() {
      vec4 o = vec4(0.0);
      float t = iTime;
      float z = 0.0; 
      float d = 0.0;

      for(float i = 0.0; i < 80.0; i++) {
          vec3 p = z * normalize(vec3((gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y, -1.0));

          // 1. A different rotation pattern
          vec3 a = normalize(cos(vec3(1.0, 3.0, 5.0) + t - d * 8.0));

          p.z += 5.0;
          a = a * dot(a, p) - cross(a, p);

          for(float j = 1.0; j < 9.0; j++) {
              a += sin(a * j + t).yzx / j;
          }

          // 2. Sharper sphere falloff by increasing the distance multiplier
          // The radius is changed from 3.0 to 1.5 to make the shape 50% smaller.
          d = 0.1 * abs(length(p) - 1.5) + 0.04 * abs(a.y);
          z += d;
          
          if (d > 0.0001) {
            // 3. Coloring based on the side of the plane (a.y)
            vec4 color_phase = (a.y > 0.0)
                ? vec4(0.0, 1.5, 3.0, 0.0) // Cool, blue/cyan tones
                : vec4(3.0, 1.5, 0.0, 0.0); // Warm, orange/yellow tones
            
            o += (cos(d / 0.1 + color_phase) + 1.0) / d * z;
          }
      }

      // 4. Tonemap and set final alpha for full transparency
      vec3 color = tanh(o.rgb / 20000.0);

      // Use smoothstep to create a sharper transparency falloff.
      // This creates a "gate" where very dark colors (the background haze)
      // become fully transparent (alpha = 0), while colors above the
      // threshold quickly become opaque.
      float alpha = smoothstep(0.01, 0.25, length(color));

      // Use premultiplied alpha to prevent haze/glow on transparent edges.
      // This is the standard and correct way to handle blending.
      gl_FragColor = vec4(color * alpha, alpha);
  }
`;

// Create a reusable shader material with drei's helper
const AbstractRingMaterial = shaderMaterial(
  {
    iTime: 0,
    iResolution: new THREE.Vector3(),
  },
  vertexShader,
  fragmentShader
);

extend({ AbstractRingMaterial });

// This component defines the scene: a plane that fills the viewport and uses our custom shader.
const ShaderPlane = () => {
  // Simplify the ref type to be more explicit, avoiding complex InstanceType inference that can break transpilers.
  const materialRef = useRef<
    THREE.ShaderMaterial & { iTime: number; iResolution: THREE.Vector3 }
  >(null);
  const { viewport, size } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.iTime = state.clock.getElapsedTime();

      const dpr = state.viewport.dpr;
      materialRef.current.iResolution.x = size.width * dpr;
      materialRef.current.iResolution.y = size.height * dpr;
      materialRef.current.iResolution.z = 1.0;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <abstractRingMaterial ref={materialRef} />
    </mesh>
  );
};

// The main export component that wraps the R3F Canvas
const ShaderCanvas = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <Canvas gl={{ alpha: true }}>
        <ShaderPlane />
      </Canvas>
    </div>
  );
};

export default ShaderCanvas;
