import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const LayoutCalculator = ({ imagesLength, onLayoutCalculated }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!camera) {
      return;
    }

    const finalCameraZ = 5;
    const fovInRadians = (camera.fov * Math.PI) / 180;
    const viewportHeightAtFinalZ =
      2 * Math.tan(fovInRadians / 2) * finalCameraZ;
    const viewportWidthAtFinalZ = viewportHeightAtFinalZ * camera.aspect;

    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width <= 1024;
    const isDesktop = !isMobile && !isTablet;

    const slideWidthRatio = isDesktop ? 0.7 : 0.9;

    const slideWidth = viewportWidthAtFinalZ * slideWidthRatio;

    // Convert a fixed 15px gap into world units.
    const gapInPixels = 15;
    const gap = (gapInPixels * viewportWidthAtFinalZ) / size.width;

    const totalSlideWidth = slideWidth + gap;

    let slideHeight;
    if (isMobile) {
      slideHeight = slideWidth * (3 / 2); // Portrait 2:3 for mobile
    } else if (isTablet) {
      slideHeight = slideWidth; // Square 1:1 for tablet
    } else {
      slideHeight = slideWidth * (10 / 16); // Widescreen 16:9 for desktop
    }

    const totalTrackWidth = imagesLength * totalSlideWidth;

    onLayoutCalculated({
      slideWidth,
      totalSlideWidth,
      slideHeight,
      totalTrackWidth,
    });
  }, [camera, size.width, size.height, imagesLength, onLayoutCalculated]);

  return null;
};

export default LayoutCalculator;
