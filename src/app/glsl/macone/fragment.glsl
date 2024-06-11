uniform sampler2D uTexture;
varying vec2 vUnwrapUv;
uniform float uColorScale;
varying vec3 vNormal;
varying vec3 vPosition;

// #include ../includes/directionalLight.glsl
// #include ../includes/ambientLight.glsl
// #include ../includes/pointLight.glsl

void main()
{
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    vec4 textureColor = texture2D(uTexture, vUnwrapUv);
    vec3 normal = normalize(vNormal);
    vec3 color = textureColor.rgb;
    vec3 light = vec3(0.0);
    vec3 lightPosition = vec3(0.0, 0.0, 3.0);

    vec3 lightColor = vec3(1.0, 1.0, 1.0);

    light += ambientLight(vec3(1.0), 2.5);

    light += pointLightReflect(
    lightColor, // color
    2.2, // intensity
    normal, // surface direction
    normalize(lightPosition), // lightDirection
    vPosition, // model position to cal view pos
    cameraPosition// cam position to cal view pos
    );

    color *= light;

    gl_FragColor = vec4(textureColor.rgb, 1.0);
}
