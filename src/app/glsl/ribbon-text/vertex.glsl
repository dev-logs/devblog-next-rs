uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;

#include "../includes/simplexNoise3d.glsl";

void main() {
    float noise = simplexNoise3d(vec3(csm_Position.xy, uTime));
    vUv = uv;

    csm_Position.y += cos(csm_Position.x * 2.0 - uTime) * 0.6;
    csm_Position.z += sin(csm_Position.y * 0.5 - uTime) * 0.2;
}
