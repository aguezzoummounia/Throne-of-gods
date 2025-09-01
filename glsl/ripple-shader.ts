export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
uniform float uImageAspect;
uniform float uPlaneAspect;
uniform vec2 uMouse;        // NEW: mouse in plane UV coords (0..1)
varying vec2 vUv;

const float SPEED = 0.4;
const float WAVE_WIDTH = 0.15;
const float AMPLITUDE = 0.021;

void main() {
  // --- Aspect Ratio Correction ('contain' with padding) ---
  float ratio = uImageAspect / uPlaneAspect;

  vec2 scale = vec2(1.0, 1.0);
  if (ratio > 1.0) {
      // Image is TALLER than plane. Fit width, letterbox.
      scale.y = 1.0 / ratio;
  } else {
      // Image is WIDER than plane. Fit height, pillarbox.
      scale.x = ratio;
  }
  
  // Add padding by scaling the image down slightly
  const float PADDING = 0.98; // Creates a 1% border on each side
  scale *= PADDING;

  // Recalculate offset to center the new, smaller image
  vec2 offset = (vec2(1.0, 1.0) - scale) / 2.0;

  // Calculate the UV for texture sampling
  vec2 textureUv = (vUv - offset) / scale;
  // --- End of Correction ---

  // If the calculated UV is outside the [0,1] range, it's in the padded area.
  // Make it transparent and stop further calculations.
  if (textureUv.x < 0.0 || textureUv.x > 1.0 || textureUv.y < 0.0 || textureUv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
  }

  // --- Transform mouse into texture UV space (same transform as textureUv) ---
  vec2 mouseTex = (uMouse - offset) / scale;
  // If mouse is outside the visible image area, fallback to image center
  bool mouseInImage = (mouseTex.x >= 0.0 && mouseTex.x <= 1.0 && mouseTex.y >= 0.0 && mouseTex.y <= 1.0);
  vec2 rippleCenter = mouseInImage ? mouseTex : vec2(0.5, 0.5);

  // --- Ripple Calculation (now relative to rippleCenter in texture space) ---
  vec2 p = textureUv - rippleCenter; // displacement from ripple origin (texture-space)
  float len = length(p); // distance in texture-space

  float ripplePosition = uTime * SPEED;
  float distFromRipple = abs(len - ripplePosition);
  float wave = smoothstep(WAVE_WIDTH, 0.0, distFromRipple);

  float timeMask = smoothstep(0.0, 1.0, uTime) * (1.0 - smoothstep(2.0, 3.5, uTime));
  wave *= timeMask;

  // Protect against zero-length (center exact hit) to avoid NaNs on normalize()
  if (len == 0.0) {
    gl_FragColor = texture2D(uTexture, textureUv);
    return;
  }
  
  // Calculate distortion vector (radially outwards) in texture-space
  vec2 direction = normalize(p);
  // Apply distortion to the texture's UVs
  vec2 distortedUv = textureUv + direction * wave * AMPLITUDE;
  
  vec4 color = texture2D(uTexture, distortedUv);

  gl_FragColor = color;
}
`;

// export const fragmentShader = `
//   uniform sampler2D uTexture;
//   uniform float uTime;
//   uniform float uImageAspect;
//   uniform float uPlaneAspect;
//   varying vec2 vUv;

//   const float SPEED = 0.4;
//   const float WAVE_WIDTH = 0.15;
//   const float AMPLITUDE = 0.021;

//   void main() {
//     // --- Aspect Ratio Correction ('contain' with padding) ---
//     float ratio = uImageAspect / uPlaneAspect;

//     vec2 scale = vec2(1.0, 1.0);
//     if (ratio > 1.0) {
//         // Image is TALLER than plane. Fit width, letterbox.
//         scale.y = 1.0 / ratio;
//     } else {
//         // Image is WIDER than plane. Fit height, pillarbox.
//         scale.x = ratio;
//     }

//     // Add padding by scaling the image down slightly
//     const float PADDING = 0.98; // Creates a 1% border on each side
//     scale *= PADDING;

//     // Recalculate offset to center the new, smaller image
//     vec2 offset = (vec2(1.0, 1.0) - scale) / 2.0;

//     // Calculate the UV for texture sampling
//     vec2 textureUv = (vUv - offset) / scale;
//     // --- End of Correction ---

//     // If the calculated UV is outside the [0,1] range, it's in the padded area.
//     // Make it transparent and stop further calculations.
//     if (textureUv.x < 0.0 || textureUv.x > 1.0 || textureUv.y < 0.0 || textureUv.y > 1.0) {
//         gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
//         return;
//     }

//     // --- Ripple Calculation ---
//     // The ripple effect is calculated based on the plane's UVs (vUv),
//     // so the wave travels across the entire square frame.
//     vec2 p = vUv - 0.5; // Center coordinates to (0,0)
//     float len = length(p); // Distance of the pixel from the center

//     float ripplePosition = uTime * SPEED;
//     float distFromRipple = abs(len - ripplePosition);
//     float wave = smoothstep(WAVE_WIDTH, 0.0, distFromRipple);

//     float timeMask = smoothstep(0.0, 1.0, uTime) * (1.0 - smoothstep(2.0, 3.5, uTime));
//     wave *= timeMask;

//     if (len == 0.0) {
//       gl_FragColor = texture2D(uTexture, textureUv);
//       return;
//     }

//     // Calculate distortion vector (radially outwards)
//     vec2 direction = normalize(p);
//     // Apply distortion to the texture's UVs
//     vec2 distortedUv = textureUv + direction * wave * AMPLITUDE;

//     vec4 color = texture2D(uTexture, distortedUv);

//     gl_FragColor = color;
//   }
// `;
