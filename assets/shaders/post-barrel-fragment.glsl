precision highp float;
 
// our texture
uniform sampler2D u_image;
uniform float Time;
uniform vec2 dim;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
 
void main() {
   // Look up a color from the texture.
  vec2 pos = v_texCoord;
  float distortion = 0.05; 
  pos -= vec2(0.5, 0.5);
  pos *= vec2(pow(length(pos), distortion));
  pos += vec2(0.5, 0.5);
  gl_FragColor = texture2D(u_image, pos);
}