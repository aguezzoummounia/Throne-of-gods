"use client";
import Particles from "./particles";
import SlideItem from "./slide-item";
import SliderTitles from "./slider-titles";
import { Canvas } from "@react-three/fiber";
import { slideInOut } from "../global/header";
import SliderControls from "./slider-controls";
import SliderIndicators from "./slider-indicators";
import { charactersArray as images } from "@/lib/data";
import SceneController from "./slider-scene-controller";
import LayoutCalculator from "./slider-layout-calculator";
import { useTransitionRouter } from "next-view-transitions";
import { useRef, Suspense, useState, useEffect, useCallback } from "react";

// const WEBGLSlider = () => {
//   const [visualIndex, setVisualIndex] = useState(0);
//   const [currentIndex, setCurrentIndex] = useState(
//     images.length > 0 ? images.length : 0
//   );

//   const parallaxPos = useRef({ x: 0, y: 0 });
//   const mouseUV = useRef(new THREE.Vector2(-1, -1));

//   const handleMouseMove = useCallback((e) => {
//     const { clientX, clientY, currentTarget } = e;
//     const rect = currentTarget.getBoundingClientRect();

//     // For parallax effect: coords from -1 to 1
//     parallaxPos.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
//     parallaxPos.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

//     // For hover effect: UV coords from 0 to 1
//     const u = (clientX - rect.left) / rect.width;
//     const v = 1.0 - (clientY - rect.top) / rect.height; // Invert Y for THREE.js texture coords
//     mouseUV.current.set(u, v);
//   }, []);

//   const handleMouseLeave = useCallback(() => {
//     // Reset positions for smooth return to center
//     parallaxPos.current = { x: 0, y: 0 };
//     mouseUV.current.set(-1, -1); // Set to off-screen
//   }, []);

//   useEffect(() => {
//     if (!images || images.length === 0) return;
//     console.log("currentIndex is : ", currentIndex);

//     const positiveIndex =
//       ((currentIndex % images.length) + images.length) % images.length;
//     setVisualIndex(positiveIndex);
//   }, [currentIndex]);

//   return (
//     <div
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       className="flex flex-1"
//     >
//       <div className="w-full h-full relative">
//         <SliderTitles data={images} selectedIndex={visualIndex} />
//         <SliderControls handleClick={setCurrentIndex} />
//         <SliderIndicators
//           selectedIndex={visualIndex}
//           handleClick={setCurrentIndex}
//           length={images.length}
//         />
//         <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
//           <ambientLight intensity={0.5} />
//           <Particles />
//           <Suspense fallback={null}>
//             <SliderScene
//               images={images}
//               mouseUV={mouseUV}
//               waveIntensity={0.1}
//               dragSensitivity={1.1}
//               parallaxPos={parallaxPos}
//               currentIndex={currentIndex}
//               onIndexChange={(index) => setCurrentIndex(index)}
//             />
//           </Suspense>
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default WEBGLSlider;

const WEBGLSlider = ({
  waveAmplitude = 0.1,
  dragSensitivity = 1.1,
  onSlideChange = () => {},
}) => {
  const router = useTransitionRouter();
  const [visualIndex, setVisualIndex] = useState(0);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const [sliderMetrics, setSliderMetrics] = useState({
    slideWidth: 0,
    totalSlideWidth: 0,
    slideHeight: 0,
    totalTrackWidth: 0,
  });

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

  const handleLayoutCalculated = useCallback((metrics) => {
    setSliderMetrics(metrics);
  }, []);

  useEffect(() => {
    onSlideChange(visualIndex);
  }, [visualIndex, onSlideChange]);

  const handleIndexChange = useCallback((index) => {
    setVisualIndex(index);
  }, []);

  const handlePointerDown = (e) => {
    if (!isIntroDone) return;
    dragState.current.isDown = true;
    dragState.current.startX = e.clientX;
    dragState.current.startScroll = targetScroll.current;
    dragState.current.lastScrollPos = targetScroll.current;
    dragState.current.lastVelocity = 0;
    dragState.current.lastMoveTime = Date.now();
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (
      !isIntroDone ||
      !dragState.current.isDown ||
      sliderMetrics.totalSlideWidth === 0
    )
      return;
    const now = Date.now();
    const moveX = e.clientX - dragState.current.startX;
    const deltaTime = now - dragState.current.lastMoveTime;

    const dragOffset =
      (moveX / window.innerWidth) *
      sliderMetrics.totalSlideWidth *
      dragSensitivity;
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

  const handlePointerUp = (e) => {
    if (!isIntroDone || sliderMetrics.totalSlideWidth === 0) return;
    dragState.current.isDown = false;
    e.target.releasePointerCapture(e.pointerId);

    const flickThreshold = 0.0005;
    const velocity = dragState.current.lastVelocity;
    let projectedScroll = targetScroll.current;

    if (Math.abs(velocity) > flickThreshold) {
      const flingDistance = velocity * 250;
      projectedScroll += flingDistance;
    }

    const nearestIndex = Math.round(
      projectedScroll / sliderMetrics.totalSlideWidth
    );
    targetScroll.current = nearestIndex * sliderMetrics.totalSlideWidth;
  };

  const handlePrev = useCallback(() => {
    if (sliderMetrics.totalSlideWidth === 0) return;
    const currentIndex = Math.round(
      targetScroll.current / sliderMetrics.totalSlideWidth
    );
    targetScroll.current = (currentIndex - 1) * sliderMetrics.totalSlideWidth;
  }, [sliderMetrics.totalSlideWidth]);

  const handleNext = useCallback(() => {
    if (sliderMetrics.totalSlideWidth === 0) return;
    const currentIndex = Math.round(
      targetScroll.current / sliderMetrics.totalSlideWidth
    );
    targetScroll.current = (currentIndex + 1) * sliderMetrics.totalSlideWidth;
  }, [sliderMetrics.totalSlideWidth]);

  const handleMouseMoveForParallax = useCallback((e) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    parallaxPos.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    parallaxPos.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  const handleMouseLeaveForParallax = useCallback(() => {
    parallaxPos.current = { x: 0, y: 0 };
  }, []);

  const handleNavigate = () => {
    router.push(`/characters/${images[visualIndex].slug}`, {
      onTransitionReady: slideInOut,
    });
  };

  return (
    <div className="2xl:h-[100vh] xl:h-[80vh] lg:h-[70vh] md:h-[100vw] h-[550px]">
      <div
        onMouseMove={handleMouseMoveForParallax}
        onMouseLeave={handleMouseLeaveForParallax}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
      >
        <SliderTitles data={images} selectedIndex={visualIndex} />
        <SliderControls
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleNavigate={handleNavigate}
        />
        <SliderIndicators
          length={images.length}
          selectedIndex={visualIndex}
          // handleClick={handleClick}
        />
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <Particles count={5000} size={50} parallaxPos={parallaxPos} />
            <LayoutCalculator
              imagesLength={images.length}
              onLayoutCalculated={handleLayoutCalculated}
            />
            {sliderMetrics.slideWidth > 0 && (
              <>
                <SceneController
                  scrollPosition={scrollPosition}
                  targetScroll={targetScroll}
                  dragState={dragState}
                  onIndexChange={handleIndexChange}
                  imagesLength={images.length}
                  totalSlideWidth={sliderMetrics.totalSlideWidth}
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
                    totalSlideWidth={sliderMetrics.totalSlideWidth}
                    totalTrackWidth={sliderMetrics.totalTrackWidth}
                    slideWidth={sliderMetrics.slideWidth}
                    slideHeight={sliderMetrics.slideHeight}
                    waveAmplitude={waveAmplitude}
                    introProgress={introProgress}
                  />
                ))}
              </>
            )}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default WEBGLSlider;
