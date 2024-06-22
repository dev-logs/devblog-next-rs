uniform float uTime;
uniform float uStrength;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vElevation;

void main()
{
    float strength = distance(vUv, vec2(vUv.x, sin(vUv.x * 10.0) * 0.1 + 0.5));
    float strengthLayer2 = 0.001 / (strength);
    strength = 0.02 / (strength);
    strength *= 0.1;
    strength += strengthLayer2;
    vec3 color = strength * uColor;
    csm_FragColor.rgb = color;
    csm_FragColor.w = step(0.2, strength) * strength;
}
