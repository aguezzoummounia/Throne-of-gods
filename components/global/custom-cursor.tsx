"use client";
import { useRef, useState, useEffect } from "react";

const CURSOR_SIZE = 64;

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform float iSpeed;
uniform vec4 iMouse;
uniform float iClickTime;
uniform vec2 iVelocity;

vec3 sphere = vec3(0, 0, 2);
float sphere_size = 1.3;

float hash( float n ) { return fract(sin(n)*753.5453123); }
float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

float raySphere(vec3 rpos, vec3 rdir, vec3 sp, float radius, inout vec3 point, inout vec3 normal) {
	radius = radius * radius;
	float dt = dot(rdir, sp - rpos);
	if (dt < 0.0) {
		return -1.0;
	}
	vec3 tmp = rpos - sp;
	tmp.x = dot(tmp, tmp);
	tmp.x = tmp.x - dt*dt;
	if (tmp.x >= radius) {
		return -1.0;
	}
	dt = dt - sqrt(radius - tmp.x);
	point = rpos + rdir * dt;
	normal = normalize(point - sp);
	return dt;
}

const mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );

void main() {
    vec3 point; 
	vec3 normal;
    vec2 uv = gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0;
	uv.x *= iResolution.x / iResolution.y;
    vec3 ray = vec3(uv.x, uv.y, 1.0);
	ray = normalize(ray);
    
    // --- Pulsing and Speed Effect on Size ---
    float sizeMultiplier = 1.0 - smoothstep(0.0, 2000.0, iSpeed) * 0.4;
    float pulse = 1.0 + sin(iTime * 2.0) * 0.02; // Gentle pulse (e.g., between 0.98 and 1.02)
    float dynamicSphereSize = sphere_size * sizeMultiplier * pulse;


    vec3 c = vec3( 0. );
    for( float i = 0.; i < 30.; i++ ) {
        float dist = raySphere(vec3(0.0), ray, sphere, dynamicSphereSize - .01 * i, point, normal);
        
        if (dist > 0.0) {
            float f = 0.;
            vec3 pos = 2. / ( .5 * i + 1. ) * point;

            // --- Spring Physics Distortion ---
            float velocityMag = length(iVelocity);
            if (velocityMag > 1.0) {
                vec2 velDir = normalize(iVelocity);
                float projection = dot(pos.xy, velDir);
                float smearAmount = smoothstep(50.0, 2000.0, velocityMag) * 0.2;
                pos.xy -= velDir * projection * smearAmount;
            }

            pos += .1 * iTime;
            
            vec3 q = 8.0*pos;
            f  = 0.5000*noise( q ); q = m*q*2.01;
            f += 0.2500*noise( q ); q = m*q*2.02;
            f += 0.1250*noise( q ); q = m*q*2.03;
            f += 0.0625*noise( q ); q = m*q*2.01;
            f *= dot( normal, vec3( 0., 0., 1. ) );
            c += vec3( f * f  );
        } 
    }
    
    // --- Particle Burst Effect on Click ---
    if (iMouse.w > 0.5) { // Mouse is down
        float timeSinceClick = iTime - iClickTime;
        float burstDuration = 0.5;

        if (timeSinceClick < burstDuration) {
            float burstProgress = timeSinceClick / burstDuration;
            
            for (float i = 0.0; i < 50.0; i++) {
                float angle = hash(i) * 6.283185;
                float speed = hash(i + 10.0) * 2.0 + 0.5;
                
                vec2 dir = vec2(cos(angle), sin(angle));
                vec2 pPos = dir * speed * burstProgress;

                float distToParticle = distance(uv, pPos);
                
                float particleSize = 0.05;
                float fade = 1.0 - smoothstep(0.0, 1.0, burstProgress);
                float particleIntensity = (1.0 - smoothstep(0.0, particleSize, distToParticle)) * fade;
                
                c += vec3(1.0, 0.8, 0.4) * particleIntensity * 2.0;
            }
        }
    }
    
    vec3 finalColor = smoothstep( 0., 1., c / 10. );
    float alpha = clamp(length(finalColor) * 1.5, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, alpha);
}
`;

const CustomCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameId = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const lastFrameTimeRef = useRef<number>(performance.now());

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  // Physics properties
  const position = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const speed = useRef(0);

  // Physics constants
  const mass = 1; // How "heavy" the cursor feels (higher = more inertia)
  const stiffness = 80; // The "springiness" pulling the cursor to the mouse
  const damping = 15; // The friction that slows the cursor down to prevent endless oscillation

  const isMouseDownRef = useRef(false);
  const clickTimeRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetPosition.current = { x: event.clientX, y: event.clientY };
    };
    const handleMouseDown = () => {
      isMouseDownRef.current = true;
      clickTimeRef.current = (Date.now() - startTimeRef.current) * 0.001;
    };
    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const initWebGL = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    glRef.current = gl;

    const vShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vShader || !fShader) return;

    const program = createProgram(gl, vShader, fShader);
    if (!program) return;
    programRef.current = program;

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  };

  const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  };

  const createProgram = (
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  };

  useEffect(() => {
    // Set initial position to the center of the screen
    position.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    targetPosition.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const renderScene = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastFrameTimeRef.current) * 0.001;
      lastFrameTimeRef.current = currentTime;

      const gl = glRef.current;
      const program = programRef.current;

      // --- Spring Physics Calculation ---
      const forceX =
        (targetPosition.current.x - position.current.x) * stiffness;
      const forceY =
        (targetPosition.current.y - position.current.y) * stiffness;
      const dampingX = -velocity.current.x * damping;
      const dampingY = -velocity.current.y * damping;
      const totalForceX = forceX + dampingX;
      const totalForceY = forceY + dampingY;
      const accelX = totalForceX / mass;
      const accelY = totalForceY / mass;

      velocity.current.x += accelX * deltaTime;
      velocity.current.y += accelY * deltaTime;
      position.current.x += velocity.current.x * deltaTime;
      position.current.y += velocity.current.y * deltaTime;

      speed.current = Math.sqrt(
        velocity.current.x ** 2 + velocity.current.y ** 2
      );

      if (canvasRef.current) {
        canvasRef.current.style.transform = `translate(${
          position.current.x - CURSOR_SIZE / 2
        }px, ${position.current.y - CURSOR_SIZE / 2}px)`;
      }

      if (gl && program) {
        const time = (Date.now() - startTimeRef.current) * 0.001;
        const resolutionUniformLocation = gl.getUniformLocation(
          program,
          "iResolution"
        );
        const timeUniformLocation = gl.getUniformLocation(program, "iTime");
        const speedUniformLocation = gl.getUniformLocation(program, "iSpeed");
        const mouseUniformLocation = gl.getUniformLocation(program, "iMouse");
        const clickTimeUniformLocation = gl.getUniformLocation(
          program,
          "iClickTime"
        );
        const velocityUniformLocation = gl.getUniformLocation(
          program,
          "iVelocity"
        );

        gl.uniform3f(
          resolutionUniformLocation,
          gl.canvas.width,
          gl.canvas.height,
          1
        );
        gl.uniform1f(timeUniformLocation, time);
        gl.uniform1f(speedUniformLocation, speed.current);
        gl.uniform4f(
          mouseUniformLocation,
          position.current.x,
          window.innerHeight - position.current.y,
          0,
          isMouseDownRef.current ? 1.0 : 0.0
        );
        gl.uniform1f(clickTimeUniformLocation, clickTimeRef.current);
        gl.uniform2f(
          velocityUniformLocation,
          velocity.current.x,
          -velocity.current.y
        );

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationFrameId.current = requestAnimationFrame(renderScene);
    };

    initWebGL();
    startTimeRef.current = Date.now();
    lastFrameTimeRef.current = performance.now();
    animationFrameId.current = requestAnimationFrame(renderScene);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }
  }, []);

  if (isTouchDevice) return null;
  return (
    <canvas
      ref={canvasRef}
      width={CURSOR_SIZE}
      height={CURSOR_SIZE}
      className="fixed top-0 left-0 pointer-events-none"
    />
  );
};

export default CustomCursor;
