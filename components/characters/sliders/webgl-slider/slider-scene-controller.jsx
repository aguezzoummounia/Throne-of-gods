import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const SceneController = ({
  scrollPosition,
  targetScroll,
  dragState,
  onIndexChange,
  imagesLength,
  totalSlideWidth,
  parallaxPos,
  globalScrollVelocity,
}) => {
  const { camera } = useThree();
  const lastScrollPos = useRef(scrollPosition.current);

  useFrame((_, delta) => {
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

    const scrollDelta = scrollPosition.current - lastScrollPos.current;
    const velocity = scrollDelta / (delta || 1 / 60);
    globalScrollVelocity.current = THREE.MathUtils.damp(
      globalScrollVelocity.current,
      velocity,
      4,
      delta
    );
    lastScrollPos.current = scrollPosition.current;

    const activeIndex = Math.round(scrollPosition.current / totalSlideWidth);
    const visualIndex =
      ((activeIndex % imagesLength) + imagesLength) % imagesLength;
    onIndexChange(visualIndex);
  });

  return null;
};

export default SceneController;
