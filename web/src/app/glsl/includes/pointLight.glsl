vec3 pointLight(vec3 color, float lightIntensity, vec3 lightPosition,  vec3 viewPosition, vec3 normal, float lightDecay) {
    vec3 lightToView = lightPosition - viewPosition;
    vec3 lightDirection = normalize(lightToView);
    float decay = 1.0 - length(lightToView) * lightDecay;

    vec3 shading = vec3(max(0.0, dot(lightToView, normal)));
    return color * shading * lightIntensity * decay;
}

vec3 pointLightReflect(vec3 color, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 modelPosition, vec3 cameraPosition) {
    vec3 lightToView = lightPosition - modelPosition;
    vec3 lightDirection = normalize(lightToView);
    vec3 viewDirection = normalize(cameraPosition - modelPosition);
    vec3 lightReflection = reflect(- lightDirection, normal);

    float shading = max(0.0, dot(viewDirection, lightReflection));
    shading = pow(shading, 20.0);
    return vec3(shading) * color * lightIntensity;
}
