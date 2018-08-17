precision highp float;
uniform sampler2D u_image;
uniform sampler2D u_highlightTexture;

uniform vec2 u_screenSize;

varying vec2 v_texCoord;


void main() {
    vec4 sceneColor = texture2D(u_image, v_texCoord);
    vec4 highlightColor = texture2D(u_highlightTexture, v_texCoord);

    gl_FragColor = sceneColor + highlightColor * 0.8;
}