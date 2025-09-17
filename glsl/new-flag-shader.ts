export const vertexShader = `
  precision highp float;
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uWaveAmplitude;
  uniform float uIndex;
  varying vec2 vUv;
  varying float vWave;
  varying float vFogDepth;
  void main() {
      vUv = uv;
      vec3 pos = position;
      float wavePhase = (uv.x + uv.y) * 8.0 + uTime * 2.0 + uIndex * 0.7;
      float primaryWave = sin(wavePhase) * uWaveAmplitude;
      float secondaryWave = sin(wavePhase * 2.5 + uIndex) * (uWaveAmplitude * 0.4);
      float tertiaryWave = sin(wavePhase * 4.0 - uTime * 2.0) * (uWaveAmplitude * 0.2);
      float amplitudeFalloff = (1.0 - (uv.x + uv.y) * 0.5) * 0.15 + 0.35;
      float combinedWave = (primaryWave + secondaryWave + tertiaryWave) * amplitudeFalloff;
      pos.z += combinedWave;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vWave = combinedWave;
      vFogDepth = -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = `
  precision highp float;

  // Uniforms from JavaScript
  uniform sampler2D tMap;
  uniform vec2 uImageSizes;
  uniform vec2 uPlaneSizes;
  uniform vec3 uFogColor;
  uniform float uFogFar;
  uniform float uFogNear;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;
  uniform vec2 uMouseVelocity;

  // Varyings from Vertex Shader
  varying vec2 vUv;
  varying float vWave;
  varying float vFogDepth;

  // --- Helper Functions ---
  float fresnel(vec3 viewDirection, vec3 normal, float power) {
      return pow(1.0 - abs(dot(viewDirection, normal)), power);
  }

  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
  }

  float smoothNoise(vec2 st) {
      return noise(st);
  }
  
  // --- Distortion Functions ---
  vec2 createRipple(vec2 uv, vec2 center, float time, float intensity) {
      vec2 diff = uv - center;
      float dist = length(diff);
      float ripple1 = sin(dist * 3.0 - time * 8.0) * exp(-dist * 0.6);
      float ripple2 = sin(dist * 5.0 - time * 12.0) * exp(-dist * 1.0);
      float combinedRipple = (ripple1 + ripple2 * 0.5) * intensity;
      vec2 direction = dist > 0.0 ? normalize(diff) : vec2(0.0);
      return direction * combinedRipple * 0.2;
  }

  vec2 createFluidDistortion(vec2 uv, vec2 mousePos, float time, float influence) {
      vec2 diff = uv - mousePos;
      float dist = length(diff);
      float falloff = 1.0 - smoothstep(0.0, 0.3, dist);
      float angle = atan(diff.y, diff.x);
      float swirl = sin(angle * 3.0 + time * 2.0) * falloff;
      float radial = sin(dist * 20.0 - time * 6.0) * falloff;
      vec2 distortion = vec2(cos(angle + swirl) * radial, sin(angle + swirl) * radial) * influence * 0.03;
      return distortion;
  }

  vec2 createVelocityDistortion(vec2 uv, vec2 mousePos, vec2 velocity, float influence) {
      vec2 diff = uv - mousePos;
      float dist = length(diff);
      float velocityMag = length(velocity);
      float falloff = 1.0 - smoothstep(0.0, 0.4, dist);
      vec2 velocityDir = velocityMag > 0.001 ? normalize(velocity) : vec2(0.0);
      float wave = sin(dot(diff, velocityDir) * 10.0 - uTime * 8.0) * falloff;
      return velocityDir * wave * velocityMag * influence * 0.02;
  }

  void main() {
      // 1. Correct the Aspect Ratio of the Texture
      vec2 ratio = vec2(
          min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
          min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
      );
      vec2 correctedUv = vec2(
          vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );

      // 2. Calculate Mouse Distortion
      float influence = uMouseInfluence;
      vec2 mouseUV = uMouse;
      
      vec2 rippleDistortion = createRipple(vUv, mouseUV, uTime, influence);
      vec2 fluidDistortion = createFluidDistortion(vUv, mouseUV, uTime, influence);
      vec2 velocityDistortion = createVelocityDistortion(vUv, mouseUV, uMouseVelocity, influence);
      vec2 globalWave = vec2(
          smoothNoise(vUv * 3.0 + uTime * 0.1) * 0.004,
          smoothNoise(vUv * 3.0 + vec2(100.0) + uTime * 0.1) * 0.004
      ) * influence;
      
      vec2 totalDistortion = rippleDistortion + fluidDistortion + velocityDistortion + globalWave;
      
      // 3. Apply Distortion and Sample Color (with Chromatic Aberration)
      vec2 finalUv = clamp(correctedUv + totalDistortion, 0.0, 1.0);
      vec3 finalColor;
      if (influence > 0.1) {
          float aberrationStrength = influence * 0.01;
          float r = texture2D(tMap, finalUv + vec2(aberrationStrength, 0.0)).r;
          float g = texture2D(tMap, finalUv).g;
          float b = texture2D(tMap, finalUv - vec2(aberrationStrength, 0.0)).b;
          finalColor = vec3(r, g, b);
      } else {
          finalColor = texture2D(tMap, finalUv).rgb;
      }
      vec4 color = vec4(finalColor, 1.0);

      // 4. Edge Effects (Rounded Corners & All-Side Fade)
      float cornerFade = 1.0 - (pow(abs(vUv.x - 0.5) * 2.0, 12.0) + pow(abs(vUv.y - 0.5) * 2.0, 12.0));
      color.a *= smoothstep(0.0, 0.2, cornerFade);

      float fadeWidth = 0.125;
      float horizontalFade = smoothstep(0.0, fadeWidth, vUv.x) * smoothstep(1.0, 1.0 - fadeWidth, vUv.x);
      float verticalFade = smoothstep(0.0, fadeWidth, vUv.y) * smoothstep(1.0, 1.0 - fadeWidth, vUv.y);
      color.a *= horizontalFade * verticalFade;

      // 5. Calculate lighting and reflection from vertex shader wave
      vec3 normal = normalize(vec3(vWave * 0.2, vWave * 0.2, 1.0));
      vec3 viewDirection = normalize(vec3(0.0, 0.0, 1.0));
      float fresnelFactor = fresnel(viewDirection, normal, 3.0) * 0.15;
      float lightIntensity = 1.0 + vWave * 2.0;
      color.rgb *= lightIntensity;
      color.rgb += fresnelFactor;

      // 6. Add subtle glow around cursor
      float dist = length(vUv - mouseUV);
      float glow = 1.0 - smoothstep(0.0, 0.2, dist);
      color.rgb += glow * influence * 0.15;

      // 7. Apply Fog
      float fogFactor = smoothstep(uFogNear, uFogFar, vFogDepth);
      color.rgb = mix(color.rgb, uFogColor, fogFactor);

      gl_FragColor = color;
  }
`;

export const particleVertexShader = `
  uniform float uTime;
  attribute float aFactor;

  void main() {
    vec3 pos = position;
    
    // Animate position on the GPU based on time and a random factor
    pos.x += cos(uTime * aFactor * 0.4 + position.y) * 0.8;
    pos.y += sin(uTime * aFactor * 0.6 + position.z) * 0.8;
    pos.z += sin(uTime * aFactor * 0.8 + position.x) * 0.8;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Make particles smaller as they appear further away
    gl_PointSize = (15.0 / -mvPosition.z) * aFactor; 
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFragmentShader = `
  uniform sampler2D tMap;

  void main() {
    // Shape the point into a circle and apply the texture
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    
    vec4 color = texture2D(tMap, gl_PointCoord);
    gl_FragColor = color;
  }
`;
