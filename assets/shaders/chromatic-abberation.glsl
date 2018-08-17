precision highp float;
uniform sampler2D u_image;
uniform vec2 u_screenSize;

varying vec2 v_texCoord;


void main() {
    //vec2 ps = gl_FragCoord.xy * u_screenSize.xy / gl_FragCoord.w;
    vec4 r_color = texture2D(u_image, v_texCoord - vec2(0.00093, 0.0034));
    vec4 g_color = texture2D(u_image, v_texCoord - vec2(-0.00031, 0.0012));
    vec4 b_color = texture2D(u_image, v_texCoord - vec2(0.00013, 0.00043));


    gl_FragColor = vec4(r_color.r, g_color.g, b_color.b, 1.0);
}