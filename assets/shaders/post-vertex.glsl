attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_screenSize;
varying vec2 v_texCoord;
 
void main() {
   v_texCoord = a_texCoord;
   gl_Position = a_position;
}