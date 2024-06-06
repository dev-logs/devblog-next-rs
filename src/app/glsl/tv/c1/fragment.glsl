uniform float uTime;
uniform sampler2D uPicture;

varying vec2 vUv;

#include "../../includes/simplexNoise3d.glsl";

// float rand(vec2 co){
//     return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
// }

void main() {
    vec2 uv = vUv;
    uv.y -= uTime * 0.1;
    uv.y = mod(uv.y, 1.0);

    vec3 color = vec3(0.0);
    color += mod(vUv.y, 0.1);
    color += mod(vUv.x, 0.05);

    vec4 picture = texture2D(uPicture, vUv);

    float strength = length(picture.rgb);
    color += vec3(strength);

    float emission = 1.0 - distance(vUv, vec2(0.5));
    emission *= 0.5;
    color.r *= step(0.0, uv.y) * emission;
    color.g *= step(0.33, uv.y) * emission;
    color.b *= step(0.66, uv.y) * emission;

    csm_FragColor.rgb = color;
    csm_FragColor.rgb += vec3(rand(vec2(uv.x, uTime * 0.1))) * 0.2;
    csm_FragColor.rgb += vec3(emission);
}
