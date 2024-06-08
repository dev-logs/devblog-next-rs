uniform float uTime;
varying vec2 vUv;
varying float vElevation;

#include "../includes/simplexNoise3d.glsl";

void main() {
  vUv = uv;
  float elevation = simplexNoise3d(vec3(csm_Position.xz, uTime * 0.1));
  csm_Position.z += elevation * 0.3;
  csm_Position.y += elevation * 0.3;
  vElevation = elevation;
}
