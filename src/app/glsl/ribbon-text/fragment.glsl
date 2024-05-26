varying vec2 vUv;
uniform float uTime;
uniform sampler2D uMap;

void main()
{
    // vec4 textureColor = texture2D(uMap, vUv);
    // // textureColor.w = step(0.01, 1.0 - length(textureColor.rgb));
    // float speed = uTime;
    // float strength = gl_FragCoord.x;
    // // strength += speed;
    // // strength = step(0.5, mod(strength, 1.01));
    // strength = min(1.0, strength);

    // csm_FragColor.rgb = mix(vec3(0.0), textureColor.rgb, strength);
    // csm_FragColor.a = textureColor.a;
    // csm_FragColor.rgb = vec3(vUv, 1.0);
}
