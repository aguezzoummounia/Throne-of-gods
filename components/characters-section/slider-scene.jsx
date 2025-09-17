import {
  useRef,
  useMemo,
  useState,
  Suspense,
  useEffect,
  useCallback,
} from "react";
import * as THREE from "three";
import ImagePlane from "./image-plane";
import PlaceholderPlane from "./placeholder-plane";
import { useFrame, useThree, useLoader } from "@react-three/fiber";

// this code was for the old first implementation

const SLIDE_SPACING = 0.1;
const MOBILE_BREAKPOINT = 768;
const SLIDE_WIDTH_RATIO = 0.9;
const PRELOAD_WINDOW = 2;

const SliderScene = ({
  images,
  waveIntensity = 0.1,
  dragSensitivity = 1,
  currentIndex,
  onIndexChange,
  parallaxPos,
  mouseUV,
}) => {
  const { viewport, size, camera } = useThree();
  const [isIntroDone, setIsIntroDone] = useState(false);
  const groupRef = useRef(null);
  const introProgress = useRef(0);

  const dragState = useRef({
    isDown: false,
    startX: 0,
    movementX: 0,
    lastVelocity: 0,
    lastMoveTime: 0,
  });

  const clonedImages = useMemo(() => {
    if (!images || images.length === 0) return [];
    return [...images, ...images, ...images];
  }, [images]);

  const preloadedUrls = useRef(new Set());

  const preloadImageSources = useCallback((sources) => {
    const newSources = sources.filter(
      (src) => src && !preloadedUrls.current.has(src)
    );
    if (newSources.length > 0) {
      try {
        useLoader.preload(THREE.TextureLoader, newSources);
        newSources.forEach((src) => preloadedUrls.current.add(src));
      } catch (e) {
        console.error("Failed to preload textures", e);
      }
    }
  }, []);

  // Preemptively load textures for nearby slides to make navigation smoother.
  useEffect(() => {
    if (!clonedImages.length) return;

    const urlsToPreload = [];
    // Static window preloading
    const start = Math.max(0, currentIndex - PRELOAD_WINDOW);
    const end = Math.min(
      clonedImages.length - 1,
      currentIndex + PRELOAD_WINDOW
    );

    for (let i = start; i <= end; i++) {
      if (clonedImages[i]?.src) {
        urlsToPreload.push(clonedImages[i].src);
      }
    }

    preloadImageSources(urlsToPreload);
  }, [currentIndex, clonedImages, preloadImageSources]);

  const isMobile = viewport.width < MOBILE_BREAKPOINT / 100;
  const slideWidth = viewport.width * SLIDE_WIDTH_RATIO;
  const slideGap = viewport.width * SLIDE_SPACING;
  const totalSlideWidth = slideWidth + slideGap;
  const slideHeight = isMobile ? slideWidth * (16 / 9) : viewport.height * 0.75;
  const targetX = useMemo(
    () => currentIndex * -totalSlideWidth,
    [currentIndex, totalSlideWidth]
  );

  const hasJumped = useRef(false);
  const handleSettle = useCallback(() => {
    if (hasJumped.current || !groupRef.current) return;
    const currentVal = Math.round(
      -groupRef.current.position.x / totalSlideWidth
    );

    let needsJump = false;
    let newIndex = currentIndex;

    if (currentVal >= images.length * 2) {
      newIndex = (currentVal % images.length) + images.length;
      needsJump = true;
    } else if (currentVal < images.length) {
      newIndex = (currentVal % images.length) + images.length;
      needsJump = true;
    }

    if (needsJump) {
      onIndexChange(newIndex);
      groupRef.current.position.x = newIndex * -totalSlideWidth;
      hasJumped.current = true;
    }
  }, [currentIndex, totalSlideWidth, images.length, onIndexChange]);

  // Animation loop
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    hasJumped.current = false;

    // --- Intro Animation ---
    if (!isIntroDone) {
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

      const centerIndex = images.length;
      const parallaxIntensity = 1.5;
      groupRef.current.children.forEach((child, i) => {
        const distanceFromCenter = i - centerIndex;
        const zOffset =
          Math.pow(Math.abs(distanceFromCenter), 1.2) *
          parallaxIntensity *
          (1 - introProgress.current);
        child.position.z = -zOffset;
      });

      if (introProgress.current > 0.999) {
        introProgress.current = 1;
        setIsIntroDone(true);
      }
    } else {
      // --- Camera Parallax Effect ---
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

      // After intro, ensure Z positions are reset
      groupRef.current.children.forEach((child) => {
        if (Math.abs(child.position.z) > 0.001) {
          child.position.z = THREE.MathUtils.damp(
            child.position.z,
            0,
            6,
            delta
          );
        } else {
          child.position.z = 0;
        }
      });
    }

    // --- Slide Position Animation ---
    if (!dragState.current.isDown) {
      const newX = THREE.MathUtils.damp(
        groupRef.current.position.x,
        targetX,
        8,
        delta
      );
      groupRef.current.position.x = newX;

      if (Math.abs(groupRef.current.position.x - targetX) < 0.01) {
        handleSettle();
      }
    }
  });

  // Intro animation setup
  useEffect(() => {
    const startIdx = images.length;
    if (groupRef.current) {
      groupRef.current.position.x = startIdx * -totalSlideWidth * 2;
    }
    camera.position.z = 10;

    const timer = setTimeout(() => {
      onIndexChange(startIdx);
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastPreloadTime = useRef(0);
  const PRELOAD_THROTTLE_INTERVAL = 200; // ms

  // Custom gesture handlers
  const handlePointerDown = (e) => {
    if (!isIntroDone) return;
    dragState.current = {
      isDown: true,
      startX: e.clientX,
      movementX: 0,
      lastVelocity: 0,
      lastMoveTime: Date.now(),
    };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isIntroDone || !dragState.current.isDown || !groupRef.current) return;
    const now = Date.now();
    const moveX =
      e.clientX - dragState.current.startX - dragState.current.movementX;
    const deltaTime = now - dragState.current.lastMoveTime;

    dragState.current.movementX += moveX;
    if (deltaTime > 10) {
      dragState.current.lastVelocity = moveX / deltaTime;
      dragState.current.lastMoveTime = now;
    }

    const dragOffset =
      (dragState.current.movementX / size.width) *
      totalSlideWidth *
      dragSensitivity;
    groupRef.current.position.x = targetX - dragOffset;

    // --- Proactive Preloading Logic based on Velocity ---
    const velocity = dragState.current.lastVelocity;
    const velocityThreshold = 0.2; // Only preload on meaningful movement

    if (
      Math.abs(velocity) > velocityThreshold &&
      now - lastPreloadTime.current > PRELOAD_THROTTLE_INTERVAL
    ) {
      lastPreloadTime.current = now;

      // velocity > 0 means dragging right, showing previous items (index decreases)
      const direction = velocity > 0 ? -1 : 1;

      // Proactively load more images based on how fast the user is swiping
      const proactiveAmount = Math.min(Math.ceil(Math.abs(velocity) * 4), 5); // Load up to 5 extra images

      const urlsToPreload = [];
      const lookaheadStart = currentIndex + direction * (PRELOAD_WINDOW + 1);

      for (let i = 0; i < proactiveAmount; i++) {
        const preloadIndex = lookaheadStart + i * direction;
        if (preloadIndex >= 0 && preloadIndex < clonedImages.length) {
          const imgSrc = clonedImages[preloadIndex]?.src;
          if (imgSrc) {
            urlsToPreload.push(imgSrc);
          }
        }
      }

      if (urlsToPreload.length > 0) {
        preloadImageSources(urlsToPreload);
      }
    }
  };

  const handlePointerUp = (e) => {
    if (!isIntroDone) return;
    e.target.releasePointerCapture(e.pointerId);
    dragState.current.isDown = false;

    const flickThreshold = 0.4;
    let newIndex = currentIndex;
    const currentPosition = groupRef.current?.position.x ?? targetX;
    const draggedIndex = Math.round(-currentPosition / totalSlideWidth);

    if (Math.abs(dragState.current.lastVelocity) > flickThreshold) {
      newIndex =
        dragState.current.lastVelocity > 0
          ? currentIndex - 1
          : currentIndex + 1;
    } else {
      newIndex = draggedIndex;
    }
    onIndexChange(newIndex);
  };

  const SlideItem = ({ img, i }) => {
    const isVisible = Math.abs(i - currentIndex) <= PRELOAD_WINDOW;

    return (
      <group position={[i * totalSlideWidth, 0, 0]}>
        {isVisible ? (
          <Suspense
            fallback={
              <PlaceholderPlane width={slideWidth} height={slideHeight} />
            }
          >
            <ImagePlane
              image={img}
              width={slideWidth}
              height={slideHeight}
              waveIntensity={waveIntensity}
              introProgress={introProgress}
              mouseUV={mouseUV}
            />
          </Suspense>
        ) : (
          <PlaceholderPlane width={slideWidth} height={slideHeight} />
        )}
      </group>
    );
  };

  return (
    <group
      ref={groupRef}
      //   onPointerDown={handlePointerDown}
      //   onPointerMove={handlePointerMove}
      //   onPointerUp={handlePointerUp}
      //   onPointerCancel={handlePointerUp}
      //   onPointerLeave={handlePointerUp}
    >
      {clonedImages.map((img, i) => (
        <SlideItem key={i} img={img} i={i} />
      ))}
    </group>
  );
};

export default SliderScene;
