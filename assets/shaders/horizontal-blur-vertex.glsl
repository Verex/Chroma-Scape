attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_screenSize;
varying vec2 v_texCoord;

varying vec2 v_blurTextureCoords[11];


void main() {
    v_texCoord = a_texCoord;
    vec2 centerTexCoords = a_position.xy * 0.5 + 0.5;
    gl_Position = vec4(a_position.xy, 0.0, 1.0);
    float pixelSize = 1.0 / u_screenSize.x;

    for(int i = -5; i <= 5; i++) {
        v_blurTextureCoords[i + 5] = centerTexCoords + vec2(pixelSize * float(i), 0.0);
    }
}