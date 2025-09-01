// Fragment shader (matching)
export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uAoStrength;
  uniform vec2 uAoRange;

  varying vec2 vUv;
  varying float vDisplacement;

  void main() {
    // --- Ambient Occlusion ---
    float ao = 1.0 - smoothstep(uAoRange.x, uAoRange.y, -vDisplacement) * uAoStrength;

    // --- Edge Fade Calculation ---
    float distY = abs(vUv.y - 0.5) * 2.0;
    float distX = abs(vUv.x - 0.5) * 2.0;
    
    float power = 8.0;
    float maxDist = pow(pow(distX, power) + pow(distY, power), 1.0 / power);

    float alpha = 1.0 - smoothstep(0.5, 1.0, maxDist);

    // --- Texture Sampling (no chromatic aberration) ---
    vec4 tex = texture2D(uTexture, vUv);

    // Final color with edge fade
    gl_FragColor = vec4(tex.rgb * ao, alpha);
  }
`;

// Vertex shader
export const vertexShader = `
  uniform float uTime;
  uniform vec2 uWaveFrequency;
  uniform vec2 uWaveAmplitude;
  uniform float uWaveSpeed;
  uniform float uNoiseFrequency;
  uniform float uNoiseSpeed;
  uniform float uNoiseAmplitude;
  uniform float uAnchorPower;
  uniform vec2 uMouse;
  uniform vec2 uMouseVelocity;

  varying vec2 vUv;
  varying float vDisplacement;

  // --- Perlin noise (cnoise) ---
  vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.y, Pi0.y, Pi1.y, Pi1.y);
    float iz0 = Pi0.z;
    float iz1 = Pi1.z;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = ixy + iz0;
    vec4 ixy1 = ixy + iz1;

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec3 w = (Pf0*Pf0*Pf0*(Pf0*(Pf0*6.0-15.0)+10.0));
    vec4 T = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
    g000 *= T.x; g010 *= T.y; g100 *= T.z; g110 *= T.w;
    T = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
    g001 *= T.x; g011 *= T.y; g101 *= T.z; g111 *= T.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.y, Pf0.z));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.x, Pf1.y, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.x, Pf0.y, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.y, Pf1.z));
    float n111 = dot(g111, Pf1);

    float n0 = mix(mix(n000, n100, w.x), mix(n010, n110, w.x), w.y);
    float n1 = mix(mix(n001, n101, w.x), mix(n011, n111, w.x), w.y);

    return 2.2 * mix(n0, n1, w.z);
  }

  void main() {
    vUv = uv;

    // --- Main wave displacement ---
    float waveX = sin(vUv.x * uWaveFrequency.x + uTime * uWaveSpeed) * uWaveAmplitude.x;
    float waveY = sin(vUv.y * uWaveFrequency.y + uTime * uWaveSpeed) * uWaveAmplitude.y;

    // --- Noise for turbulence ---
    float noise = cnoise(vec3(vUv * uNoiseFrequency, uTime * uNoiseSpeed)) * uNoiseAmplitude;

    // --- Combine effects ---
    float baseDisplacement = waveX + waveY + noise;

    // --- Anchor flag to the left edge (pole) ---
    float anchorFactor = pow(1.0 - vUv.x, uAnchorPower);
    float finalDisplacement = baseDisplacement * anchorFactor;

    // --- Hover "wake" effect based on velocity ---
    if (uMouse.x > 0.0) {
        vec2 toMouse = uMouse - vUv;
        float distToMouse = length(toMouse);
        
        vec2 normalizedVelocity = normalize(uMouseVelocity);
        float velocityStrength = length(uMouseVelocity);

        float wakeStrength = 18.0; 
        
        float wakeEffect = max(0.0, dot(normalizedVelocity, toMouse)) * (1.0 - smoothstep(0.0, 0.15, distToMouse));
        
        finalDisplacement += wakeEffect * velocityStrength * wakeStrength;
    }

    vDisplacement = finalDisplacement;
    
    vec3 newPosition = position + vec3(0.0, 0.0, finalDisplacement);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;
