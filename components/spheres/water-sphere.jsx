import React, { useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial, useEnvironment } from "@react-three/drei";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/glsl/water-shaders.ts";

const WaterMaterial = shaderMaterial(
  {
    u_time: 0,
    u_resolution: new THREE.Vector2(),
    u_envMap: null,
    u_cameraPosition: new THREE.Vector3(),
    u_cameraMatrix: new THREE.Matrix4(),
    u_inverseProjectionMatrix: new THREE.Matrix4(),
  },
  vertexShader,
  fragmentShader
);

extend({ WaterMaterial });

export const WaterSphere = () => {
  const materialRef = useRef(null);
  const { size, camera } = useThree();
  const envMap = useEnvironment({ preset: "studio" });

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.u_time = state.clock.getElapsedTime();
      materialRef.current.u_resolution.set(
        size.width * state.viewport.dpr,
        size.height * state.viewport.dpr
      );

      materialRef.current.u_cameraPosition.copy(camera.position);
      materialRef.current.u_cameraMatrix.copy(camera.matrixWorld);
      materialRef.current.u_inverseProjectionMatrix.copy(
        camera.projectionMatrixInverse
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <waterMaterial
        ref={materialRef}
        key={WaterMaterial.key}
        u_envMap={envMap}
      />
    </mesh>
  );
};
