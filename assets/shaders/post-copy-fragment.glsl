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
   //color -= abs(sin(texCoord.y * 100.0 + Time * 5.0)) * 0.08; // (1)
   //color -= abs(sin(texCoord.y * 300.0 - Time * 10.0)) * 0.05; // (2)
   gl_FragColor = color;
}