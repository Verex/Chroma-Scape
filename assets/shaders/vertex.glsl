attribute vec4 a_position;
attribute vec3 a_color;

uniform bool u_interpolate;
uniform float u_interpolation;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_modelPrevMatrix;
uniform mat4 u_projectionMatrix;
varying vec4 v_color;

mat4 lerpMatrix(mat4 a, mat4 b) {
    if(u_interpolate) {
        mat4 c = b;
        return c;
    } else {
        return b;
    }
}
void main()
{
    v_color = vec4(a_color, 1.0);
    gl_Position = u_projectionMatrix * u_viewMatrix * lerpMatrix(u_modelPrevMatrix, u_modelMatrix) * a_position;
    gl_PointSize = 10.0;
}