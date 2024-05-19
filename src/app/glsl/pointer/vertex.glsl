uniform float uTime;

attribute vec3 aPosition2;
attribute vec3 aNormal2;
attribute vec2 aUv2;

varying float vNoise;
varying vec2 vUv;

#include "../includes/simplexNoise3d.glsl";

void main() {
    float noiseOrigin = simplexNoise3d(csm_Position);
    float noiseTarget = simplexNoise3d(aPosition2);
    float noise = mix(noiseTarget, noiseOrigin, uTime);
    noise = 1.0;

    float stage1Duration = 0.4;
    float stage2Duration = 0.4;
    float progress1 = smoothstep(0.0, stage1Duration, uTime);
    float progress2 = smoothstep(stage1Duration, stage2Duration, uTime);
    float progress = smoothstep(stage2Duration * noise, 1.0, uTime);

    csm_Position = mix(csm_Position, sign(csm_Normal), progress1);
    csm_Position = mix(csm_Position, sign(aNormal2), progress2);
    csm_Position = mix(csm_Position, aPosition2, progress);

    csm_Normal= mix(csm_Normal, sign(csm_Normal), progress1);
    csm_Normal= mix(csm_Normal, sign(aNormal2), progress2);
    csm_Normal= mix(csm_Normal, aNormal2, progress);
    csm_Normal = normalize(csm_Normal);
    vUv = mix(uv, aUv2, progress);
}
