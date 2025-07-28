"use client";
import { gsap } from "gsap";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

// Import shaders
const vertexShader = `varying vec2 vUv;
varying float vWave;

// Uniforms are variables passed from JavaScript
uniform float uTime;
uniform float uScrollVelocity;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveSpeed;

void main() {
    vUv = uv;
    vec3 pos = position;

    // A simple sine wave distortion based on Y position and time
    float wave = sin(pos.y * uWaveFrequency + uTime * uWaveSpeed) * uWaveAmplitude;

    // Apply distortion more intensely based on scroll velocity
    float velocityEffect = abs(uScrollVelocity) * 0.1;
    pos.z += wave * velocityEffect;

    // Another layer of subtle twisting based on scroll
    float twist = cos(pos.y * 2.0 + uTime) * uScrollVelocity * 0.05;
    pos.x += twist;

    // Pass the wave intensity to the fragment shader for lighting effects
    vWave = wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;
const fragmentShader = `
varying vec2 vUv;
varying float vWave;

uniform sampler2D tMap;
uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;

// Function to create a rounded rectangle shape
float roundedRectangleSDF(vec2 uv, vec2 size, float radius) {
    vec2 d = abs(uv) - size + radius;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}

void main() {
    // --- Aspect Ratio Correction for the Image Texture ---
    vec2 ratio = vec2(
        min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
        min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
    );
    vec2 uv = vUv * ratio + (1.0 - ratio) * 0.5;

    vec3 color = texture2D(tMap, uv).rgb;

    // --- Rounded Corners and Edge Fade ---
    // Use an SDF (Signed Distance Function) for crisp rounded corners
    float sdf = roundedRectangleSDF(vUv - 0.5, vec2(0.5), 0.1);
    float alpha = 1.0 - smoothstep(0.0, 0.01, sdf);

    // --- Subtle Vignette/Lighting based on wave ---
    float lighting = 0.5 + 0.5 * cos(vWave * 3.14159);
    color *= mix(0.8, 1.2, lighting); // Apply subtle light/dark variation

    gl_FragColor = vec4(color, alpha);
}
`;

// This component represents a single image plane in the 3D scene
const ImagePlane = ({
  url,
  index,
  totalPlanes,
  scroll,
  viewport,
  planeSize,
}) => {
  const texture = useTexture(url);
  const meshRef = useRef();
  const shaderRef = useRef();

  // Calculate aspect ratios for texture mapping
  const imageSizes = useMemo(
    () => new THREE.Vector2(texture.image.width, texture.image.height),
    [texture]
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Infinite scroll logic: wrap planes around
    const planeWidthWithGap = planeSize.width + 1.5;
    const totalWidth = planeWidthWithGap * totalPlanes;

    // The current raw position based on scroll
    let x = index * planeWidthWithGap + scroll.current;

    // The modulo operation creates the infinite loop
    meshRef.current.position.x =
      ((x + totalWidth / 2) % totalWidth) - totalWidth / 2;

    // Update shader uniforms for animations
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value += delta;
      shaderRef.current.uniforms.uScrollVelocity.value = scroll.velocity;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeSize.width, planeSize.height, 32, 32]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        uniforms={{
          tMap: { value: texture },
          uTime: { value: 0 },
          uScrollVelocity: { value: 0 },
          uWaveAmplitude: { value: 0.15 },
          uWaveFrequency: { value: 5.0 },
          uWaveSpeed: { value: 1.5 },
          uImageSizes: { value: imageSizes },
          uPlaneSizes: {
            value: new THREE.Vector2(planeSize.width, planeSize.height),
          },
        }}
      />
    </mesh>
  );
};

// This component sets up the 3D scene and handles interactions
const Scene = ({ projects, scroll }) => {
  const { viewport, size } = useThree();
  const groupRef = useRef();

  // Calculate plane dimensions based on viewport size
  const planeSize = useMemo(() => {
    const isMobile = size.width < 768;
    const planeWidth = viewport.width * (isMobile ? 0.8 : 0.4);
    const planeHeight = planeWidth * 1.4;
    return { width: planeWidth, height: planeHeight };
  }, [viewport.width, size.width]);

  // Mouse parallax effect
  useFrame(({ mouse }) => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        x: -mouse.y * 0.1,
        y: mouse.x * 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  });

  return (
    <group ref={groupRef}>
      {projects.map((project, index) => (
        <ImagePlane
          key={project.id}
          index={index}
          totalPlanes={projects.length}
          url={project.imageUrl}
          scroll={scroll}
          viewport={viewport}
          planeSize={planeSize}
        />
      ))}
    </group>
  );
};

// The main slider component that orchestrates everything
export const WebGLSlider = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Using refs for scroll values to avoid re-renders on every frame
  const scroll = useRef({
    current: 0,
    target: 0,
    velocity: 0,
    last: 0,
    ease: 0.05,
  }).current;

  // Main animation loop
  const FrameUpdater = () => {
    useFrame(() => {
      // Lerp the scroll position for smoothness
      scroll.current = gsap.utils.interpolate(
        scroll.current,
        scroll.target,
        scroll.ease
      );

      // Calculate velocity
      scroll.velocity = scroll.current - scroll.last;
      scroll.last = scroll.current;

      // Determine the current project index based on scroll position
      const planeWidthWithGap = window.innerWidth * 0.4 + 1.5; // This needs to match planeSize logic
      const newIndex = Math.round(-scroll.current / planeWidthWithGap);
      const totalProjects = projects.length;
      const clampedIndex =
        ((newIndex % totalProjects) + totalProjects) % totalProjects;

      if (clampedIndex !== currentIndex) {
        setCurrentIndex(clampedIndex);
      }
    });
    return null;
  };

  const currentProject = projects[currentIndex] || projects[0];

  return (
    <div className="min-h-screen">
      <Canvas camera={{ fov: 45, position: [0, 0, 10] }}>
        <Scene projects={projects} scroll={scroll} />
        <FrameUpdater />
      </Canvas>
      <div className="relative left-[5vw] bottom-[5vh] z-20 mix-blend-difference pointer-events-none">
        <h1 className="text-2xl font-bold">{currentProject.name}</h1>
        <p>{currentProject.description}</p>
        <div className="text-2xl mix-blend-difference ">
          <span className="inline-block">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="inline-block">/</span>
          <span className="inline-block">
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};
