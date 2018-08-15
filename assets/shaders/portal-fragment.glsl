#ifdef GL_ES
precision mediump float;
#endif

const float eps = 0.0001; //Machine Epsilon

varying vec4 v_color;
uniform vec4 u_PortalColor;

void main()
{
    vec4 r_PortalColor = vec4(1.0, 0.0, 1.0, 1.0);

    if(all(greaterThanEqual(v_color, r_PortalColor - eps)) && all(lessThanEqual(v_color, r_PortalColor + eps)))
      gl_FragColor = u_PortalColor;
    else
        gl_FragColor = v_color;
}
