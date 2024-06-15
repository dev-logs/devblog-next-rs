uniform sampler2D uTexture;
uniform float uColorScale;

varying vec2 vUv;
varying vec3 vPosition;

#include "../includes/directionalLight.glsl";
#include "../includes/ambientLight.glsl";
#include "../includes/pointLight.glsl";

void main()
{
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    vec4 textureColor = texture2D(uTexture, vUv);
    vec3 normal = normalize(vNormal);
    vec3 color = textureColor.rgb;
    vec3 light = vec3(0.0);
    vec3 lightPosition = vec3(0.0, 0.5, 4.0);
    vec3 lightColor = vec3(0.9, 0.9, 0.9);
    light += ambientLight(vec3(1.0), 1.8);
    light += pointLightReflect(
        lightColor, // color
        0.1, // intensity
        normal, // surface direction
        normalize(lightPosition), // lightDirection
        vPosition, // model position to cal view pos
        cameraPosition// cam position to cal view pos
    );

    color *= light;

    csm_FragColor = vec4(color, 1.0);
}
