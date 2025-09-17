import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

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

export default SceneController;
