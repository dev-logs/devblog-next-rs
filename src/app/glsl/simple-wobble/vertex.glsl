uniform float uTime;
uniform float uStrength;

#include "../includes/simplexNoise3d.glsl";

void main() {
    float time = uTime;
    float noise = simplexNoise3d(vec3(csm_Position.xy, time));
    csm_Position += (csm_Normal * noise) * uStrength;
}
