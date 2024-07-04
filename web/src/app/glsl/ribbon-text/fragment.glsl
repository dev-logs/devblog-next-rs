uniform sampler2D uTexture;
uniform float uTime;
uniform float uSpeed;
varying vec2 vUv;
varying vec3 vElevation;

vec4 blur5(vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture2D(uTexture, vUv) * 0.29411764705882354;
  color += texture2D(uTexture, vUv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(uTexture, vUv - (off1 / resolution)) * 0.35294117647058826;
  return color;
}

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

void main()
{
    vec2 uv = vUv;
    uv.x -= uTime * 0.5 * uSpeed;
    uv.x = mod(uv.x, 1.0);
    uv.x = max(uv.x, 0.0);

    vec4 color = texture2D(uTexture, uv);
    color.rgb -= vElevation;
    color.rgb += uv.y - 0.5;
    color.rgb = max(vec3(0.0), color.rgb);

    // Bugs fix: a strangth line appear when load an image
    color.a = step(0.45, 1.0 - vUv.y) * color.a;
    color.a = step(0.45, vUv.y) * color.a;
    color.r = min(1.0, color.r);
    color.g = min(1.0, color.g);
    color.b = min(1.0, color.b);

    // color.a *= (1.0 - step(0.8, length(color.r)));
    // color = blur9(uTexture, vUv, vec2(1.8, 9.0), vec2(1.9, 1.0));
    csm_FragColor = color;
}
