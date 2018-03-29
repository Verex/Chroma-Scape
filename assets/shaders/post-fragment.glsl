precision mediump float;

uniform sampler2D u_sampler0;
varying vec2 v_tex_coord0;
uniform float u_post;
        
void main(void) {
    float blur = u_post/100.0;
    vec4 color0 = texture2D(
        u_sampler0, 
        vec2(v_tex_coord0.s - blur, v_tex_coord0.t - blur)
    );
    color0.a = 0.75;
    vec4 color1 = texture2D(
        u_sampler0, 
        vec2(v_tex_coord0.s + blur, v_tex_coord0.t + blur)
    );
    color1.a = 0.75;
    vec4 color2 = texture2D(u_sampler0, 
        vec2(v_tex_coord0.s + blur, v_tex_coord0.t - blur)
    );
    color2.a = 0.75;
    vec4 color3 = texture2D(u_sampler0, 
        vec2(v_tex_coord0.s - blur, v_tex_coord0.t + blur)
    );
    color3.a = 0.75;

    vec4 color4 = texture2D(
        u_sampler0, 
        v_tex_coord0
    );
    gl_FragColor = (
        color0 + 
        color1 + 
        color2 + 
        color3 + 
    color4)/5.0;
}