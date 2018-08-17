precision highp float;
uniform sampler2D u_image;
uniform vec2 u_screenSize;

varying vec2 v_texCoord;


void main() {
    //vec2 ps = gl_FragCoord.xy * u_screenSize.xy / gl_FragCoord.w;
    vec4 color = texture2D(u_image, v_texCoord);
    float brightness = (color.r * 0.2126) + (color.g * 0.7152) + (color.b * 0.0722);
    if(brightness > 0.1) {
        gl_FragColor = color;
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}