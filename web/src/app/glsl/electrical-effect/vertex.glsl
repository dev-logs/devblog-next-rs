uniform float uTime;
uniform float uStrength;

varying vec2 vUv;
varying vec3 vElevation;

#include "../includes/simplexNoise3d.glsl";

void main() {
    vUv = uv;
    vElevation = vec3(csm_Position.z * 0.1);
    csm_Position.z += sin(csm_Position.x);
}
