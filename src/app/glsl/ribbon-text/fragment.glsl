uniform sampler2D uTexture;
uniform float uTime;
uniform float uSpeed;
varying vec2 vUv;
varying vec3 vElevation;

void main()
{
    vec2 uv = vUv;
    uv.x -= uTime * 0.2 * uSpeed;
    uv.x = mod(uv.x, 1.0);
    vec4 color = texture2D(uTexture, uv);
    color.rgb += vElevation;
    color.rgb += uv.y - 0.5;
    csm_FragColor = color;
}
