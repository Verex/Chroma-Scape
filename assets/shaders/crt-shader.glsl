precision highp float;
uniform sampler2D u_image;
uniform vec2 u_screenSize;
uniform float u_time;

varying vec2 v_texCoord;


void main() {
    vec3 color = texture2D(u_image, v_texCoord).rgb;
    color -= abs(sin(v_texCoord.y * 100.0 + u_time * 5.0)) * 0.005; // (1)
    color -= abs(sin(v_texCoord.y * 300.0 - u_time * 10.0)) * 0.01; // (2)
    gl_FragColor = vec4(color, 1.0).rgba;
}