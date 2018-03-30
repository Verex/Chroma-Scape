precision highp float;
 
// our texture
uniform sampler2D u_image;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
uniform float time;
uniform vec2 dim;

vec2 radialDistortion(vec2 coord, vec2 pos) {
    float distortion = 0.05;
    vec2 cc = pos - 0.5;
    float dist = dot(cc, cc) * distortion;
    return coord * (pos + cc * (1.0 + dist) * dist) / pos;
}
 
void main() {
    vec2 pos = v_texCoords * dim;
    vec4 col = texture2D(tex, v_texCoords);
    vec4 gws = vec4(.0);
    float rand = .02*sin(time)+.3;
    float weight = .03;
    vec4 col_r = texture2D(tex, v_texCoords + vec2((-15. / dim.x) * rand, 0));
    //glow
    for (int i = 0; i <9; i++) {
        float miw = float(mod(float(i), 4.));
        float idw = float(i / 3);
        vec2 v1 = vec2(pos.x + miw, pos.y + idw);
        vec2 v2 = vec2(pos.x - miw, pos.y + idw);
        vec2 v3 = vec2(pos.x + miw, pos.y - idw);
        vec2 v4 = vec2(pos.x - miw, pos.y - idw);
        gws += texture2D(tex, v1 / dim) * weight;
        gws += texture2D(tex, v2 / dim) * weight;
        gws += texture2D(tex, v3 / dim) * weight;
        gws += texture2D(tex, v4 / dim) * weight;
   }
   col += gws;
   // chromatic distorsion 
   vec4 col_l = texture2D(tex, v_texCoords + vec2((8. / dim.x) * rand, 0));
   vec4 col_g = texture2D(tex, v_texCoords + vec2((-7.5 / dim.x) * rand, 0));
   float val = max(1., sin(v_texCoords.y * dim.y * 1.2) * 2.5) * rand;
   col.r = col.r + col_l.r * val;
   col.b = col.b + col_r.b * val;
   col.g = col.g + col_g.g * val;

   // Noise color using random number
   vec2 pos2 = v_texCoords*sin(time);
   float r = fract(sin(dot(pos2.xy ,vec2(12.,78.))) * 43758.);
   vec3 noise = vec3(r);
   col.rgb = mix(col.rgb, noise, .015);

   gl_FragColor.rgba = col;
}