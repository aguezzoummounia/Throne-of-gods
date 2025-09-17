import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const SLIDE_WIDTH_RATIO = 0.9;

const LayoutCalculator = ({ imagesLength, onLayoutCalculated }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    // FIX: The camera from useThree is a generic THREE.Camera. We must check if it's a
    // PerspectiveCamera before accessing properties like .fov and .aspect.
    if (!camera) {
      return;
    }

    // The viewport dimensions from useThree() are based on the camera's current Z position.
    // During the intro, the camera moves from z=10 to z=5.
    // This causes the initial layout (calculated at z=10) to be too large for the final scene (at z=5).
    // To fix this, we manually calculate the viewport dimensions for the final camera Z position.
    const finalCameraZ = 5;
    const fovInRadians = (camera.fov * Math.PI) / 180;
    const viewportHeightAtFinalZ =
      2 * Math.tan(fovInRadians / 2) * finalCameraZ;
    const viewportWidthAtFinalZ = viewportHeightAtFinalZ * camera.aspect;

    const slideWidth = viewportWidthAtFinalZ * SLIDE_WIDTH_RATIO;
    const gap = viewportWidthAtFinalZ * (1.0 - SLIDE_WIDTH_RATIO);
    const totalSlideWidth = slideWidth + gap;

    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1025;

    let slideHeight;
    if (isMobile) {
      slideHeight = slideWidth * (3 / 2); // Portrait 2:3 for mobile
    } else if (isTablet) {
      slideHeight = slideWidth; // Square 1:1 for tablet
    } else {
      slideHeight = slideWidth * (9 / 16); // Widescreen 16:9 for desktop
    }

    const totalTrackWidth = imagesLength * totalSlideWidth;

    onLayoutCalculated({
      slideWidth,
      totalSlideWidth,
      slideHeight,
      totalTrackWidth,
    });

    // FIX: The original dependency array `[camera.fov, camera.aspect, ...]` caused TypeScript errors.
    // By depending on the `camera` object and `size`, the effect correctly re-runs when the aspect
    // ratio changes on resize, solving the type error while maintaining correct behavior.
  }, [camera, size.width, size.height, imagesLength, onLayoutCalculated]);

  return null;
};

export default LayoutCalculator;
