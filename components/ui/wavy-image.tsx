"use client";
// import React, { useRef, useEffect, useCallback } from "react";
// import * as THREE from "three";

// // Vertex shader for a flag-like wave effect
// const vertexShader = `
//   uniform float u_time;
//   uniform float u_amplitude;
//   uniform float u_frequency;
//   varying vec2 v_uv;

//   void main() {
//     v_uv = uv;
//     vec3 pos = position;

//     // Wave direction: from Top-Right to Bottom-Left
//     vec2 dir = normalize(vec2(-1.0, -1.0));
//     float dist = dot(pos.xy, dir);

//     // A primary wave travelling along the main direction
//     float wave = sin(dist * u_frequency - u_time * 1.5) * u_amplitude;

//     // Add a secondary, slower wave perpendicular to the first for complexity
//     vec2 perp_dir = vec2(-dir.y, dir.x);
//     float perp_dist = dot(pos.xy, perp_dir);
//     wave += cos(perp_dist * u_frequency * 0.75 + u_time * 0.5) * u_amplitude * 0.5;

//     pos.z += wave;

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//   }
// `;

// // Fragment shader for texture with a chromatic aberration effect and soft edges
// const fragmentShader = `
//   uniform sampler2D u_texture;
//   uniform float u_aberration_strength;
//   uniform vec2 u_mouse;
//   uniform float u_mouse_intensity;
//   varying vec2 v_uv;

//   void main() {
//     // --- 1. Mouse Interaction Distortion ---
//     vec2 from_mouse = v_uv - u_mouse;
//     float dist_to_mouse = length(from_mouse);

//     // Create a radial "push" effect away from the mouse cursor.
//     // The effect is strongest at the center of the cursor and fades out.
//     float falloff = smoothstep(0.15, 0.0, dist_to_mouse); // Radius of effect is 0.15
//     vec2 push_dir = normalize(from_mouse);
//     float push_amount = falloff * u_mouse_intensity * 0.05; // Control max strength of the push

//     // The new UV coordinate after distortion from the mouse trail
//     vec2 distorted_uv = v_uv + push_dir * push_amount;

//     // --- 2. Chromatic Aberration ---
//     // This now uses the distorted UVs to make the effects compound.
//     vec2 offset_dir = distorted_uv - 0.5;
//     float aberration_amount = length(offset_dir) * u_aberration_strength;

//     vec2 uv_r = distorted_uv + offset_dir * aberration_amount;
//     vec2 uv_b = distorted_uv - offset_dir * aberration_amount;

//     float r = texture2D(u_texture, uv_r).r;
//     float g = texture2D(u_texture, distorted_uv).g; // Green is our "true" distorted position
//     float b = texture2D(u_texture, uv_b).b;

//     vec3 final_color = vec3(r, g, b);

//     // --- 3. Edge Alpha Fade ---
//     // This uses the original v_uv to keep the frame of the image stable.
//     vec2 dist_from_center = abs(v_uv - 0.5);
//     float dist = max(dist_from_center.x, dist_from_center.y);
//     float alpha = 1.0 - smoothstep(0.478, 0.5, dist);

//     // Final output
//     gl_FragColor = vec4(final_color, alpha);
//   }
// `;

interface WavyImageProps {
  imageUrl: string;
}

// const WavyImage: React.FC<WavyImageProps> = ({ imageUrl }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const initAndAnimate = useCallback(
//     (canvas: HTMLCanvasElement, texture: THREE.Texture) => {
//       // Scene setup
//       const scene = new THREE.Scene();
//       const clock = new THREE.Clock();

//       // Mouse interaction state
//       const mousePosition = new THREE.Vector2(0.5, 0.5);
//       const targetIntensity = { value: 0.0 }; // Use object for reference persistence

//       // Camera - Positioned to perfectly frame the 16x9 plane
//       const camera = new THREE.PerspectiveCamera(
//         50,
//         canvas.clientWidth / canvas.clientHeight,
//         0.1,
//         100
//       );
//       camera.position.z = 10;

//       // Geometry with 16/9 aspect ratio
//       const geometry = new THREE.PlaneGeometry(16, 9, 128, 128);

//       // Material with custom shaders
//       const material = new THREE.ShaderMaterial({
//         uniforms: {
//           u_time: { value: 0 },
//           u_amplitude: { value: 0.32 },
//           u_frequency: { value: 0.7 },
//           u_texture: { value: texture },
//           u_aberration_strength: { value: 0.03 },
//           u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
//           u_mouse_intensity: { value: 0.0 },
//         },
//         vertexShader,
//         fragmentShader,
//         transparent: true, // Enable transparency for the alpha effects
//       });

//       const mesh = new THREE.Mesh(geometry, material);
//       scene.add(mesh);

//       // Renderer
//       const renderer = new THREE.WebGLRenderer({
//         canvas,
//         antialias: true,
//         alpha: true,
//       });
//       renderer.setSize(canvas.clientWidth, canvas.clientHeight);
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//       // Handle mouse events
//       const handleMouseMove = (event: MouseEvent) => {
//         const rect = renderer.domElement.getBoundingClientRect();
//         mousePosition.x = (event.clientX - rect.left) / rect.width;
//         mousePosition.y = 1.0 - (event.clientY - rect.top) / rect.height; // Flip Y for shader coords
//         targetIntensity.value = 1.0;
//       };
//       const handleMouseLeave = () => {
//         targetIntensity.value = 0.0;
//       };
//       renderer.domElement.addEventListener("mousemove", handleMouseMove);
//       renderer.domElement.addEventListener("mouseleave", handleMouseLeave);

//       // Handle window resizing
//       const handleResize = () => {
//         const parent = renderer.domElement.parentElement;
//         if (!parent) return;

//         const width = parent.clientWidth;
//         const height = parent.clientHeight;

//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();

//         renderer.setSize(width, height);
//         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//       };
//       window.addEventListener("resize", handleResize);
//       handleResize(); // Initial call

//       // Animation loop
//       let animationFrameId: number;
//       const animate = () => {
//         const elapsedTime = clock.getElapsedTime();

//         material.uniforms.u_time.value = elapsedTime;

//         // Smoothly update mouse position (lerp) for the trail effect
//         material.uniforms.u_mouse.value.lerp(mousePosition, 0.07);

//         // Smoothly update intensity for fade-in/out effect
//         const currentIntensity = material.uniforms.u_mouse_intensity.value;
//         const newIntensity =
//           currentIntensity + (targetIntensity.value - currentIntensity) * 0.1;
//         material.uniforms.u_mouse_intensity.value = newIntensity;

//         renderer.render(scene, camera);
//         animationFrameId = requestAnimationFrame(animate);
//       };
//       animate();

//       // Cleanup function
//       return () => {
//         window.removeEventListener("resize", handleResize);
//         renderer.domElement.removeEventListener("mousemove", handleMouseMove);
//         renderer.domElement.removeEventListener("mouseleave", handleMouseLeave);
//         cancelAnimationFrame(animationFrameId);
//         geometry.dispose();
//         material.dispose();
//         texture.dispose();
//         renderer.dispose();
//       };
//     },
//     []
//   );

//   useEffect(() => {
//     let cleanup: () => void;
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const textureLoader = new THREE.TextureLoader();

//       const renderer = new THREE.WebGLRenderer({ canvas });
//       renderer.setClearColor(0x111827, 0);
//       renderer.render(new THREE.Scene(), new THREE.Camera());

//       textureLoader.load(imageUrl, (texture) => {
//         cleanup = initAndAnimate(canvas, texture);
//       });
//     }

//     return () => {
//       if (cleanup) {
//         cleanup();
//       }
//     };
//   }, [imageUrl, initAndAnimate]);

//   return <canvas ref={canvasRef} className="w-full h-full" />;
// };

// export default WavyImage;

import * as THREE from "three";
import { useRef, useEffect, useCallback } from "react";

// Vertex shader for a flag-like wave effect + a mouse-driven ripple
const vertexShader = `
  uniform float u_time;
  uniform float u_amplitude;
  uniform float u_frequency;
  uniform vec2 u_mouse;
  uniform float u_mouse_intensity;
  varying vec2 v_uv;

  void main() {
    v_uv = uv;
    vec3 pos = position;

    // --- 1. Main Flag-like Wave ---
    vec2 dir = normalize(vec2(-1.0, -1.0));
    float dist = dot(pos.xy, dir);
    float wave = sin(dist * u_frequency - u_time * 1.5) * u_amplitude;
    vec2 perp_dir = vec2(-dir.y, dir.x);
    float perp_dist = dot(pos.xy, perp_dir);
    wave += cos(perp_dist * u_frequency * 0.75 + u_time * 0.5) * u_amplitude * 0.5;
    pos.z += wave;

    // --- 2. Mouse-driven Ripple Effect ---
    if (u_mouse_intensity > 0.01) {
      float dist_to_mouse = distance(uv, u_mouse);
      float ripple_freq = 25.0;
      float ripple_speed = 2.0;
      float ripple_wave = cos(dist_to_mouse * ripple_freq - u_time * ripple_speed);
      float ripple_falloff = 1.0 - smoothstep(0.0, 0.3, dist_to_mouse);
      float ripple_strength = 0.4;
      float ripple_effect = ripple_wave * ripple_falloff * u_mouse_intensity * ripple_strength;
      pos.z += ripple_effect;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader for texture with a chromatic aberration effect and soft edges
const fragmentShader = `
  uniform sampler2D u_texture;
  uniform float u_aberration_strength;
  varying vec2 v_uv;

  void main() {
    // --- 1. Chromatic Aberration ---
    vec2 offset_dir = v_uv - 0.5;
    float aberration_amount = length(offset_dir) * u_aberration_strength;

    vec2 uv_r = v_uv + offset_dir * aberration_amount;
    vec2 uv_b = v_uv - offset_dir * aberration_amount;

    float r = texture2D(u_texture, uv_r).r;
    float g = texture2D(u_texture, v_uv).g;
    float b = texture2D(u_texture, uv_b).b;

    vec3 final_color = vec3(r, g, b);

    // --- 2. Edge Alpha Fade ---
    vec2 dist_from_center = abs(v_uv - 0.5);
    float dist = max(dist_from_center.x, dist_from_center.y);
    float alpha = 1.0 - smoothstep(0.478, 0.5, dist);

    // Final output
    gl_FragColor = vec4(final_color, alpha);
  }
`;

interface WavyImageProps {
  imageUrl: string;
}

const WavyImage: React.FC<WavyImageProps> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initAndAnimate = useCallback(
    (canvas: HTMLCanvasElement, texture: THREE.Texture) => {
      const scene = new THREE.Scene();
      const clock = new THREE.Clock();

      // Separate mouse vectors for different effects
      const globalMouse = new THREE.Vector2(0, 0); // For global tilt, normalized to [-0.5, 0.5]
      const localMouse = new THREE.Vector2(0.5, 0.5); // For local ripple on canvas
      const targetIntensity = { value: 0.0 }; // For ripple fade effect
      let isVisible = false; // Controlled by IntersectionObserver

      const camera = new THREE.PerspectiveCamera(
        50,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        100
      );
      camera.position.z = 10;

      const geometry = new THREE.PlaneGeometry(16, 9, 128, 128);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_amplitude: { value: 0.32 },
          u_frequency: { value: 0.7 },
          u_texture: { value: texture },
          u_aberration_strength: { value: 0.03 },
          u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
          u_mouse_intensity: { value: 0.0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // --- Event Handlers ---
      const handleGlobalMouseMove = (event: MouseEvent) => {
        globalMouse.x = event.clientX / window.innerWidth - 0.5;
        globalMouse.y = event.clientY / window.innerHeight - 0.5;
      };

      const handleLocalMouseMove = (event: MouseEvent) => {
        targetIntensity.value = 1.0;
        const rect = renderer.domElement.getBoundingClientRect();
        localMouse.x = (event.clientX - rect.left) / rect.width;
        localMouse.y = 1.0 - (event.clientY - rect.top) / rect.height;
      };

      const handleMouseLeave = () => {
        targetIntensity.value = 0.0;
      };

      const handleResize = () => {
        const parent = renderer.domElement.parentElement;
        if (!parent) return;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      // --- Animation Loop ---
      let animationFrameId: number;
      const animate = () => {
        if (!isVisible) return; // Stop the loop if the element is not visible
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        material.uniforms.u_time.value = elapsedTime;

        // Ripple effect logic (local to canvas)
        material.uniforms.u_mouse.value.copy(localMouse);
        const currentIntensity = material.uniforms.u_mouse_intensity.value;
        const newIntensity =
          currentIntensity + (targetIntensity.value - currentIntensity) * 0.05;
        material.uniforms.u_mouse_intensity.value = newIntensity;

        // 3D Tilt Effect (responds to global mouse position)
        const targetRotationX = globalMouse.y * -0.375; // Tilt up/down (Intensity reduced by 25%)
        const targetRotationY = globalMouse.x * 0.375; // Tilt left/right (Intensity reduced by 25%)
        mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
        mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;

        renderer.render(scene, camera);
      };

      // --- Intersection Observer for performance ---
      const observer = new IntersectionObserver(
        ([entry]) => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          // If it just became visible and wasn't before, start the animation loop.
          if (!wasVisible && isVisible) {
            animate();
          }
        },
        { threshold: 0.0 } // Trigger if even one pixel is visible
      );

      // Initial setup
      handleResize();
      observer.observe(canvas);
      window.addEventListener("resize", handleResize);
      window.addEventListener("mousemove", handleGlobalMouseMove);
      renderer.domElement.addEventListener("mousemove", handleLocalMouseMove);
      renderer.domElement.addEventListener("mouseleave", handleMouseLeave);

      // Cleanup function
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        renderer.domElement.removeEventListener(
          "mousemove",
          handleLocalMouseMove
        );
        renderer.domElement.removeEventListener("mouseleave", handleMouseLeave);
        cancelAnimationFrame(animationFrameId);
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
      };
    },
    []
  );

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const canvas = canvasRef.current;
    if (canvas) {
      const textureLoader = new THREE.TextureLoader();
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.render(new THREE.Scene(), new THREE.Camera());

      textureLoader.load(
        imageUrl,
        (texture) => {
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          cleanup = initAndAnimate(canvas, texture);
        },
        undefined,
        (err) => {
          console.error("An error occurred loading the texture:", err);
        }
      );
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [imageUrl, initAndAnimate]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default WavyImage;
