precision highp float;
 
// our texture
uniform sampler2D u_image;
uniform float Time;
uniform vec2 dim;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
/*
vec2 radialDistortion(vec2 coord, vec2 pos) {
    float distortion = 0.05;
    vec2 cc = pos - 0.5;
    float dist = dot(cc, cc) * distortion;
    return coord * (pos + cc * (1.0 + dist) * dist) / pos;
}
*/
 
void main() {
   // Look up a color from the texture.
   vec2 texCoord = v_texCoord;
   vec4 color = texture2D(u_image, texCoord);
   color += abs(sin(texCoord.y * 100.0 + Time * 5.0)) * 0.04; // (1)
   color -= abs(sin(texCoord.y * 300.0 - Time * 15.0)) * 0.05; // (2)
   gl_FragColor = color;
}