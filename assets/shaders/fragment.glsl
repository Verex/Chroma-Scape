
precision mediump float;
varying vec4 v_color;


uniform vec4 u_thrusterColor;

void main()
{
    vec4 programmerMagenta = vec4(1.0, 0.0, 1.0, 1.0); 
    float eps = 0.0001;
    if(all(greaterThanEqual(v_color,programmerMagenta - eps)) && all(lessThanEqual(v_color,programmerMagenta+eps)))
        gl_FragColor = u_thrusterColor;
    else
        gl_FragColor = v_color; //Normalized between 0-1
}