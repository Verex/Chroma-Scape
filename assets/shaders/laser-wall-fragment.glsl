#ifdef GL_ES
precision mediump float;
#endif

const float eps = 0.0001; //Machine Epsilon

varying vec4 v_color;

uniform vec4 u_ColorCycle1;
uniform vec4 u_ColorCycle2;

void main()
{
    vec4 r_ColorCycle1 = vec4(1.0, 0.0, 1.0, 1.0);
    vec4 r_ColorCycle2 = vec4(1.0, 0.0, 0.9, 1.0);

    if(all(greaterThanEqual(v_color, r_ColorCycle1 - eps)) && all(lessThanEqual(v_color, r_ColorCycle1 + eps)))
      gl_FragColor = u_ColorCycle1;
    else if (all(greaterThanEqual(v_color, r_ColorCycle2 - eps)) && all(lessThanEqual(v_color, r_ColorCycle2 + eps)))
      gl_FragColor = u_ColorCycle2;
    else
      gl_FragColor = v_color;
}
