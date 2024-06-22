varying vec2 vUv;
varying float vWobble;

void main()
{
    csm_Metalness = 1.0;
    csm_Roughness = 1.0 - csm_Metalness;

    // csm_FragColor.rgb = mix(vec3(0.5), vec3(1.0), vWobble);
    // csm_FragColor.rgb = vec3(1.0);
}
