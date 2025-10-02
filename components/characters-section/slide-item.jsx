import * as THREE from "three";
import ImagePlane from "./image-plane";
import { useRef, Suspense } from "react";
import PlaceholderPlane from "./placeholder-plane";
import { useFrame, useThree } from "@react-three/fiber";

const SlideItem = ({
  image,
  index,
  scrollPosition,
  totalSlideWidth,
  totalTrackWidth,
  slideWidth,
  slideHeight,
  waveAmplitude,
  isVisible,
  planeSegments,
  shaderPerformance,
}) => {
  const { viewport } = useThree();
  const groupRef = useRef(null);
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

    const distanceFromCenter = Math.abs(groupRef.current.position.x);
    const distanceFactor = Math.min(distanceFromCenter / totalSlideWidth, 1.0);
    const targetScale = 1.0 - distanceFactor * 0.05;
    groupRef.current.scale.x = THREE.MathUtils.damp(
      groupRef.current.scale.x,
      targetScale,
      6,
      delta
    );
    groupRef.current.scale.y = THREE.MathUtils.damp(
      groupRef.current.scale.y,
      targetScale,
      6,
      delta
    );
  });

  return (
    <group ref={groupRef}>
      {isVisible ? (
        <Suspense
          fallback={
            <PlaceholderPlane width={slideWidth} height={slideHeight} />
          }
        >
          <ImagePlane
            image={image}
            width={slideWidth}
            height={slideHeight}
            waveAmplitude={waveAmplitude}
            index={index}
            scrollVelocity={scrollVelocity}
            planeSegments={planeSegments}
            shaderPerformance={shaderPerformance}
          />
        </Suspense>
      ) : (
        <PlaceholderPlane width={slideWidth} height={slideHeight} />
      )}
    </group>
  );
};
export default SlideItem;
