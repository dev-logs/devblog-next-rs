uniform float uTime;
uniform float uFrameCount;
uniform sampler2D uPicture;

varying vec2 vUv;

#include "../../includes/simplexNoise3d.glsl";

void main() {
    vec2 uv = vUv;
    uv.y -= uTime * 0.1;
    uv.y = mod(uv.y, 1.0);

    vec3 color = vec3(0.0);
    color += mod(vUv.y, 0.1);
    color += mod(vUv.x, 0.05);

    vec2 frame_uv = vUv;
    frame_uv.x += floor(uTime * 2.0);
    frame_uv.x /= uFrameCount;
    frame_uv.x = mod(frame_uv.x, 1.0);

    vec4 picture = texture2D(uPicture, frame_uv);

    color = picture.rgb;
    float emission = 1.0 - distance(vUv, vec2(0.5));

    csm_FragColor.rgb = color;
}
