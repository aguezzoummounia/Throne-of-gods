// import * as THREE from "three";
// import React, { useRef, useEffect } from "react";
// import { shaderMaterial } from "@react-three/drei";
// import { vertexShader, fragmentShader } from "@/glsl/hero-shape-shader";
// import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";

// const AbstractRingMaterial = shaderMaterial(
//   {
//     iTime: 0,
//     iResolution: new THREE.Vector3(),
//     iScale: 0.0,
//     iColorShift: new THREE.Vector3(),
//     iColorShiftSecondary: new THREE.Vector3(),
//     iTexture: null,
//     iUseTexture: false,
//   },
//   vertexShader,
//   fragmentShader
// );

// extend({ AbstractRingMaterial });

// const ShaderPlane = () => {
//   const materialRef = useRef(null);
//   const { size } = useThree();
//   const animationState = useRef({ startTime: -1, triggered: false });

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       animationState.current.triggered = true;
//     }, 600);
//     return () => clearTimeout(timer);
//   }, []);

//   useFrame((state) => {
//     const material = materialRef.current;
//     if (!material) return;

//     const { clock } = state;
//     const time = clock.getElapsedTime();
//     material.iTime = time;
//     material.iUseTexture = false;
//     material.uniforms.iTexture.value = null;

//     const dpr = state.viewport.dpr;
//     material.iResolution.x = size.width * dpr;
//     material.iResolution.y = size.height * dpr;
//     material.iResolution.z = 1.0;

//     // Primary color shift
//     const r_shift1 = Math.sin(time * 0.2) * 0.15;
//     const g_shift1 = Math.cos(time * 0.1) * 0.1;
//     const b_shift1 = Math.sin(time * 0.3) * 0.2;
//     material.iColorShift.set(r_shift1, g_shift1, b_shift1);

//     // Secondary color shift with different frequencies
//     const r_shift2 = Math.cos(time * 0.15) * 0.1;
//     const g_shift2 = Math.sin(time * 0.25) * 0.15;
//     const b_shift2 = Math.cos(time * 0.05) * 0.2;
//     material.iColorShiftSecondary.set(r_shift2, g_shift2, b_shift2);

//     if (animationState.current.triggered && material.iScale < 1.0) {
//       if (animationState.current.startTime === -1) {
//         animationState.current.startTime = clock.getElapsedTime();
//       }

//       const animationDuration = 1.0;
//       const elapsedTime =
//         clock.getElapsedTime() - animationState.current.startTime;

//       if (elapsedTime < animationDuration) {
//         let progress = elapsedTime / animationDuration;
//         material.iScale = 1 - Math.pow(1 - progress, 5);
//       } else {
//         material.iScale = 1.0;
//       }
//     }
//   });

//   return (
//     <mesh>
//       <planeGeometry args={[10, 10]} />
//       <abstractRingMaterial ref={materialRef} />
//     </mesh>
//   );
// };

// const HeroShape = () => {
//   return (
//     <div className="absolute top-0 left-0 w-full h-full">
//       <Canvas gl={{ alpha: true }}>
//         <ShaderPlane />
//       </Canvas>
//     </div>
//   );
// };

// export default HeroShape;
"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";
import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useMobile } from "@/hooks/use-mobile";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 iResolution;
  uniform float iTime;
  uniform float iScale;
  uniform vec3 iColorShift;
  uniform vec3 iColorShiftSecondary;
  uniform sampler2D iTexture;
  uniform bool iUseTexture;


  void main() {
      vec4 o = vec4(0.0);
      float t = iTime;
      float z = 0.0; 
      float d = 0.0;

      for(float i = 0.0; i < 80.0; i++) {
          vec3 p = z * normalize(vec3((gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y, -1.0));
          vec3 a = normalize(cos(vec3(1.0, 3.0, 5.0) + t - d * 8.0));

          p.z += 5.0;
          a = a * dot(a, p) - cross(a, p);

          for(float j = 1.0; j < 9.0; j++) {
              a += sin(a * j + t).yzx / j;
          }

          d = 0.1 * abs(length(p) - 2.25 * iScale) + 0.04 * abs(a.y);
          z += d;
          
          if (d > 0.0001) {
            vec4 color_phase;
            
            // "Earth & Sky" Palette
            color_phase = (a.y > 0.0)
                ? vec4(0.8, 1.2, 1.5, 0.0) // Sky Blue
                : vec4(0.8, 0.5, 0.2, 0.0); // Terracotta

            // Smoothly blend the two color shifts over time
            float blend_factor = smoothstep(-1.0, 1.0, sin(iTime * 0.5));
            vec3 final_color_shift = mix(iColorShift, iColorShiftSecondary, blend_factor);

            color_phase.rgb += final_color_shift;
            o += (cos(d / 0.1 + color_phase) + 1.0) / d * z;
          }
      }

      if (iUseTexture) {
          vec2 tex_uv = vUv * 3.0;
          tex_uv += vec2(sin(iTime * 0.2), cos(iTime * 0.15)) * 0.5;
          vec4 texColor = texture2D(iTexture, tex_uv);
          o.rgb = mix(o.rgb, o.rgb * texColor.rgb, texColor.a * 0.4);
      }

      vec3 color = tanh(o.rgb / 20000.0);
      float alpha = smoothstep(0.01, 0.25, length(color));
      gl_FragColor = vec4(color * alpha, alpha);
  }
`;

const mobileFragmentShader = `
  precision mediump float;
  varying vec2 vUv;
  uniform vec3 iResolution;
  uniform float iTime;
  uniform float iScale;
  uniform vec3 iColorShift;
  uniform vec3 iColorShiftSecondary;
  uniform sampler2D iTexture;
  uniform bool iUseTexture;

  void main() {
      vec4 o = vec4(0.0);
      float t = iTime;
      float z = 0.0; 
      float d = 0.0;

      // Scale the viewport coordinates to simulate a wider field of view (zoom out).
      // A scale of 1.25 makes the object appear to take up 80% of its original size (1.0 / 0.8 = 1.25).
      vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
      uv *= 1.25;

      for(float i = 0.0; i < 50.0; i++) {
          // Use the scaled uv coordinates to define the ray direction
          vec3 p = z * normalize(vec3(uv, -1.0));
          vec3 a = normalize(cos(vec3(1.0, 3.0, 5.0) + t - d * 8.0));

          p.z += 5.0;
          a = a * dot(a, p) - cross(a, p);

          for(float j = 1.0; j < 5.0; j++) {
              a += sin(a * j + t).yzx / j;
          }

          d = 0.1 * abs(length(p) - 2.25 * iScale) + 0.04 * abs(a.y);
          z += d;
          
          if (d > 0.0001) {
            vec4 color_phase;
            
            color_phase = (a.y > 0.0)
                ? vec4(0.8, 1.2, 1.5, 0.0)
                : vec4(0.8, 0.5, 0.2, 0.0);

            float blend_factor = smoothstep(-1.0, 1.0, sin(iTime * 0.5));
            vec3 final_color_shift = mix(iColorShift, iColorShiftSecondary, blend_factor);

            color_phase.rgb += final_color_shift;
            o += (cos(d / 0.1 + color_phase) + 1.0) / d * z;
          }
      }

      if (iUseTexture) {
          vec2 tex_uv = vUv * 3.0;
          tex_uv += vec2(sin(iTime * 0.2), cos(iTime * 0.15)) * 0.5;
          vec4 texColor = texture2D(iTexture, tex_uv);
          o.rgb = mix(o.rgb, o.rgb * texColor.rgb, texColor.a * 0.4);
      }

      vec3 color = tanh(o.rgb / 18000.0);
      float alpha = smoothstep(0.01, 0.25, length(color));
      gl_FragColor = vec4(color * alpha, alpha);
  }
`;

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

const MobileAbstractRingMaterial = shaderMaterial(
  {
    iTime: 0,
    iResolution: new THREE.Vector3(),
    iScale: 1.0,
    iColorShift: new THREE.Vector3(),
    iColorShiftSecondary: new THREE.Vector3(),
    iTexture: null,
    iUseTexture: false,
  },
  vertexShader,
  mobileFragmentShader
);

extend({ AbstractRingMaterial, MobileAbstractRingMaterial });

const ShaderPlane = () => {
  const materialRef = useRef(null);
  const { size } = useThree();
  const animationState = useRef({ startTime: -1, triggered: false });
  const speed = 1.0;

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
    const time = clock.getElapsedTime() * speed;
    material.iTime = time;
    material.iUseTexture = false;
    material.uniforms.iTexture.value = null;

    const dpr = state.viewport.dpr;
    material.iResolution.x = size.width * dpr;
    material.iResolution.y = size.height * dpr;
    material.iResolution.z = 1.0;

    const r_shift1 = Math.sin(time * 0.2) * 0.15;
    const g_shift1 = Math.cos(time * 0.1) * 0.1;
    const b_shift1 = Math.sin(time * 0.3) * 0.2;
    material.iColorShift.set(r_shift1, g_shift1, b_shift1);

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

const MobileShaderPlane = () => {
  const materialRef = useRef(null);
  const { size } = useThree();
  const speed = 1.0;

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;

    const { clock } = state;
    const time = clock.getElapsedTime() * speed;
    material.iTime = time;

    const dpr = state.viewport.dpr;
    material.iResolution.x = size.width * dpr;
    material.iResolution.y = size.height * dpr;
    material.iResolution.z = 1.0;

    const r_shift1 = Math.sin(time * 0.2) * 0.15;
    const g_shift1 = Math.cos(time * 0.1) * 0.1;
    const b_shift1 = Math.sin(time * 0.3) * 0.2;
    material.iColorShift.set(r_shift1, g_shift1, b_shift1);

    const r_shift2 = Math.cos(time * 0.15) * 0.1;
    const g_shift2 = Math.sin(time * 0.25) * 0.15;
    const b_shift2 = Math.cos(time * 0.05) * 0.2;
    material.iColorShiftSecondary.set(r_shift2, g_shift2, b_shift2);
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <mobileAbstractRingMaterial ref={materialRef} />
    </mesh>
  );
};

const ShaderCanvas = ({ quality }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <Canvas
        gl={{
          alpha: true,
          powerPreference: quality === "medium" ? "low-power" : "default",
        }}
      >
        {quality === "medium" ? <MobileShaderPlane /> : <ShaderPlane />}
      </Canvas>
    </div>
  );
};

export default ShaderCanvas;
