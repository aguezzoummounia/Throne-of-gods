"use client";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { vertexShader, fragmentShader } from "@/glsl/flag-shader";

interface WavyImageProps {
  imageUrl: string;
}

const WavyImage: React.FC<WavyImageProps> = ({ imageUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef(new THREE.Vector2(-1, -1));
  const prevMousePosition = useRef(new THREE.Vector2(-1, -1));
  const mouseVelocity = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const windStrength = 0.425;
    const parallaxFactor = 0.2125;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const aspect =
      currentMount.clientHeight > 0
        ? currentMount.clientWidth / currentMount.clientHeight
        : 1;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
    camera.position.z = 2.5;
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Flag Texture
    const textureLoader = new THREE.TextureLoader();
    const flagTexture = textureLoader.load(imageUrl, (texture) => {
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.needsUpdate = true;
    });

    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const height = 2 * Math.tan(vFOV / 2) * camera.position.z;
    const width = height * camera.aspect;

    // Flag Geometry
    let flagGeometry = new THREE.PlaneGeometry(
      width * 0.95,
      height * 0.95,
      64,
      32
    );

    // Flag Material
    const flagMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: flagTexture },
        uWaveFrequency: { value: new THREE.Vector2(4.0, 2.0) },
        uWaveAmplitude: { value: new THREE.Vector2(0.2, 0.05) },
        uWaveSpeed: { value: 1.0 },
        uNoiseFrequency: { value: 2.5 },
        uNoiseSpeed: { value: 0.2 },
        uNoiseAmplitude: { value: 0.1 },
        uAnchorPower: { value: 2.0 },
        uAoStrength: { value: 0.5 },
        uAoRange: { value: new THREE.Vector2(-0.1, 0.2) },
        uMouse: { value: new THREE.Vector2(-1, -1) },
        uMouseVelocity: { value: new THREE.Vector2(0, 0) }, // For velocity effect
      },
      side: THREE.DoubleSide,
      transparent: true,
    });

    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    scene.add(flag);

    flagMaterial.uniforms.uWaveAmplitude.value.x = 0.2 * windStrength;
    flagMaterial.uniforms.uWaveAmplitude.value.y = 0.05 * windStrength;
    flagMaterial.uniforms.uNoiseAmplitude.value = 0.1 * windStrength;
    flagMaterial.uniforms.uWaveSpeed.value = 1.0 + windStrength * 2.0;
    flagMaterial.uniforms.uNoiseSpeed.value = 0.2 + windStrength * 0.3;

    // Input tracking
    const parallaxPosition = new THREE.Vector2();

    const onPointerMove = (event: PointerEvent) => {
      const rect = currentMount.getBoundingClientRect();

      // For parallax effect
      parallaxPosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      parallaxPosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // For hover effect (UV coordinates)
      const u = (event.clientX - rect.left) / rect.width;
      const v = 1.0 - (event.clientY - rect.top) / rect.height; // Invert Y
      mousePosition.current.set(u, v);
    };

    const onPointerLeave = () => {
      parallaxPosition.x = 0;
      parallaxPosition.y = 0;
      mousePosition.current.set(-1, -1);
    };

    currentMount.addEventListener("pointermove", onPointerMove);
    currentMount.addEventListener("pointerleave", onPointerLeave);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      flagMaterial.uniforms.uTime.value = elapsedTime;

      // Calculate and update mouse velocity
      if (prevMousePosition.current.x > -0.5) {
        const delta = new THREE.Vector2().subVectors(
          mousePosition.current,
          prevMousePosition.current
        );
        // Add a scaled delta to accumulate velocity
        mouseVelocity.current.add(delta.multiplyScalar(0.5));
      }

      // Apply damping to smoothly reduce velocity over time
      mouseVelocity.current.multiplyScalar(0.93);

      prevMousePosition.current.copy(mousePosition.current);

      flagMaterial.uniforms.uMouse.value.copy(mousePosition.current);
      flagMaterial.uniforms.uMouseVelocity.value.copy(mouseVelocity.current);

      // Parallax effect for camera
      const targetX = parallaxPosition.x * parallaxFactor;
      const targetY = parallaxPosition.y * parallaxFactor;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;

      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        const vFOV = THREE.MathUtils.degToRad(camera.fov);
        const height = 2 * Math.tan(vFOV / 2) * camera.position.z;
        const width = height * camera.aspect;

        if (flag.geometry) {
          flag.geometry.dispose();
        }
        flag.geometry = new THREE.PlaneGeometry(
          width * 0.95,
          height * 0.95,
          64,
          32
        );

        renderer.setSize(newWidth, newHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      currentMount.removeEventListener("pointermove", onPointerMove);
      currentMount.removeEventListener("pointerleave", onPointerLeave);

      if (renderer.domElement.parentElement === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }

      flagGeometry.dispose();
      flagMaterial.dispose();
      flagTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default WavyImage;

// Modify the FlagScene component to apply vertex colors to the flag geometry. The colors should transition smoothly from red on the left edge (pole) to blue on the right edge, creating a color gradient across the flag. Update the shaders to sample and use these vertex colors.

// In the `FlagShaders.ts` file, reintroduce a subtle chromatic aberration effect in the fragment shader. Sample the texture using `vUv + normalizedVelocity * 0.005` for the red channel and `vUv - normalizedVelocity * 0.005` for the blue channel, modulated by the mouse velocity's length and a small constant like `0.003`.

// Ensure the flag geometry and texture aspect ratio are correctly updated on window resize, maintaining visual integrity.

// Implement a subtle motion blur effect in the vertex shader to give the flag's waving motion a more cinematic and fluid feel.

// Enhance the flag simulation by adding realistic lighting. Implement a directional light and an ambient light source to improve depth and highlight the flag's texture and waves.
