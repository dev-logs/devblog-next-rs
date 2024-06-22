uniform float uTime;
uniform float uProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;

void main()
{
    float progress = smoothstep(uProgress, 1.0, uTime) * uProgress;
    csm_FragColor.rgb = mix(uColor1, uColor2, progress);
}
