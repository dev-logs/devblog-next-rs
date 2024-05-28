uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

void main()
{
    vec2 uv = vUv;
    uv.x -= uTime * 0.2;
    uv.x = mod(uv.x, 1.0);
    vec4 color = texture2D(uTexture, uv);
    csm_FragColor = color;
}
