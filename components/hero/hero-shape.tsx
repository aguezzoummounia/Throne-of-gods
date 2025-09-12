import * as THREE from "three";
import { useRef, useEffect } from "react";
import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useAssetLoader } from "@/hooks/useAssetLoader";

// Add iScale to the material's props type for the animation
type AbstractRingMaterialProps =
  React.JSX.IntrinsicElements["rawShaderMaterial"] & {
    iTime?: number;
    iResolution?: THREE.Vector3;
    iScale?: number;
  };

declare module "@react-three/fiber" {
  interface ThreeElements {
    abstractRingMaterial: AbstractRingMaterialProps;
  }
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Add an 'iScale' uniform to control the size of the ring for the animation.
const fragmentShader = `
  precision highp float;
  uniform vec3 iResolution;
  uniform float iTime;
  uniform float iScale;

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

          // Multiply the radius by iScale to control the size via the animation.
          d = 0.1 * abs(length(p) - 1.5 * iScale) + 0.04 * abs(a.y);
          z += d;
          
          if (d > 0.0001) {
            vec4 color_phase = (a.y > 0.0)
                ? vec4(0.0, 1.5, 3.0, 0.0)
                : vec4(3.0, 1.5, 0.0, 0.0);
            
            o += (cos(d / 0.1 + color_phase) + 1.0) / d * z;
          }
      }

      vec3 color = tanh(o.rgb / 20000.0);
      float alpha = smoothstep(0.01, 0.25, length(color));
      gl_FragColor = vec4(color * alpha, alpha);
  }
`;

const AbstractRingMaterial = shaderMaterial(
  {
    iTime: 0,
    iResolution: new THREE.Vector3(),
    iScale: 0.0, // Initialize scale at 0 so it's invisible at first
  },
  vertexShader,
  fragmentShader
);

extend({ AbstractRingMaterial });

const ShaderPlane = () => {
  const materialRef = useRef<
    THREE.ShaderMaterial & {
      iTime: number;
      iResolution: THREE.Vector3;
      iScale: number;
    }
  >(null);
  const firstFrameRendered = useRef(false);
  const { viewport, size } = useThree();
  const { notifyItemLoaded } = useAssetLoader();
  const animationState = useRef({ startTime: -1, triggered: false });

  // Use useEffect to trigger the animation after a delay on mount.
  useEffect(() => {
    if (!firstFrameRendered.current) {
      // === INTEGRATION POINT ===
      console.log(
        "[HeroShape] First frame rendered. Notifying for: shader:hero"
      );
      notifyItemLoaded("shader:hero"); // Notify that the shader is "ready"
      firstFrameRendered.current = true;
    }
    const timer = setTimeout(() => {
      animationState.current.triggered = true;
    }, 600); // 0.6 second delay
    return () => clearTimeout(timer);
  }, []);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;

    const { clock } = state;
    material.iTime = clock.getElapsedTime();

    const dpr = state.viewport.dpr;
    material.iResolution.x = size.width * dpr;
    material.iResolution.y = size.height * dpr;
    material.iResolution.z = 1.0;

    // Handle the entrance animation logic
    if (animationState.current.triggered && material.iScale < 1.0) {
      // Record the start time on the first frame of the animation
      if (animationState.current.startTime === -1) {
        animationState.current.startTime = clock.getElapsedTime();
      }

      const animationDuration = 1.0; // Zoom in over 1 second
      const elapsedTime =
        clock.getElapsedTime() - animationState.current.startTime;

      if (elapsedTime < animationDuration) {
        let progress = elapsedTime / animationDuration;
        // Use an ease-out function for a smooth slow-down effect
        material.iScale = 1 - Math.pow(1 - progress, 5);
      } else {
        // Ensure it ends exactly at 1.0
        material.iScale = 1.0;
      }
    }
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <abstractRingMaterial ref={materialRef} />
    </mesh>
  );
};

const HeroShape = () => {
  console.log("3. HeroShape component IS rendering.");
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <Canvas gl={{ alpha: true }}>
        <ShaderPlane />
      </Canvas>
    </div>
  );
};

export default HeroShape;
