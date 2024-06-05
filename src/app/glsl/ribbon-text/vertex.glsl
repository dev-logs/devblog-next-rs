uniform float uTime;
uniform float uSpeed;
uniform float uStrength;

varying vec2 vUv;
varying vec3 vElevation;

#include "../includes/simplexNoise3d.glsl";

void main() {
    float noise = simplexNoise3d(vec3(csm_Position.xy, uTime));
    vUv = uv;

    csm_Position.y += cos(csm_Position.x * 2.0 - uTime) * uStrength * uSpeed;
    csm_Position.z += sin(csm_Position.y * 0.4 - uTime) * 0.1 * uSpeed;
    vElevation = vec3(csm_Position.z * 0.1);
}
