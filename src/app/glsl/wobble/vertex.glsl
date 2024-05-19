uniform float uTime;
uniform float uProgress;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;
uniform float uWidthTarget;
uniform float uHeightTarget;
uniform float uDepthTarget;

attribute vec4 tangent;

varying vec2 vUv;
varying float vWobble;

// #include ../includes/simplexNoise4d.glsl

float getWobble(vec3 position) {
    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(vec4(
        position * uWarpPositionFrequency,
        uTime * uWarpTimeFrequency
    )) * uWarpStrength;

    float wobble = simplexNoise4d(vec4(
        warpedPosition * uPositionFrequency,
        uTime * uTimeFrequency
    )) * uStrength;

    return wobble;
}

void main() {
    vec3 biTangent = cross(normal, tangent.xyz);

    float shift = 0.01;
    vec3 positionA = csm_Position + biTangent * shift;
    vec3 positionB = csm_Position + biTangent * shift;

    float wobble = getWobble(csm_Position);
    float duration = 0.9;
    float delay = (1.0 - duration) * wobble;
    float end = delay + duration;
    float progress = smoothstep(delay, end, uProgress / length(csm_Position));
    csm_Position.x += uWidthTarget * normal.x * progress;
    csm_Position.y += uHeightTarget * normal.y * progress;
    csm_Position.z += uDepthTarget * normal.z * progress;

    csm_Position += wobble * normal;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);

    // csm_Normal = cross(toA, toB);
    vWobble = wobble / uStrength;
    vUv = uv;
}
