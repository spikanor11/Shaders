#version 330 core
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_time;

const float PI = acos(-1);

vec3 col_sea = vec3(0.0,0.1,0.2);
vec3 col_med = vec3(0.8,0.9,1.0);
vec3 col_face = vec3(1.0,1.0,0.4);

vec2 center = vec2(0.5);
//vec2 center = u_mouse/u_resolution;
float radius = 1*0.3;

void main()
{
    vec2 st = gl_FragCoord.xy/u_resolution;
    
    float angle_center = (atan(st.x-center.x,st.y-center.y)+PI)/(2*PI);
    float dist_center = length(st-center);

    float womp_womp = -sin(u_time+sin(u_time)/2);
    float womp_womp2 = -sin(u_time-0.25+sin(u_time-0.75)/2);
    womp_womp = ((womp_womp+1)/2)*0.6*radius;
    womp_womp2 = ((womp_womp2+1)/2)*0.6*radius;
    float radius2 = radius + womp_womp2;
    radius += womp_womp;
    
    vec3 color = col_sea;
    
    angle_center += 0.03*sin(u_time*2*PI/15);
    radius += abs(radius*0.02*sin((angle_center+u_time/40)*2*PI*10));
    radius2 += abs(radius*0.02*sin((angle_center+u_time/40)*2*PI*10));
    
    float outer_medusa = step(dist_center, radius2);
    color = color*(1-outer_medusa)+col_med*outer_medusa;

    float outer_medusa2 = step(dist_center, radius2*0.96);
    color = color*(1-outer_medusa2)+col_sea*outer_medusa2;   

    float inner_medusa = step(dist_center, radius*0.92);
    color = color*(1-inner_medusa)+col_med*inner_medusa;

    float inner_medusa2 = step(dist_center, radius*0.88);
    color = color*(1-inner_medusa2)+col_sea*inner_medusa2;
    
    float radiuses = step(mod(angle_center, 0.02)*50, 0.3);
    radiuses = radiuses*outer_medusa*inner_medusa;
    float col_rad_intensity = smoothstep(0, radius*0.88, dist_center);
    vec3 col_rad = mix(col_sea, col_med, pow(col_rad_intensity, 3));
    color = color*(1-radiuses)+col_rad*radiuses;
    
    float medusa_face_dist = radius*0.3*abs(sin(angle_center*2*PI*2));
    medusa_face_dist = clamp(medusa_face_dist, radius*0.1, 1);
    float medusa_face = step(dist_center, medusa_face_dist);
    float medusa_face_not = step(dist_center, medusa_face_dist*3/4);;
    color = color*(1-medusa_face+medusa_face_not)
        +col_face*(medusa_face-medusa_face_not);

    gl_FragColor = vec4(color, 1);
}
