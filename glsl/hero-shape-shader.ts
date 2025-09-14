export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 iResolution;
  uniform float iTime;
  uniform float iScale;
  uniform vec3 iColorShift;
  uniform vec3 iColorShiftSecondary;
  uniform sampler2D iTexture;
  uniform bool iUseTexture;

  void main() {
      vec4 o = vec4(0.0);
      float t = iTime;
      float z = 0.0;
      float d = 0.0;

      for(float i = 0.0; i < 80.0; i++) {
          vec3 p = z * normalize(vec3((gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y, -1.0));
          vec3 a = normalize(cos(vec3(1.0, 3.0, 5.0) + t - d * 8.0));

          p.z += 5.0;
          a = a * dot(a, p) - cross(a, p);

          for(float j = 1.0; j < 9.0; j++) {
              a += sin(a * j + t).yzx / j;
          }

          d = 0.1 * abs(length(p) - 2.25 * iScale) + 0.04 * abs(a.y);
          z += d;

          if (d > 0.0001) {
            vec4 color_phase;

            // "Earth & Sky" Palette
            color_phase = (a.y > 0.0)
                ? vec4(0.8, 1.2, 1.5, 0.0) // Sky Blue
                : vec4(0.8, 0.5, 0.2, 0.0); // Terracotta

            // Smoothly blend the two color shifts over time
            float blend_factor = smoothstep(-1.0, 1.0, sin(iTime * 0.5));
            vec3 final_color_shift = mix(iColorShift, iColorShiftSecondary, blend_factor);

            color_phase.rgb += final_color_shift;
            o += (cos(d / 0.1 + color_phase) + 1.0) / d * z;
          }
      }

      if (iUseTexture) {
          vec2 tex_uv = vUv * 3.0;
          tex_uv += vec2(sin(iTime * 0.2), cos(iTime * 0.15)) * 0.5;
          vec4 texColor = texture2D(iTexture, tex_uv);
          o.rgb = mix(o.rgb, o.rgb * texColor.rgb, texColor.a * 0.4);
      }

      vec3 color = tanh(o.rgb / 20000.0);
      float alpha = smoothstep(0.01, 0.25, length(color));
      gl_FragColor = vec4(color * alpha, alpha);
  }
`;
