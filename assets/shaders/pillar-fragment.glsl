#ifdef GL_ES
precision mediump float;
#endif

const float eps = 0.0001; //Machine Epsilon

varying vec4 v_color;
uniform vec4 u_BeaconColor;

void main()
{
    vec4 r_BeaconColor = vec4(1.0, 0.0, 1.0, 1.0);

    if(all(greaterThanEqual(v_color, r_BeaconColor - eps)) && all(lessThanEqual(v_color, r_BeaconColor + eps)))
      gl_FragColor = u_BeaconColor;
    else
        gl_FragColor = v_color;
}
