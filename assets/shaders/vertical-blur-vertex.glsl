attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_screenSize;
varying vec2 v_texCoord;

varying vec2 v_blurTextureCoords[11];


void main() {
    v_texCoord = a_texCoord;
    gl_Position = vec4(a_position.xy, 0.0, 1.0);
    vec2 centerTexCorods = a_position.xy * 0.5 + 0.5;
    float pixelSize = 1.0 / u_screenSize.y;

    for(int i = -5; i <= 5; i++) {
        v_blurTextureCoords[i + 5] = centerTexCorods + vec2(0.0, pixelSize * float(i));
    }
}