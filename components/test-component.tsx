import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";

export interface Image {
  src: string;
  alt: string;
}

export interface WebGLSliderProps {
  images: Image[];
  waveAmplitude?: number;
  dragSensitivity?: number;
  onSlideChange?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface ImagePlaneProps {
  image: Image;
  width: number;
  height: number;
  waveAmplitude: number;
  index: number;
  scrollVelocity: React.MutableRefObject<number>;
}
// Constants
const MOBILE_BREAKPOINT = 768;
const SLIDE_WIDTH_RATIO = 0.95;
const SLIDE_SPACING = 0.1;

// --- [UNCHANGED] Vertex Shader ---
const vertexShader = `
  precision highp float;
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uWaveAmplitude;
  uniform float uIndex;
  varying vec2 vUv;
  varying float vWave;
  varying float vFogDepth;
  void main() {
      vUv = uv;
      vec3 pos = position;
      float wavePhase = (uv.x + uv.y) * 8.0 + uTime * 2.0 + uIndex * 0.7;
      float primaryWave = sin(wavePhase) * uWaveAmplitude;
      float secondaryWave = sin(wavePhase * 2.5 + uIndex) * (uWaveAmplitude * 0.4);
      float tertiaryWave = sin(wavePhase * 4.0 - uTime * 2.0) * (uWaveAmplitude * 0.2);
      float amplitudeFalloff = (1.0 - (uv.x + uv.y) * 0.5) * 0.15 + 0.35;
      float combinedWave = (primaryWave + secondaryWave + tertiaryWave) * amplitudeFalloff;
      pos.z += combinedWave;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vWave = combinedWave;
      vFogDepth = -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
  }
`;

// --- [UPDATED] Fragment Shader ---
const fragmentShader = `
  precision highp float;

  // Uniforms from JavaScript
  uniform sampler2D tMap;
  uniform vec2 uImageSizes;
  uniform vec2 uPlaneSizes;
  uniform vec3 uFogColor;
  uniform float uFogFar;
  uniform float uFogNear;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;
  uniform vec2 uMouseVelocity;

  // Varyings from Vertex Shader
  varying vec2 vUv;
  varying float vWave;
  varying float vFogDepth;

  // --- Helper Functions ---
  float fresnel(vec3 viewDirection, vec3 normal, float power) {
      return pow(1.0 - abs(dot(viewDirection, normal)), power);
  }

  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
  }

  float smoothNoise(vec2 st) {
      return noise(st);
  }
  
  // --- Distortion Functions ---
  vec2 createRipple(vec2 uv, vec2 center, float time, float intensity) {
      vec2 diff = uv - center;
      float dist = length(diff);
      float ripple1 = sin(dist * 3.0 - time * 8.0) * exp(-dist * 0.6);
      float ripple2 = sin(dist * 5.0 - time * 12.0) * exp(-dist * 1.0);
      float combinedRipple = (ripple1 + ripple2 * 0.5) * intensity;
      vec2 direction = dist > 0.0 ? normalize(diff) : vec2(0.0);
      return direction * combinedRipple * 0.2;
  }

  vec2 createFluidDistortion(vec2 uv, vec2 mousePos, float time, float influence) {
      vec2 diff = uv - mousePos;
      float dist = length(diff);
      float falloff = 1.0 - smoothstep(0.0, 0.3, dist);
      float angle = atan(diff.y, diff.x);
      float swirl = sin(angle * 3.0 + time * 2.0) * falloff;
      float radial = sin(dist * 20.0 - time * 6.0) * falloff;
      vec2 distortion = vec2(cos(angle + swirl) * radial, sin(angle + swirl) * radial) * influence * 0.03;
      return distortion;
  }

  vec2 createVelocityDistortion(vec2 uv, vec2 mousePos, vec2 velocity, float influence) {
      vec2 diff = uv - mousePos;
      float dist = length(diff);
      float velocityMag = length(velocity);
      float falloff = 1.0 - smoothstep(0.0, 0.4, dist);
      vec2 velocityDir = velocityMag > 0.001 ? normalize(velocity) : vec2(0.0);
      float wave = sin(dot(diff, velocityDir) * 10.0 - uTime * 8.0) * falloff;
      return velocityDir * wave * velocityMag * influence * 0.02;
  }

  void main() {
      // 1. Correct the Aspect Ratio of the Texture
      vec2 ratio = vec2(
          min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
          min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
      );
      vec2 correctedUv = vec2(
          vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );

      // 2. Calculate Mouse Distortion
      float influence = uMouseInfluence;
      vec2 mouseUV = uMouse;
      
      vec2 rippleDistortion = createRipple(vUv, mouseUV, uTime, influence);
      vec2 fluidDistortion = createFluidDistortion(vUv, mouseUV, uTime, influence);
      vec2 velocityDistortion = createVelocityDistortion(vUv, mouseUV, uMouseVelocity, influence);
      vec2 globalWave = vec2(
          smoothNoise(vUv * 3.0 + uTime * 0.1) * 0.004,
          smoothNoise(vUv * 3.0 + vec2(100.0) + uTime * 0.1) * 0.004
      ) * influence;
      
      vec2 totalDistortion = rippleDistortion + fluidDistortion + velocityDistortion + globalWave;
      
      // 3. Apply Distortion and Sample Color (with Chromatic Aberration)
      vec2 finalUv = clamp(correctedUv + totalDistortion, 0.0, 1.0);
      vec3 finalColor;
      if (influence > 0.1) {
          // FIX: Increased chromatic aberration strength for more visual impact.
          float aberrationStrength = influence * 0.01;
          float r = texture2D(tMap, finalUv + vec2(aberrationStrength, 0.0)).r;
          float g = texture2D(tMap, finalUv).g;
          float b = texture2D(tMap, finalUv - vec2(aberrationStrength, 0.0)).b;
          finalColor = vec3(r, g, b);
      } else {
          finalColor = texture2D(tMap, finalUv).rgb;
      }
      vec4 color = vec4(finalColor, 1.0);

      // 4. Edge Effects (Rounded Corners & All-Side Fade)
      // Rounded corners
      float cornerFade = 1.0 - (pow(abs(vUv.x - 0.5) * 2.0, 12.0) + pow(abs(vUv.y - 0.5) * 2.0, 12.0));
      color.a *= smoothstep(0.0, 0.2, cornerFade);

      // Vignette fade on all edges
      float fadeWidth = 0.125; // Halved from 0.25 for less intensity
      float horizontalFade = smoothstep(0.0, fadeWidth, vUv.x) * smoothstep(1.0, 1.0 - fadeWidth, vUv.x);
      float verticalFade = smoothstep(0.0, fadeWidth, vUv.y) * smoothstep(1.0, 1.0 - fadeWidth, vUv.y);
      color.a *= horizontalFade * verticalFade;

      // 5. Calculate lighting and reflection from vertex shader wave
      vec3 normal = normalize(vec3(vWave * 0.2, vWave * 0.2, 1.0));
      vec3 viewDirection = normalize(vec3(0.0, 0.0, 1.0));
      float fresnelFactor = fresnel(viewDirection, normal, 3.0) * 0.15;
      float lightIntensity = 1.0 + vWave * 2.0;
      color.rgb *= lightIntensity;
      color.rgb += fresnelFactor;

      // 6. Add subtle glow around cursor
      float dist = length(vUv - mouseUV);
      float glow = 1.0 - smoothstep(0.0, 0.2, dist);
      // FIX: Increased glow intensity for more visual impact.
      color.rgb += glow * influence * 0.15;

      // 7. Apply Fog
      float fogFactor = smoothstep(uFogNear, uFogFar, vFogDepth);
      color.rgb = mix(color.rgb, uFogColor, fogFactor);

      gl_FragColor = color;
  }
`;

// --- [UNCHANGED] Image Plane Component with Mouse Interaction ---
const ImagePlane: React.FC<ImagePlaneProps> = ({
  image,
  width,
  height,
  waveAmplitude,
  index,
  scrollVelocity,
}) => {
  const texture = useLoader(THREE.TextureLoader, image.src);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const mouseData = useRef({
    pos: new THREE.Vector2(),
    targetPos: new THREE.Vector2(),
    velocity: new THREE.Vector2(),
    influence: 0,
    targetInfluence: 0,
    lastPos: new THREE.Vector2(),
  });

  const uniforms = useMemo(() => {
    const imageSize = new THREE.Vector2(
      texture.image.width,
      texture.image.height
    );
    const planeSize = new THREE.Vector2(width, height);
    const fogColor = new THREE.Color("#1a202c");

    return {
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uWaveAmplitude: { value: waveAmplitude },
      uIndex: { value: index },
      tMap: { value: texture },
      uImageSizes: { value: imageSize },
      uPlaneSizes: { value: planeSize },
      uFogColor: { value: fogColor },
      uFogFar: { value: 10.0 },
      uFogNear: { value: 2.0 },
      // Mouse uniforms
      uMouse: { value: mouseData.current.pos },
      uMouseVelocity: { value: mouseData.current.velocity },
      uMouseInfluence: { value: 0 },
    };
  }, [texture, width, height, waveAmplitude, index]);

  useFrame(({ clock }, delta) => {
    // Smoothly interpolate mouse position for a fluid feel
    mouseData.current.pos.lerp(mouseData.current.targetPos, 0.1);

    // Calculate velocity by comparing current and last frame's position
    const velocity = mouseData.current.pos
      .clone()
      .sub(mouseData.current.lastPos);
    mouseData.current.velocity.lerp(velocity, 0.15); // Smooth velocity as well
    mouseData.current.lastPos.copy(mouseData.current.pos);

    // The "influence" of the effect is based on how fast the mouse is moving
    const speed = mouseData.current.velocity.length();
    mouseData.current.targetInfluence =
      speed > 0.001 ? Math.min(speed * 5.0, 1.0) : 0.0;
    mouseData.current.influence = THREE.MathUtils.damp(
      mouseData.current.influence,
      mouseData.current.targetInfluence,
      4,
      delta
    );

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uScrollVelocity.value = THREE.MathUtils.damp(
        shaderRef.current.uniforms.uScrollVelocity.value,
        scrollVelocity.current,
        4,
        delta
      );
      shaderRef.current.uniforms.uMouse.value.copy(mouseData.current.pos);
      shaderRef.current.uniforms.uMouseVelocity.value.copy(
        mouseData.current.velocity
      );
      shaderRef.current.uniforms.uMouseInfluence.value =
        mouseData.current.influence;
    }
  });

  return (
    <mesh
      onPointerMove={(e) => {
        if (e.uv) {
          // event.uv gives us the texture coordinate on the mesh, which is exactly what we need.
          mouseData.current.targetPos.copy(e.uv);
        }
      }}
      onPointerLeave={() => {
        // When the mouse leaves, we want the influence to fade out.
        mouseData.current.targetInfluence = 0;
      }}
    >
      <planeGeometry args={[width, height, 32, 32]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// --- [UNCHANGED FROM PREVIOUS] All other components below ---
const PlaceholderPlane = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => (
  <mesh>
    {" "}
    <planeGeometry args={[width, height]} />{" "}
    <meshBasicMaterial color="#1a202c" side={THREE.DoubleSide} />{" "}
  </mesh>
);

const ArrowButton = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
      direction === "left" ? "left-4" : "right-4"
    }`}
    aria-label={direction === "left" ? "Previous slide" : "Next slide"}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {direction === "left" ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      )}
    </svg>
  </button>
);

const SlideItem = ({
  image,
  index,
  scrollPosition,
  totalSlideWidth,
  totalTrackWidth,
  slideWidth,
  slideHeight,
  waveAmplitude,
  introProgress,
}) => {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const wrappingOffset = useRef(0);
  const scrollVelocity = useRef(0);
  const lastScrollPos = useRef(scrollPosition.current);

  useFrame((_, delta) => {
    const deltaScroll = scrollPosition.current - lastScrollPos.current;
    scrollVelocity.current = deltaScroll / (delta || 1 / 60);
    lastScrollPos.current = scrollPosition.current;

    const initialX = index * totalSlideWidth;
    const currentX = initialX - scrollPosition.current + wrappingOffset.current;

    const slideRightEdge = currentX + totalSlideWidth / 2;
    const viewportLeftEdge = -viewport.width / 2 - totalSlideWidth;
    const slideLeftEdge = currentX - totalSlideWidth / 2;
    const viewportRightEdge = viewport.width / 2 + totalSlideWidth;

    if (slideRightEdge < viewportLeftEdge) {
      wrappingOffset.current += totalTrackWidth;
    } else if (slideLeftEdge > viewportRightEdge) {
      wrappingOffset.current -= totalTrackWidth;
    }

    groupRef.current.position.x =
      initialX - scrollPosition.current + wrappingOffset.current;

    const centerIndex = Math.round(scrollPosition.current / totalSlideWidth);
    const distanceFromCenter = index - centerIndex;
    const parallaxIntensity = 1.5;
    const zOffset =
      Math.pow(Math.abs(distanceFromCenter), 1.2) *
      parallaxIntensity *
      (1 - introProgress.current);
    groupRef.current.position.z = -zOffset;
  });

  return (
    <group ref={groupRef}>
      <Suspense
        fallback={<PlaceholderPlane width={slideWidth} height={slideHeight} />}
      >
        <ImagePlane
          image={image}
          width={slideWidth}
          height={slideHeight}
          waveAmplitude={waveAmplitude}
          index={index}
          scrollVelocity={scrollVelocity}
        />
      </Suspense>
    </group>
  );
};

const SceneController = ({
  scrollPosition,
  targetScroll,
  dragState,
  onIndexChange,
  imagesLength,
  totalSlideWidth,
  parallaxPos,
  introProgress,
  setIsIntroDone,
}) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (introProgress.current < 1) {
      introProgress.current = THREE.MathUtils.damp(
        introProgress.current,
        1,
        1.5,
        delta
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        5,
        2.5,
        delta
      );
      if (introProgress.current > 0.999) {
        introProgress.current = 1;
        setIsIntroDone(true);
      }
    } else {
      const parallaxFactor = 0.2;
      const targetXParallax = parallaxPos.current.x * parallaxFactor;
      const targetYParallax = parallaxPos.current.y * parallaxFactor;
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        targetXParallax,
        4,
        delta
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        targetYParallax,
        4,
        delta
      );
      camera.lookAt(0, 0, 0);
    }

    if (!dragState.current.isDown) {
      scrollPosition.current = THREE.MathUtils.damp(
        scrollPosition.current,
        targetScroll.current,
        8,
        delta
      );
    } else {
      scrollPosition.current = targetScroll.current;
    }

    const activeIndex = Math.round(scrollPosition.current / totalSlideWidth);
    const visualIndex =
      ((activeIndex % imagesLength) + imagesLength) % imagesLength;
    onIndexChange(visualIndex);
  });

  return null;
};

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1/4 h-0.5 bg-gray-700 rounded-full overflow-hidden z-10">
    <div
      className="h-full bg-white transition-all duration-500 ease-out"
      style={{ width: `${progress * 100}%` }}
    />
  </div>
);

// --- [UNCHANGED] Particles Component ---
const Particles = ({ count = 100, size = 25 }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    if (context) {
      const gradient = context.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.2)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);
  const { positions, factors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const fac = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * size;
      pos[i * 3 + 1] = (Math.random() - 0.5) * size;
      pos[i * 3 + 2] = (Math.random() - 0.5) * size - 5;
      fac[i] = 0.5 + Math.random() * 0.5;
    }
    return { positions: pos, factors: fac };
  }, [count, size]);
  const originalPositions = useRef(positions.slice());
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const currentPositions = (
      pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    ).array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const factor = factors[i];
      const origX = originalPositions.current[i3];
      const origY = originalPositions.current[i3 + 1];
      const origZ = originalPositions.current[i3 + 2];
      currentPositions[i3] =
        origX + Math.cos(elapsedTime * factor * 0.4 + origY) * 0.8;
      currentPositions[i3 + 1] =
        origY + Math.sin(elapsedTime * factor * 0.6 + origZ) * 0.8;
      currentPositions[i3 + 2] =
        origZ + Math.sin(elapsedTime * factor * 0.8 + origX) * 0.8;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        map={texture}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const WebGLSlider: React.FC<WebGLSliderProps> = ({
  images,
  waveAmplitude = 0.1,
  dragSensitivity = 1.1,
  onSlideChange = () => {},
  className,
  style,
}) => {
  const [visualIndex, setVisualIndex] = useState(0);
  const [isIntroDone, setIsIntroDone] = useState(false);

  const scrollPosition = useRef(0);
  const targetScroll = useRef(0);
  const introProgress = useRef(0);
  const parallaxPos = useRef({ x: 0, y: 0 });

  const dragState = useRef({
    isDown: false,
    startX: 0,
    startScroll: 0,
    lastVelocity: 0,
    lastMoveTime: 0,
    lastScrollPos: 0,
  });

  const { slideWidth, totalSlideWidth, slideHeight, totalTrackWidth } =
    useMemo(() => {
      const isMobile =
        (typeof window !== "undefined" ? window.innerWidth : 1024) <
        MOBILE_BREAKPOINT;
      const viewportWidthApproximation = isMobile ? 3.75 : 10;
      const sWidth = viewportWidthApproximation * SLIDE_WIDTH_RATIO;
      const sGap = viewportWidthApproximation * SLIDE_SPACING;
      const tSlideWidth = sWidth + sGap;
      const sHeight = isMobile ? sWidth * (16 / 10) : sWidth * (10 / 16);
      const tTrackWidth = images.length * tSlideWidth;
      return {
        slideWidth: sWidth,
        totalSlideWidth: tSlideWidth,
        slideHeight: sHeight,
        totalTrackWidth: tTrackWidth,
      };
    }, [images.length]);

  useEffect(() => {
    onSlideChange(visualIndex);
  }, [visualIndex, onSlideChange]);

  const handleIndexChange = useCallback((index: number) => {
    setVisualIndex(index);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isIntroDone) return;
    dragState.current.isDown = true;
    dragState.current.startX = e.clientX;
    dragState.current.startScroll = targetScroll.current;
    dragState.current.lastScrollPos = targetScroll.current;
    dragState.current.lastVelocity = 0;
    dragState.current.lastMoveTime = Date.now();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isIntroDone || !dragState.current.isDown) return;
    const now = Date.now();
    const moveX = e.clientX - dragState.current.startX;
    const deltaTime = now - dragState.current.lastMoveTime;

    const dragOffset =
      (moveX / window.innerWidth) * totalSlideWidth * dragSensitivity;
    targetScroll.current = dragState.current.startScroll - dragOffset;

    if (deltaTime > 10) {
      const lastMoveX =
        targetScroll.current -
        (dragState.current.lastScrollPos || targetScroll.current);
      dragState.current.lastVelocity = lastMoveX / deltaTime;
      dragState.current.lastMoveTime = now;
      dragState.current.lastScrollPos = targetScroll.current;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isIntroDone) return;
    dragState.current.isDown = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    const flickThreshold = 0.0005;
    const velocity = dragState.current.lastVelocity;
    let projectedScroll = targetScroll.current;

    if (Math.abs(velocity) > flickThreshold) {
      const flingDistance = velocity * 250;
      projectedScroll += flingDistance;
    }

    const nearestIndex = Math.round(projectedScroll / totalSlideWidth);
    targetScroll.current = nearestIndex * totalSlideWidth;
  };

  const handlePrev = useCallback(() => {
    const currentIndex = Math.round(targetScroll.current / totalSlideWidth);
    targetScroll.current = (currentIndex - 1) * totalSlideWidth;
  }, [totalSlideWidth]);

  const handleNext = useCallback(() => {
    const currentIndex = Math.round(targetScroll.current / totalSlideWidth);
    targetScroll.current = (currentIndex + 1) * totalSlideWidth;
  }, [totalSlideWidth]);

  const handleMouseMoveForParallax = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, clientY, currentTarget } = e;
      const rect = currentTarget.getBoundingClientRect();
      parallaxPos.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      parallaxPos.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    },
    []
  );

  const handleMouseLeaveForParallax = useCallback(() => {
    parallaxPos.current = { x: 0, y: 0 };
  }, []);

  const progress = images.length > 0 ? (visualIndex + 1) / images.length : 0;

  return (
    <div
      className={`relative w-full h-full cursor-grab active:cursor-grabbing ${
        className || ""
      }`}
      style={style}
      onMouseMove={handleMouseMoveForParallax}
      onMouseLeave={handleMouseLeaveForParallax}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <ArrowButton direction="left" onClick={handlePrev} />
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Particles size={50} />
        <Suspense fallback={null}>
          <SceneController
            scrollPosition={scrollPosition}
            targetScroll={targetScroll}
            dragState={dragState}
            onIndexChange={handleIndexChange}
            imagesLength={images.length}
            totalSlideWidth={totalSlideWidth}
            parallaxPos={parallaxPos}
            introProgress={introProgress}
            setIsIntroDone={setIsIntroDone}
          />
          {images.map((img, i) => (
            <SlideItem
              key={img.src + i}
              image={img}
              index={i}
              scrollPosition={scrollPosition}
              totalSlideWidth={totalSlideWidth}
              totalTrackWidth={totalTrackWidth}
              slideWidth={slideWidth}
              slideHeight={slideHeight}
              waveAmplitude={waveAmplitude}
              introProgress={introProgress}
            />
          ))}
        </Suspense>
      </Canvas>
      <ArrowButton direction="right" onClick={handleNext} />
      <ProgressBar progress={progress} />
    </div>
  );
};

export default WebGLSlider;
