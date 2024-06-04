uniform float uTime;
uniform sampler2D uPicture;

varying vec2 vUv;

#include "../../includes/simplexNoise3d.glsl";

void main() {
    vec2 uv = vUv;
    uv.y -= uTime * 0.1;
    uv.y = mod(uv.y, 1.0);

    vec3 color = vec3(0.0);
    color += mod(vUv.y, 0.2);
    color += mod(vUv.x, 0.2);
    color *= vec3(vUv, uTime);

    vec4 picture = texture2D(uPicture, vUv);

    float strength = length(picture.rgb);
    color += vec3(strength);

    color.r *= step(0.0, uv.y);
    color.g *= step(0.33, uv.y);
    color.b *= step(0.66, uv.y);

    csm_FragColor.rgb = color;
    // emissive support
    csm_FragColor.rgb += vec3(0.3);
}
