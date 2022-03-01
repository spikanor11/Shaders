#version 330 core
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_time;

void main()
{
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(1,0,1);

    int x = int(st.x * (256+int(u_time*1)));
    int y = int(st.y * (256+int(u_time*1)));

    float alien1 = mod(x^y, 9 )/8.0;
    float alien2 = mod(x^y, 15)/14.0;
    float alien3 = mod(x^y, 11)/10.0;

    color = vec3(alien1, alien2, alien3);

    gl_FragColor = vec4(color, 1);
}
