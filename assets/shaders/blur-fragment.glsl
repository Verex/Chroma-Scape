precision highp float;
uniform sampler2D u_image;

uniform vec2 u_screenSize;

varying vec2 v_texCoord;
varying vec2 v_blurTextureCoords[11];


void main() {
    vec4 outcolor = vec4(0.0, 0.0, 0.0, 0.0);
    outcolor += texture2D(u_image, v_blurTextureCoords[0]) * 0.0093;
    outcolor += texture2D(u_image, v_blurTextureCoords[1]) * 0.028002;
    outcolor += texture2D(u_image, v_blurTextureCoords[2]) * 0.065984;
    outcolor += texture2D(u_image, v_blurTextureCoords[3]) * 0.121703;
    outcolor += texture2D(u_image, v_blurTextureCoords[4]) * 0.175713;
    outcolor += texture2D(u_image, v_blurTextureCoords[5]) * 0.198596;
    outcolor += texture2D(u_image, v_blurTextureCoords[6]) * 0.175713;
    outcolor += texture2D(u_image, v_blurTextureCoords[7]) * 0.121703;
    outcolor += texture2D(u_image, v_blurTextureCoords[8]) * 0.065984;
    outcolor += texture2D(u_image, v_blurTextureCoords[9]) * 0.028002;
    outcolor += texture2D(u_image, v_blurTextureCoords[10]) * 0.0093;

    gl_FragColor = outcolor;

}