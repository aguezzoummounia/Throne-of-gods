"use client";
import {
  useRef,
  useMemo,
  Suspense,
  useState,
  useEffect,
  useCallback,
} from "react";
import Particles from "./particles";
import SlideItem from "./slide-item";
import SliderTitles from "./slider-titles";
import { Canvas } from "@react-three/fiber";
import { slideInOut } from "../../../global/header";
import SliderControls from "./slider-controls";
import SliderIndicators from "./slider-indicators";
import { charactersArray as images } from "@/lib/data";
import SceneController from "./slider-scene-controller";
import LayoutCalculator from "./slider-layout-calculator";
import { useTransitionRouter } from "next-view-transitions";

const usePerformanceProfile = () => {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return {
        level: "high",
        dpr: 2,
        particleCount: 5000,
        planeSegments: 32,
        shaderPerformance: 2,
      };
    }

    const width = window.innerWidth;
    if (width < 768) {
      // Low-end mobile
      return {
        level: "low",
        dpr: 1,
        particleCount: 800,
        planeSegments: 16,
        shaderPerformance: 0,
      };
    }
    if (width < 1024) {
      // High-end mobile / Tablet
      return {
        level: "medium",
        dpr: 1.5,
        particleCount: 2000,
        planeSegments: 24,
        shaderPerformance: 1,
      };
    }
    // Desktop
    return {
      level: "high",
      dpr: 2,
      particleCount: 5000,
      planeSegments: 32,
      shaderPerformance: 2,
    };
  }, []);
};

const WEBGLSlider = ({
  waveAmplitude = 0.1,
  dragSensitivity = 1.1,
  onSlideChange = () => {},
}) => {
  const router = useTransitionRouter();
  const performance = usePerformanceProfile();
  const [visualIndex, setVisualIndex] = useState(0);
  const [sliderMetrics, setSliderMetrics] = useState({
    slideWidth: 0,
    totalSlideWidth: 0,
    slideHeight: 0,
    totalTrackWidth: 0,
  });

  const scrollPosition = useRef(0);
  const targetScroll = useRef(0);
  const parallaxPos = useRef({ x: 0, y: 0 });
  const globalScrollVelocity = useRef(0);

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

  const handlePointerDown = useCallback((e) => {
    dragState.current.isDown = true;
    dragState.current.startX = e.clientX;
    dragState.current.startScroll = targetScroll.current;
    dragState.current.lastScrollPos = targetScroll.current;
    dragState.current.lastVelocity = 0;
    dragState.current.lastMoveTime = Date.now();
    e.target.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragState.current.isDown || sliderMetrics.totalSlideWidth === 0)
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
    },
    [sliderMetrics.totalSlideWidth, dragSensitivity]
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (sliderMetrics.totalSlideWidth === 0 || !dragState.current.isDown)
        return;
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
    },
    [sliderMetrics.totalSlideWidth]
  );

  const handlePointerCancelOrLeave = useCallback(
    (e) => {
      if (!dragState.current.isDown) return;
      dragState.current.isDown = false;
      e.target.releasePointerCapture(e.pointerId);

      // On cancel or leave, just snap to the nearest slide without any flick momentum.
      const nearestIndex = Math.round(
        targetScroll.current / sliderMetrics.totalSlideWidth
      );
      targetScroll.current = nearestIndex * sliderMetrics.totalSlideWidth;
    },
    [sliderMetrics.totalSlideWidth]
  );

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

  const handleMouseMoveForParallax = useCallback(
    (e) => {
      if (performance.level === "low") return;
      const { clientX, clientY, currentTarget } = e;
      const rect = currentTarget.getBoundingClientRect();
      parallaxPos.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      parallaxPos.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    },
    [performance.level]
  );

  const handleMouseLeaveForParallax = useCallback((_e) => {
    parallaxPos.current.x = 0;
    parallaxPos.current.y = 0;
  }, []);

  const handleNavigate = () => {
    router.push(`/characters/${images[visualIndex].slug}`, {
      onTransitionReady: slideInOut,
    });
  };
  const preloadRange = 1;

  return (
    <div className="2xl:h-[90vh] xl:h-[70vh] lg:h-[50vh] md:aspect-square max-md:aspect-[2/3] max-md:h-auto">
      <div
        onPointerUp={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onMouseMove={handleMouseMoveForParallax}
        onMouseLeave={handleMouseLeaveForParallax}
        onPointerLeave={handlePointerCancelOrLeave}
        onPointerCancel={handlePointerCancelOrLeave}
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
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={performance.dpr}>
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <Particles
              count={performance.particleCount}
              size={50}
              parallaxPos={parallaxPos}
              globalScrollVelocity={globalScrollVelocity}
            />
            <LayoutCalculator
              imagesLength={images.length}
              onLayoutCalculated={handleLayoutCalculated}
            />
            {sliderMetrics.slideWidth > 0 && (
              <>
                <SceneController
                  dragState={dragState}
                  parallaxPos={parallaxPos}
                  targetScroll={targetScroll}
                  imagesLength={images.length}
                  scrollPosition={scrollPosition}
                  onIndexChange={handleIndexChange}
                  globalScrollVelocity={globalScrollVelocity}
                  totalSlideWidth={sliderMetrics.totalSlideWidth}
                />
                {images.map((img, i) => {
                  const distance = Math.min(
                    Math.abs(i - visualIndex),
                    images.length - Math.abs(i - visualIndex)
                  );
                  const isVisible = distance <= preloadRange;

                  return (
                    <SlideItem
                      index={i}
                      image={img}
                      key={img.src + i}
                      isVisible={isVisible}
                      waveAmplitude={waveAmplitude}
                      scrollPosition={scrollPosition}
                      slideWidth={sliderMetrics.slideWidth}
                      slideHeight={sliderMetrics.slideHeight}
                      planeSegments={performance.planeSegments}
                      totalSlideWidth={sliderMetrics.totalSlideWidth}
                      totalTrackWidth={sliderMetrics.totalTrackWidth}
                      shaderPerformance={performance.shaderPerformance}
                    />
                  );
                })}
              </>
            )}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
export default WEBGLSlider;
