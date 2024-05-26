uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;
#include "../includes/simplexNoise3d.glsl";

void main() {
    float time = uTime;
    float noise = simplexNoise3d(vec3(csm_Position.xy, time));
    csm_Position += (csm_Normal * noise) * 0.1;
    vUv = uv;
}
