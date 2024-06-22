uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

#include "../includes/simplexNoise3d.glsl";

void main() {
    vec2 uv = vUv * 10.0;
    float strength = uv.y;

    float noise = simplexNoise3d(vec3(uv, uTime * 0.2)) * 1.0;
    vec3 color = mix(uColor1, uColor2, uv.y * 2.0);

    csm_FragColor.rgb = color;
}
