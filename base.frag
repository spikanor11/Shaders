#version 330 core
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_time;

void main()
{
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(1,0,1);



    gl_FragColor = vec4(color, 1);
}
