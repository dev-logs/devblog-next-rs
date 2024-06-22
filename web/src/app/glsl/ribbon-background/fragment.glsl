varying vec2 vUv;
uniform float uTime;
uniform float uSpeed;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main()
{
    float speed = uTime * uSpeed;
    float strength = gl_FragCoord.x;
    strength += gl_FragCoord.y;
    strength += speed;
    strength = step(0.5, mod(strength, 1.01));

    vec3 color = mix(uColor1, uColor2, strength);
    csm_FragColor.rgb = color;
}
