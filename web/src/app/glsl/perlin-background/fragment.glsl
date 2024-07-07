uniform float uTime;
uniform sampler2D uNoiseSampler;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;
varying float vNoise;

#include "../includes/simplexNoise3d.glsl";

void main() {
    vec2 uv = vUv;
    uv.x += uTime * 0.1;
    uv.x = mod(uv.x, 1.0);
    vec4 noise = texture2D(uNoiseSampler, uv);
    noise *= smoothstep(0.0, 0.1, uv.x);
    noise *= smoothstep(1.0, 0.9, uv.x);
    noise *= smoothstep(0.0, 0.1, uv.y);
    noise *= smoothstep(1.0, 0.4, uv.y);

    float strength = noise.y;
    strength = sin(strength * 2.0);
    vec3 color = uColor1;
    color = mix(uColor1, uColor2, strength);
    color -= vUv.y;
    color -= 0.5 - vUv.x;

    color = max(vec3(0.0), color);
    csm_FragColor.rgb = color;
}
