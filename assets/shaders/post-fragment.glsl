precision mediump float;
 
// our texture
uniform sampler2D u_image;
uniform float u_offset;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
 
void main() {
   // Look up a color from the texture.
   vec2 texCoord = v_texCoord;
   texCoord.x += sin(texCoord.y * 4.0 * 2.0 * 3.14159 + u_offset) / 100.0;
   gl_FragColor = texture2D(u_image, texCoord);
}