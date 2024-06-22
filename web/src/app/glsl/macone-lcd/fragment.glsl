uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

#include "../includes/directionalLight.glsl";
#include "../includes/ambientLight.glsl";
#include "../includes/pointLight.glsl";

void main() {
    vec2 uv = vUv;
    uv.x -= uTime * 0.3;
    uv.x /= 2.0;
    vec4 textureColor = texture2D(uTexture, uv);
    vec3 color = textureColor.rgb;

    vec3 light = vec3(0.0);
    vec3 lightPosition = vec3(0.0, 0.5, 4.0);
    vec3 lightColor = vec3(1.0);
    light += ambientLight(vec3(1.0), 4.8);
    light += pointLightReflect(
    lightColor, // color
    50.1, // intensity
    vNormal,
    normalize(lightPosition), // lightDirection
    vPosition, // model position to cal view pos
    cameraPosition// cam position to cal view pos
    );

    color *= light;

    csm_FragColor.rgb = color;
}
