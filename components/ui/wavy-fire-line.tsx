"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ShaderMaterial, Vector2, PlaneGeometry } from "three";
// first try
// const vertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;
// const fragmentShader = `
//   varying vec2 vUv;
//   uniform float u_time;
//   uniform vec2 u_resolution;

//   // --- Utility & Noise Functions ---
//   vec2 random2(vec2 st) {
//     st = vec2(dot(st, vec2(127.1, 311.7)),
//               dot(st, vec2(269.5, 183.3)));
//     return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
//   }

//   float noise(vec2 st) {
//     vec2 i = floor(st);
//     vec2 f = fract(st);
//     vec2 u = f * f * (3.0 - 2.0 * f);
//     return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
//                    dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
//                mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
//                    dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
//   }

//   #define OCTAVES 5
//   float fbm(vec2 st) {
//     float value = 0.0;
//     float amplitude = 0.5;
//     for (int i = 0; i < OCTAVES; i++) {
//       value += amplitude * noise(st);
//       st *= 2.0;
//       amplitude *= 0.5;
//     }
//     return value;
//   }

//   // --- Main Shader Logic ---
//   void main() {
//     vec2 p = (vUv * 2.0 - 1.0);
//     p.x *= u_resolution.x / u_resolution.y;

//     vec3 finalColor = vec3(0.0);

//     // --- 1. Global Swaying Motion ---
//     float globalSway = sin(u_time * 0.2) * 0.05;

//     // --- 2. The Core Rift Shape ---
//     // Multiple FBM layers for a complex, undulating shape
//     float slow_flow = u_time * 0.05;
//     float fast_flow = u_time * 0.4;
//     float y_offset =
//       fbm(vec2(p.x * 0.5, slow_flow)) * 0.2 +
//       fbm(vec2(p.x * 1.5, fast_flow)) * 0.08;

//     float rift_y = globalSway + y_offset;
//     float dist_to_rift = abs(p.y - rift_y);

//     // --- 3. Core Plasma & Glow ---
//     float rift_body = 1.0 - smoothstep(0.0, 0.04, dist_to_rift);
//     float glow = 1.0 - smoothstep(0.0, 0.3, dist_to_rift);

//     if (rift_body > 0.0) {
//       // --- 4. Volatile Texture & Color ---
//       float turbulence = fbm(vec2(p.x * 2.0 + u_time, p.y * 5.0 + u_time * 0.5));

//       // Color ramp from charcoal -> orange -> gold -> white-hot
//       vec3 charcoal = vec3(0.1, 0.05, 0.0);
//       vec3 molten_gold = vec3(1.0, 0.6, 0.1);
//       vec3 white_hot = vec3(1.0, 1.0, 0.8);

//       vec3 color = mix(charcoal, molten_gold, smoothstep(-0.2, 0.2, turbulence));
//       color = mix(color, white_hot, smoothstep(0.3, 0.5, turbulence));

//       // Apply intensity based on distance to core center
//       float core_intensity = pow(1.0 - smoothstep(0.0, 0.04, dist_to_rift), 2.0);
//       finalColor += color * core_intensity;

//       // --- 5. Crackling Lightning Effect ---
//       float lightning_noise = fbm(vec2(p.x * 20.0 + u_time * 5.0, p.y * 30.0));
//       float lightning = pow(smoothstep(0.6, 0.7, lightning_noise), 10.0);
//       finalColor += vec3(1.0, 1.0, 1.0) * lightning * core_intensity;
//     }

//     // Add glow effect outside the main body
//     finalColor += vec3(0.8, 0.4, 0.1) * pow(glow, 3.0) * 0.5;

//     // --- 6. Embers / Particles ---
//     vec2 grid = floor(vUv * vec2(40.0, 20.0));
//     vec2 grid_uv = fract(vUv * vec2(40.0, 20.0)) - 0.5;

//     vec2 rand_vals = random2(grid + floor(u_time * 0.2));
//     float particle_time = fract(u_time * 0.2 + rand_vals.x);

//     // Only show particles near the rift
//     if (abs(p.y - rift_y) < 0.3) {
//       float particle_life = smoothstep(0.0, 0.1, particle_time) * smoothstep(1.0, 0.4, particle_time);

//       if (particle_life > 0.0) {
//         // Anti-gravity arc motion
//         vec2 particle_pos = vec2(rand_vals.y, 0.0);
//         particle_pos.y += particle_time * 0.5; // Upward drift
//         particle_pos.y -= pow(particle_time, 2.0) * 0.5; // Gravity arc

//         float dist_to_particle = length(grid_uv - particle_pos);
//         float particle = smoothstep(0.1, 0.0, dist_to_particle) * particle_life;

//         finalColor += vec3(1.0, 0.8, 0.2) * particle;
//       }
//     }

//     // Alpha is based on combined brightness
//     float alpha = clamp(length(finalColor), 0.0, 1.0);
//     gl_FragColor = vec4(finalColor, alpha);
//   }
// `;

// second try
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_resolution;

  // --- Utility & Noise Functions ---
  vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }

  #define OCTAVES 5
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < OCTAVES; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // --- Main Shader Logic ---
  void main() {
    vec2 p = (vUv * 2.0 - 1.0);
    p.x *= u_resolution.x / u_resolution.y;

    vec3 finalColor = vec3(0.0);

    // --- 1. Global Swaying Motion ---
    float globalSway = sin(u_time * 0.2) * 0.05;

    // --- 2. The Core Liquid Shape ---
    // Slower, more viscous motion for a liquid feel
    float slow_flow = u_time * 0.1;
    float fast_flow = u_time * 0.2;
    float y_offset = 
      fbm(vec2(p.x * 0.4, slow_flow)) * 0.2 + 
      fbm(vec2(p.x * 1.2, fast_flow)) * 0.08;
    
    float liquid_y = globalSway + y_offset;
    float dist_to_liquid = abs(p.y - liquid_y);
    
    // --- 3. Core Liquid Gold & Glow ---
    float liquid_body = 1.0 - smoothstep(0.0, 0.045, dist_to_liquid); // A bit thicker
    float glow = 1.0 - smoothstep(0.0, 0.3, dist_to_liquid);

    if (liquid_body > 0.0) {
      // --- 4. Liquid Texture & Color ---
      float turbulence = fbm(vec2(p.x * 2.0 + u_time * 0.2, p.y * 5.0 + u_time * 0.3));
      
      // Color ramp from dark gold -> brilliant gold -> yellow-white highlight
      vec3 dark_gold = vec3(0.8, 0.5, 0.05);
      vec3 brilliant_gold = vec3(1.0, 0.8, 0.3);
      vec3 highlight_gold = vec3(1.0, 1.0, 0.85);

      vec3 color = mix(dark_gold, brilliant_gold, smoothstep(-0.2, 0.2, turbulence));
      color = mix(color, highlight_gold, smoothstep(0.3, 0.5, turbulence));
      
      // Apply intensity based on distance to core center
      float core_intensity = pow(1.0 - smoothstep(0.0, 0.045, dist_to_liquid), 2.0);
      finalColor += color * core_intensity;
      
      // --- 5. Shimmering Glint Effect ---
      float glint_noise = noise(vec2(p.x * 40.0 + u_time * 4.0, p.y * 10.0));
      float glint = pow(smoothstep(0.85, 0.9, glint_noise), 5.0); // Sharp, fast glints
      finalColor += vec3(1.0, 1.0, 0.9) * glint * core_intensity * 1.5; // Bright white-gold glint
    }
    
    // Add glow effect outside the main body
    finalColor += vec3(1.0, 0.7, 0.2) * pow(glow, 4.0) * 0.4; // Brighter golden glow

    // Alpha is based on combined brightness
    float alpha = clamp(length(finalColor), 0.0, 1.0);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const ShaderPlane: React.FC = () => {
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: {
        value: new Vector2(window.innerWidth, window.innerHeight),
      },
    }),
    []
  );

  useEffect(() => {
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.u_resolution.value.x = window.innerWidth;
        materialRef.current.uniforms.u_resolution.value.y = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial setup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
};

const WavyFireLine: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      gl={{ antialias: true, alpha: true }}
      // style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
    >
      <ShaderPlane />
    </Canvas>
  );
};

export default WavyFireLine;
