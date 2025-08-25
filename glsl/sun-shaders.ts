export const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
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

// 2D simplex noise function
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

// Fractional Brownian Motion (FBM)
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
    // --- 1. Core Gradient & Fresnel ---
    vec3 viewDirection = normalize(-vPosition);
    float facingRatio = dot(viewDirection, vNormal);
    
    float coreFalloff = smoothstep(0.3, 1.0, facingRatio);
    float fresnelGlow = pow(max(0.0, 1.0 - facingRatio), 4.0);

    vec3 baseColor = mix(u_color_edge, u_color_core, coreFalloff);

    // --- 2. Animated Plasma Surface ---
    vec2 plasmaUV1 = vUv * 2.5 + vec2(u_time * 0.15, u_time * -0.08);
    float plasmaNoise1 = fbm(plasmaUV1);
    plasmaNoise1 = smoothstep(0.45, 0.55, plasmaNoise1);

    vec2 plasmaUV2 = vUv * 4.0 - vec2(u_time * -0.1, u_time * 0.15);
    float plasmaNoise2 = fbm(plasmaUV2);
    
    vec3 plasmaColor = vec3(plasmaNoise1 * 0.6 + plasmaNoise2 * 0.4);

    // --- 3. Shimmering Bright Spots ---
    vec2 spotUV = vUv * 20.0 - u_time * 0.2;
    float spots = snoise(spotUV);
    spots = pow(max(0.0, spots), 20.0);
    spots = smoothstep(0.5, 0.7, spots);
    vec3 spotColor = vec3(spots) * vec3(1.5, 1.4, 1.0); // Bright yellow spots

    // --- 4. Solar Flares ---
    vec2 flareUV = vUv * 1.5 + vec2(u_time * 0.05);
    float flareNoise = fbm(flareUV);
    flareNoise = pow(max(0.0, flareNoise), 8.0);
    flareNoise = smoothstep(0.6, 0.8, flareNoise) * 1.5;
    vec3 flareColor = vec3(flareNoise) * u_color_core;

    // --- 5. Radial Light Streaks ---
    vec2 center = vec2(0.5);
    vec2 toCenter = center - vUv;
    float angle = atan(toCenter.y, toCenter.x);
    float dist = length(toCenter);
    
    float streaks = snoise(vec2(angle * 5.0, u_time * 0.3));
    streaks = pow(max(0.0, streaks), 5.0);
    streaks *= (1.0 - dist * 1.5);
    streaks = max(0.0, streaks);

    vec3 streakColor = vec3(streaks) * vec3(1.2, 1.1, 0.8);

    // --- 6. Combine All Layers ---
    vec3 finalColor = baseColor;
    finalColor += plasmaColor * 0.8;
    finalColor += streakColor * 0.6;
    finalColor += spotColor * 0.7;
    finalColor += flareColor;
    finalColor += fresnelGlow * u_color_edge * 2.0;

    gl_FragColor = vec4(finalColor * u_intensity, 1.0);
}`;
