import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  particleVertexShader,
  particleFragmentShader,
} from "@/glsl/new-flag-shader";

// const Particles = ({ count = 5000, size = 50, parallaxPos }) => {
//   const pointsRef = useRef(null);
//   const shaderRef = useRef(null);

//   const texture = useMemo(() => {
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     const size = 64;
//     canvas.width = size;
//     canvas.height = size;
//     if (context) {
//       const gradient = context.createRadialGradient(
//         size / 2,
//         size / 2,
//         0,
//         size / 2,
//         size / 2,
//         size / 2
//       );
//       gradient.addColorStop(0, "rgba(255,255,255,1)");
//       gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
//       gradient.addColorStop(0.4, "rgba(255,255,255,0.2)");
//       gradient.addColorStop(1, "rgba(255,255,255,0)");
//       context.fillStyle = gradient;
//       context.fillRect(0, 0, size, size);
//     }
//     return new THREE.CanvasTexture(canvas);
//   }, []);

//   const { positions, factors } = useMemo(() => {
//     const pos = new Float32Array(count * 3);
//     const fac = new Float32Array(count);
//     for (let i = 0; i < count; i++) {
//       pos[i * 3 + 0] = (Math.random() - 0.5) * size;
//       pos[i * 3 + 1] = (Math.random() - 0.5) * size;
//       pos[i * 3 + 2] = (Math.random() - 0.5) * size - 5;
//       fac[i] = 0.5 + Math.random() * 0.5;
//     }
//     return { positions: pos, factors: fac };
//   }, [count, size]);

//   const uniforms = useMemo(
//     () => ({
//       uTime: { value: 0 },
//       tMap: { value: texture },
//     }),
//     [texture]
//   );

//   useFrame(({ clock }, delta) => {
//     if (shaderRef.current) {
//       shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
//     }

//     // Apply parallax effect based on mouse position
//     if (parallaxPos.current) {
//       const parallaxIntensity = 0.4;
//       pointsRef.current.rotation.y = THREE.MathUtils.damp(
//         pointsRef.current.rotation.y,
//         -parallaxPos.current.x * parallaxIntensity,
//         4,
//         delta
//       );
//       pointsRef.current.rotation.x = THREE.MathUtils.damp(
//         pointsRef.current.rotation.x,
//         parallaxPos.current.y * parallaxIntensity,
//         4,
//         delta
//       );
//     }
//   });

//   return (
//     <points ref={pointsRef}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={count}
//           array={positions}
//           itemSize={3}
//         />
//         <bufferAttribute
//           attach="attributes-aFactor"
//           count={count}
//           array={factors}
//           itemSize={1}
//         />
//       </bufferGeometry>
//       <shaderMaterial
//         ref={shaderRef}
//         vertexShader={particleVertexShader}
//         fragmentShader={particleFragmentShader}
//         uniforms={uniforms}
//         transparent
//         blending={THREE.AdditiveBlending}
//         depthWrite={false}
//       />
//     </points>
//   );
// };

const Particles = ({
  count = 5000,
  size = 50,
  parallaxPos,
  globalScrollVelocity,
}) => {
  const pointsRef = useRef(null);
  const shaderRef = useRef(null);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    if (context) {
      const gradient = context.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.2)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const { positions, factors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const fac = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * size;
      pos[i * 3 + 1] = (Math.random() - 0.5) * size;
      pos[i * 3 + 2] = (Math.random() - 0.5) * size;
      fac[i] = 0.5 + Math.random() * 0.5;
    }
    return { positions: pos, factors: fac };
  }, [count, size]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      tMap: { value: texture },
      uScrollVelocity: { value: 0 },
    }),
    [texture]
  );

  useFrame(({ clock }, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uScrollVelocity.value =
        globalScrollVelocity.current;
    }

    // Apply parallax effect based on mouse position
    if (parallaxPos.current) {
      const parallaxIntensity = 0.4;
      pointsRef.current.rotation.y = THREE.MathUtils.damp(
        pointsRef.current.rotation.y,
        -parallaxPos.current.x * parallaxIntensity,
        4,
        delta
      );
      pointsRef.current.rotation.x = THREE.MathUtils.damp(
        pointsRef.current.rotation.x,
        parallaxPos.current.y * parallaxIntensity,
        4,
        delta
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aFactor"
          count={count}
          array={factors}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default Particles;
