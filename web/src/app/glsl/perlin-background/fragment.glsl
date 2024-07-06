uniform float uTime;
uniform sampler2D uNoiseSampler;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    uv.x += uTime;
    vec4 perlin = texture2D(uNoiseSampler, uv);
    float strength = perlin.r;
    csm_FragColor.rgb = mix(uColor1, uColor2, strength);
    csm_FragColor.a = 1.0;
}
