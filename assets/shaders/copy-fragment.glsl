precision highp float;
uniform sampler2D u_image;

uniform vec2 u_screenSize;

varying vec2 v_texCoord;


void main() {
    gl_FragColor = texture2D(u_image, v_texCoord);
}