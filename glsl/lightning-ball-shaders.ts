export const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  // Transform the normal to view space
  vNormal = normalize(normalMatrix * normal);
  // Get the vertex position in view space
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  vPosition = modelViewPosition.xyz;

  gl_Position = projectionMatrix * modelViewPosition;
}
`;

export const fragmentShader = `
uniform float u_time;
uniform float u_intensity;
uniform vec3 u_color_core;
uniform vec3 u_color_edge;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// 2D simplex noise function, for organic-looking patterns
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// Fractional Brownian Motion (FBM) - layering noise for more detail
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
        value += amplitude * snoise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    // --- 1. Core Gradient & Fresnel Effect ---
    // Calculate direction from fragment to camera
    vec3 viewDirection = normalize(-vPosition);
    // Dot product gives us a gradient from center (1) to edge (0)
    float facingRatio = dot(viewDirection, vNormal);
    
    // Create a smooth falloff for the core brightness
    float coreFalloff = smoothstep(0.4, 1.0, facingRatio);
    // Create the Fresnel effect for a bright rim light
    float fresnelGlow = pow(max(0.0, 1.0 - facingRatio), 3.5);

    // Mix colors based on the core falloff
    vec3 baseColor = mix(u_color_edge, u_color_core, coreFalloff);

    // --- 2. Animated Plasma Noise (Internal Energy) ---
    // Two layers of moving noise for a turbulent plasma effect
    vec2 noiseUV1 = vUv * 3.0 + vec2(u_time * 0.1, u_time * -0.05);
    float plasmaNoise1 = fbm(noiseUV1);
    plasmaNoise1 = smoothstep(0.4, 0.6, plasmaNoise1);

    vec2 noiseUV2 = vUv * 5.0 - vec2(u_time * 0.08, u_time * 0.12);
    float plasmaNoise2 = fbm(noiseUV2);
    
    vec3 plasmaColor = vec3(plasmaNoise1 * 0.5 + plasmaNoise2 * 0.3);

    // --- 3. Randomized Bright Spots (Energy Bursts) ---
    // High-frequency noise, sharpened to create small, intense spots
    vec2 spotUV = vUv * 15.0 + u_time * 0.3;
    float spots = snoise(spotUV);
    spots = pow(max(0.0, spots), 15.0); // Sharpen the peaks of the noise
    spots = smoothstep(0.4, 0.6, spots);
    vec3 spotColor = vec3(spots) * vec3(1.0, 1.0, 1.5); // Slightly bluer spots

    // --- 4. Radiating Light Streaks ---
    // Warp UV coordinates based on other noise patterns to create streaks
    vec2 streakUV = vUv;
    streakUV.x += snoise(vec2(vUv.y * 10.0, u_time * 0.2)) * 0.05;
    streakUV.y += snoise(vec2(vUv.x * 10.0, u_time * 0.2)) * 0.05;
    
    // Use non-uniform scaling on the warped UVs to stretch the noise
    float streaks = fbm(streakUV * vec2(8.0, 2.0) + u_time * 0.4);
    streaks = pow(max(0.0, streaks), 4.0) * 0.5;
    vec3 streakColor = vec3(streaks) * vec3(0.8, 0.9, 1.0);

    // --- 5. Combine All Layers ---
    vec3 finalColor = baseColor;
    finalColor += plasmaColor;
    finalColor += streakColor;
    finalColor += spotColor;
    // Add the Fresnel rim light, colored by the edge color
    finalColor += fresnelGlow * u_color_edge * 1.5;

    // Apply overall intensity and output the final color
    gl_FragColor = vec4(finalColor * u_intensity, 1.0);
}
`;
