precision highp float;
 
// our texture
uniform sampler2D u_image;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;


vec2 radialDistortion(vec2 coord, vec2 pos) {
    float distortion = 0.05;
    vec2 cc = pos - 0.5;
    float dist = dot(cc, cc) * distortion;
    return coord * (pos + cc * (1.0 + dist) * dist) / pos;
}
 
void main() {
   // Look up a color from the texture.
   vec2 texCoord = radialDistortion(v_texCoord, v_texCoord);
   gl_FragColor = texture2D(u_image, texCoord);
}