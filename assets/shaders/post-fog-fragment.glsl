precision highp float;
 
// our texture
uniform sampler2D u_image;
uniform float Time;
uniform vec2 dim;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
 
void main() {
   // Look up a color from the texture.
   vec2 texCoord = v_texCoord;
   vec4 color = texture2D(u_image, texCoord);

   vec3 light = vec3(0.5, 0.3, 0.1);
   gl_FragColor = color;
}