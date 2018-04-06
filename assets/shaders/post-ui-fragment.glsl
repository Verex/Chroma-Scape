precision highp float;
 
// our texture
uniform sampler2D u_image;
uniform sampler2D u_scene;
uniform float Time;
uniform vec2 dim;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
 
void main() {
    vec2 texCoord = v_texCoord;
    vec4 sc_color = texture2D(u_scene, texCoord);
    vec4 ui_color = texture2D(u_image, texCoord);
    gl_FragColor = sc_color;
    
}