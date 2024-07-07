uniform sampler2D uNoiseSampler;
uniform float uTime;

varying vec2 vUv;
varying float vNoise;

#include "../includes/simplexNoise3d.glsl";

void main() {
    vUv = uv;
    vec4 perlin = texture2D(uNoiseSampler, vUv);

    // Mixed position
    float noiseOrigin = simplexNoise3d(csm_Position * 0.5 + uTime) ;
}
