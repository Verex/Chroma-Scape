#ifdef GL_ES
precision mediump float;
#endif

const float eps = 0.0001; //Machine Epsilon

varying vec4 v_color;

uniform vec4 u_selectionColor;
uniform vec4 u_thrusterColor;

void main()
{
  gl_FragColor = v_color;
    // Define replace colors.
    /*
    vec4 r_selectionColor = vec4(1.0, 0.0, 1.0, 1.0);
    vec4 r_thrusterColor = vec4(1.0, 0.0, 0.9, 1.0);

    if(all(greaterThanEqual(v_color, r_selectionColor - eps)) && all(lessThanEqual(v_color, r_selectionColor + eps)))
      gl_FragColor = u_selectionColor;
    else if (all(greaterThanEqual(v_color, r_thrusterColor - eps)) && all(lessThanEqual(v_color, r_thrusterColor + eps)))
      gl_FragColor = u_thrusterColor;
    else
        gl_FragColor = v_color;
        */
}
