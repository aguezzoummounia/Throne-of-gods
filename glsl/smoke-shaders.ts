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
    for (int i = 0; i < 6; i++) {
        value += amplitude * snoise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    // --- 1. Basic Sphere Shape ---
    vec3 viewDirection = normalize(-vPosition);
    float facingRatio = dot(viewDirection, vNormal);
    float sphereMask = smoothstep(0.0, 0.3, facingRatio);

    // --- 2. Swirling Smoke Texture ---
    // Two layers of animated noise for a volumetric effect
    vec2 smokeUV1 = vUv * 3.0 + vec2(u_time * 0.05, u_time * 0.03);
    float smokeNoise1 = fbm(smokeUV1);
    
    vec2 smokeUV2 = vUv * 5.0 - vec2(u_time * 0.08, u_time * -0.04);
    float smokeNoise2 = fbm(smokeUV2);
    
    // Combine noise layers and shape them with smoothstep for a billowy look
    float smokeCombined = smokeNoise1 * 0.6 + smokeNoise2 * 0.4;
    smokeCombined = smoothstep(0.4, 0.7, smokeCombined);
    
    // The smoke is dark gray and is masked by the sphere shape
    vec3 smokeColor = vec3(0.1) * smokeCombined * sphereMask;

    // --- 3. Radiating Light Beams ---
    // Get coordinates relative to the center
    vec2 center = vec2(0.5);
    vec2 toCenter = center - vUv;
    float angle = atan(toCenter.y, toCenter.x);
    float dist = length(toCenter);
    
    // Generate noise based on the angle to create beams
    float beams = snoise(vec2(angle * 20.0, u_time * 0.4));
    
    // Sharpen the noise to create distinct, bright streaks
    beams = pow(max(0.0, beams), 30.0);
    
    // Beams fade as they move away from the center and are masked by the sphere shape
    beams *= (1.0 - dist * 1.8);
    beams = max(0.0, beams) * sphereMask;

    vec3 beamColor = vec3(1.0) * beams; // Bright white beams

    // --- 4. Combine Layers ---
    vec3 finalColor = smokeColor + beamColor;
    
    // Add a very subtle fresnel effect to give the smoke a hint of an edge
    float fresnel = pow(1.0 - facingRatio, 5.0);
    finalColor += fresnel * 0.1;

    // Apply overall intensity
    gl_FragColor = vec4(finalColor * u_intensity, 1.0);
}`;
