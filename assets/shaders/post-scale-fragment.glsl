precision highp float;
 
// our texture
uniform sampler2D u_image;
uniform vec2 u_resolution;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
 
void main() {
   // Look up a color from the texture.
   vec2 texCoord = v_texCoord;
   texCoord.x = floor(v_texCoord.x * u_resolution.x) / u_resolution.x;
   texCoord.y = floor(v_texCoord.y * u_resolution.y) / u_resolution.y;
   gl_FragColor = texture2D(u_image, texCoord);
}