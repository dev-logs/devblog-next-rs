uniform float uTime;
varying float vNoise;
uniform sampler2D uMap;
uniform float uEnableMap;
varying vec2 vUv;

void main()
{
    csm_Metalness = 1.0 - uEnableMap;
    csm_Roughness = 1.0 - csm_Metalness - uEnableMap;
}
