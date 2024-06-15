uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

#include "../includes/simplexNoise3d.glsl";

void main() {
    vec2 uv = vUv * 10.0;
    float strength = uv.y;

    float noise = simplexNoise3d(vec3(uv, uTime * 0.2)) * 1.0;
//    noise *= simplexNoise3d(vec3(uv, uTime));
    vec3 color = mix(uColor2, uColor1, noise * 1.0);
    color.r = floor(color.r * 10.0);
    color.g = floor(color.g * 10.0);
    color.b = floor(color.b * 10.0);
    csm_FragColor.rgb = color * 0.2;
}
