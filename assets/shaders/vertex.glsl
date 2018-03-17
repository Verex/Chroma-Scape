attribute vec4 a_position;
attribute vec3 a_color;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_projectionMatrix;
varying vec4 v_color;
void main()
{
    v_color = vec4(a_color, 1.0);
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
    gl_PointSize = 10.0;
}