import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { vertexShader, fragmentShader } from "@/glsl/new-flag-shader";

const ImagePlane = ({
  image,
  width,
  height,
  waveAmplitude,
  index,
  scrollVelocity,
  planeSegments,
  shaderPerformance,
}) => {
  const texture = useLoader(THREE.TextureLoader, image.src);
  const shaderRef = useRef(null);

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
    const fogColor = new THREE.Color("#181c1f");

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
      uMouse: { value: mouseData.current.pos },
      uMouseVelocity: { value: mouseData.current.velocity },
      uMouseInfluence: { value: 0 },
      uPerformanceLevel: { value: shaderPerformance },
    };
  }, [texture, width, height, waveAmplitude, index, shaderPerformance]);

  useFrame(({ clock }, delta) => {
    // Only update mouse uniforms if performance level is not 'low'
    if (shaderPerformance > 0) {
      mouseData.current.pos.lerp(mouseData.current.targetPos, 0.1);
      const velocity = mouseData.current.pos
        .clone()
        .sub(mouseData.current.lastPos);
      mouseData.current.velocity.lerp(velocity, 0.15);
      mouseData.current.lastPos.copy(mouseData.current.pos);

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
        shaderRef.current.uniforms.uMouse.value.copy(mouseData.current.pos);
        shaderRef.current.uniforms.uMouseVelocity.value.copy(
          mouseData.current.velocity
        );
        shaderRef.current.uniforms.uMouseInfluence.value =
          mouseData.current.influence;
      }
    }

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uScrollVelocity.value = THREE.MathUtils.damp(
        shaderRef.current.uniforms.uScrollVelocity.value,
        scrollVelocity.current,
        4,
        delta
      );
    }
  });

  return (
    <mesh
      onPointerMove={(e) => {
        if (e.uv && shaderPerformance > 0) {
          mouseData.current.targetPos.copy(e.uv);
        }
      }}
      onPointerLeave={() => {
        if (shaderPerformance > 0) {
          mouseData.current.targetInfluence = 0;
        }
      }}
    >
      <planeGeometry args={[width, height, planeSegments, planeSegments]} />
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
export default ImagePlane;
