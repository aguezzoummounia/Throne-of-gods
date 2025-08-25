export const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  vPosition = position;
  vViewPosition = -modelViewPosition.xyz;
  gl_Position = projectionMatrix * modelViewPosition;
}
`;

export const fragmentShader = `
uniform float u_time;
uniform vec3 u_color_deep;
uniform vec3 u_color_shallow;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

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

// FBM for layered noise
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
    vec3 viewDirection = normalize(vViewPosition);

    // --- 1. Ripple Patterns (Normal Perturbation) ---
    vec2 rippleUV = vUv * 4.0 + u_time * 0.2;
    float rippleNoise = snoise(rippleUV);
    vec3 perturbedNormal = normalize(vNormal + rippleNoise * 0.05);

    // --- 2. Fresnel Effect (for transparency and rim light) ---
    float fresnel = 1.0 - dot(perturbedNormal, viewDirection);
    fresnel = pow(fresnel, 2.5);

    // --- 3. Internal Fluid Motion ---
    vec2 flowUV = vPosition.xy * 2.0 - vec2(u_time * -0.1, u_time * 0.15);
    float flowNoise = fbm(flowUV);
    vec3 baseColor = mix(u_color_deep, u_color_shallow, flowNoise);

    // --- 4. Bubble Details ---
    vec2 bubbleUV = vUv * 10.0 + u_time * 0.5;
    float bubbleNoise = snoise(bubbleUV);
    bubbleNoise = pow(max(0.0, bubbleNoise), 15.0); // Sharpen to make distinct bubbles
    bubbleNoise = smoothstep(0.3, 0.5, bubbleNoise);

    // --- 5. Specular Highlight ---
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 halfVector = normalize(lightDir + viewDirection);
    float specular = pow(max(0.0, dot(perturbedNormal, halfVector)), 32.0);
    specular *= 1.5; // Make it brighter

    // --- 6. Combine Layers ---
    vec3 finalColor = baseColor;
    finalColor += bubbleNoise * 0.3;
    finalColor += fresnel * u_color_shallow * 0.8; // Rim light
    finalColor += specular; // Additive specular highlight

    // --- Final Output ---
    // Use fresnel for alpha to create a soft, glowing edge
    float alpha = fresnel * 0.8 + specular * 0.2 + bubbleNoise * 0.1;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, alpha);
}`;

export const vertexShader_1 = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const fragmentShader_1 = `
#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.001
#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;
uniform samplerCube u_envMap;

varying vec2 vUv;

// --- UTILITY FUNCTIONS ---
mat3 setCamera(vec3 ro, vec3 ta, float cr) {
	vec3 cw = normalize(ta - ro);
	vec3 cp = vec3(sin(cr), cos(cr), 0.0);
	vec3 cu = normalize(cross(cw, cp));
	vec3 cv = normalize(cross(cu, cw));
	return mat3(cu, cv, cw);
}

// --- NOISE FUNCTIONS (for displacement and mist) ---
// 3D simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

// Fractional Brownian Motion (layered noise)
float fbm(vec3 p) {
    float f = 0.0;
    float a = 0.5;
    vec3 q = p;
    for (int i = 0; i < 5; i++) {
        f += a * snoise(q);
        q *= 2.0;
        a *= 0.5;
    }
    return f;
}

// --- SIGNED DISTANCE FUNCTIONS (SDFs) ---
float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float sdPlane(vec3 p) {
    return p.y + 1.5;
}

float displacement(vec3 p) {
    return fbm(p * 2.0 + u_time * 0.5) * 0.2;
}

// --- SCENE DEFINITION ---
float getDist(vec3 p) {
    float sphereDist = sdSphere(p, 2.0) - displacement(p);
    float planeDist = sdPlane(p);
    return min(sphereDist, planeDist);
}

// --- NORMAL CALCULATION ---
vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0);
    float d = getDist(p);
    vec3 n = d - vec3(
        getDist(p - e.xyy),
        getDist(p - e.yxy),
        getDist(p - e.yyx)
    );
    return normalize(n);
}

// --- RAYMARCHING ---
float rayMarch(vec3 ro, vec3 rd, out vec3 p) {
    float dO = 0.0;
    for(int i = 0; i < MAX_STEPS; i++) {
        p = ro + rd * dO;
        float dS = getDist(p);
        dO += dS;
        if(dO > MAX_DIST || abs(dS) < SURF_DIST) break;
    }
    return dO;
}

// --- SHADING & EFFECTS ---
float getSoftShadow(vec3 p, vec3 lightPos, float k) {
    vec3 rd = normalize(lightPos - p);
    float res = 1.0;
    float t = 0.01;
    for(int i=0; i<32; i++) {
        vec3 q = p + rd * t;
        float h = getDist(q);
        if(h < SURF_DIST) return 0.0;
        res = min(res, k * h / t);
        t += h;
    }
    return res;
}

// Schlick's approximation for Fresnel
float fresnel(float cosi, float IOR) {
    float R0 = (1.0 - IOR) / (1.0 + IOR);
    R0 = R0 * R0;
    return R0 + (1.0 - R0) * pow(1.0 - cosi, 5.0);
}

// --- MAIN RENDER FUNCTION ---
vec3 render(vec3 ro, vec3 rd) {
    vec3 col = vec3(0.0);
    vec3 p;
    float t = rayMarch(ro, rd, p);

    // Volumetric Mist
    float mist = fbm(rd * 2.0 + u_time * 0.1) * 0.1;
    col += mist * 0.1;

    if (t < MAX_DIST) {
        vec3 n = getNormal(p);
        
        // --- GROUND PLANE SHADING ---
        if(sdPlane(p) < SURF_DIST) {
            vec3 lightPos = vec3(5, 5, -5);
            float shadow = getSoftShadow(p + n * 0.01, lightPos, 16.0);
            float diffuse = max(0.0, dot(n, normalize(lightPos))) * shadow;
            col = vec3(0.1) * diffuse + 0.05;
            return col;
        }

        // --- WATER SPHERE SHADING ---
        float IOR = 1.33; // Index of Refraction for water
        float cosi = max(-1.0, min(1.0, dot(rd, n)));
        
        // Reflection
        vec3 reflect_dir = reflect(rd, n);
        vec3 reflection_col = texture(u_envMap, reflect_dir).rgb;

        // Refraction
        vec3 refract_dir = refract(rd, n, 1.0 / IOR);
        
        // Raymarch from inside the sphere for volumetric color
        vec3 p_exit;
        rayMarch(p - rd * 0.01, refract_dir, p_exit);
        float dist_inside = length(p_exit - p);
        
        // Beer's Law for water color absorption
        vec3 water_color = vec3(0.1, 0.3, 0.5);
        vec3 absorption = exp(-water_color * dist_inside * 0.3);
        
        vec3 refraction_col = texture(u_envMap, refract_dir).rgb * absorption;

        // Fresnel blending
        float F = fresnel(abs(cosi), IOR);
        col = mix(refraction_col, reflection_col, F);
        
    } else {
        // Background
        col = vec3(1.0); // White background
    }

    return col;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    vec3 ro = vec3(0.0, 0.0, -5.0); // Ray origin (camera position)
    vec3 ta = vec3(0.0, 0.0, 0.0); // Target
    
    // Simple mouse rotation
    float rotX = (-0.5 + u_resolution.x / u_resolution.y * (vUv.x - 0.5)) * PI;
    float rotY = (-0.5 + (vUv.y - 0.5)) * PI * 0.5;
    
    mat3 cam = setCamera(ro, ta, 0.0);
    vec3 rd = cam * normalize(vec3(uv, 1.0)); // Ray direction

    vec3 color = render(ro, rd);

    // Simple tonemapping
    color = pow(color, vec3(0.4545));

    gl_FragColor = vec4(color, 1.0);
}`;
