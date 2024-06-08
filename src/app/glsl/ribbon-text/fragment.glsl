uniform sampler2D uTexture;
uniform float uTime;
uniform float uSpeed;
varying vec2 vUv;
varying vec3 vElevation;

void main()
{
    vec2 uv = vUv;
    uv.x -= uTime * 0.5 * uSpeed;
    uv.x = mod(uv.x, 1.0);
    uv.x = max(uv.x, 0.0);

    vec4 color = texture2D(uTexture, uv);
    color.rgb -= vElevation;
    color.rgb += uv.y - 0.5;
    color.rgb = max(vec3(0.0), color.rgb);

    // Bugs fix: a strangth line appear when load an image
    color.a = step(0.45, 1.0 - vUv.y) * color.a;
    color.a = step(0.45, vUv.y) * color.a;
    color.r = min(1.0, color.r);
    color.g = min(1.0, color.g);
    color.b = min(1.0, color.b);
    csm_FragColor = color;
}
