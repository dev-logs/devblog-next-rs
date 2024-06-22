uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec2 frequencies = uv;
    float pi = 3.141592653589793;
    float elevation = cos(sin(csm_Position.x - uTime) * cos(frequencies.x) * 10.0 - uTime) * 0.1;
    elevation += sin(csm_Position.y * frequencies.y - uTime) * 0.08;
    csm_Position.z = elevation;
    vUv = uv;
    vElevation = elevation;
}
