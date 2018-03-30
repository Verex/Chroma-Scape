precision highp float;
 
// our texture
uniform sampler2D u_image;
uniform float Time;
uniform vec2 dim;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
 
void main() {
   // Look up a color from the texture.
   /*
   vec2 texCoord = v_texCoord;
   vec4 color = texture2D(u_image, texCoord);
   color -= abs(sin(texCoord.y * 100.0 + Time * 5.0)) * 0.08; // (1)
   color -= abs(sin(texCoord.y * 300.0 - Time * 10.0)) * 0.05; // (2)
   gl_FragColor = color;
   */
   float distortion = 800.0;
   vec2 coord = v_texCoord * dim;
   coord -= dim / 2.0;
   float dis = length(coord);
   if (dis < distortion) {
       float percent = dis / distortion;
       coord *= mix(1.0, smoothstep(0.0, distortion / dis, percent), 0.015625);
   }
   coord += dim / 2.0;
   vec4 color = texture2D(u_image, coord / dim);

   float dist = distance(v_texCoord, vec2(0.5, 0.5));
   color.rgb *= smoothstep(0.8, 0.2 * 0.8, dist);

   gl_FragColor = color;
}