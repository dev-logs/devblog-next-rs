uniform float uTime;
uniform sampler2D uImage;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec2 uv = vUv;
    uv.x += uTime * 0.05;
    uv.x = mod(uv.x, 1.0);

    vec4 image = texture2D(uImage, uv);

    csm_FragColor.rgb = image.rgb;
    csm_FragColor.a *= 0.1;

    // Calculate the size of each cell in the grid
    float grid_size = 40.0;
    vec2 grid = fract(vUv * grid_size);
    float square_size = 0.5;
}
