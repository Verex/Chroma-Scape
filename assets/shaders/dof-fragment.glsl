precision highp float;

uniform sampler2D u_image;
uniform sampler2D u_depth;

uniform vec2 u_screenSize;

varying vec2 v_texCoord;


void main() {
    float dist = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = 1.0 / exp(pow(dist * 1.3, 2.0));
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    vec3 finalFog = mix(vec3(0.1, 0.1, 0.1), texture2D(u_image, v_texCoord).rgb, fogFactor);
    gl_FragColor = vec4(finalFog, 1.0);

}