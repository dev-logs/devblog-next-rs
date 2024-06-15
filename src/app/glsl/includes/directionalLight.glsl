vec3 directionalLight(vec3 color, float lightIntensity, vec3 lightPosition, vec3 normal) {
    return max(0.0, dot(lightPosition, normal) * lightIntensity) * color;
}

vec3 directionalLightReflect(vec3 color, float lightIntensity, vec3 normal, vec3 lightDirection, vec3 modelPosition, vec3 cameraPosition) {
    vec3 viewDirection = normalize(cameraPosition - modelPosition);
    vec3 lightReflection = reflect(- lightDirection, normal);

    float shading = max(0.0, dot(viewDirection, lightReflection));
    shading = pow(shading, 20.0);
    return vec3(shading) * color * lightIntensity;
}
