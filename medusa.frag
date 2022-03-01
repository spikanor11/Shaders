#version 330 core
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_time;

const float PI = acos(-1);

vec3 col_sea = vec3(0.0,0.1,0.2);
vec3 col_med = vec3(0.7,0.9,1.0);
vec3 col_face = vec3(0.8,1.0,0.4);

vec2 center = vec2(0.5);
//vec2 center = u_mouse/u_resolution;
float radius = 1*0.3; //1*0.3 is full scene

void main()
{
    //coordinates
    vec2 st = gl_FragCoord.xy/u_resolution;
    float angle_center = (atan(st.x-center.x,st.y-center.y)+PI)/(2*PI);
    float dist_center = length(st-center);

    //constants
    float radius_og = radius;
    vec3 col_mix_60 = mix(col_med, col_sea, 0.6);
    vec3 col_mix_80 = mix(col_med, col_sea, 0.8);
    float time = u_time*0.7;

    //medussy-movement
    //the outer ring has a delay to make the movement medussier
    float womp_womp = -sin(time+sin(time)/2);
    float womp_womp_outer = -1.6*sin(time-0.25+sin(time-1.5)/2)-0.6;
    womp_womp = ((womp_womp+1)/2)*0.6*radius;
    womp_womp_outer = ((womp_womp_outer+1)/2)*0.6*radius;

    float radius_outer = radius + womp_womp_outer;
    radius += womp_womp;
    
    //spin
    angle_center += 0.03*sin(time*2*PI/15);
    
    //sillouette effect
    float radius_insideness = smoothstep(radius_og, radius, radius_outer);
    radius_insideness = radius_insideness*2-1;
    radius += abs(radius*0.02*sin((angle_center+time/40)*2*PI*10));
    radius_outer += radius_insideness*abs(radius*0.02
            *sin((angle_center+time/40)*2*PI*10));
    
    //outer ring
    float medusa_radius_A = radius_outer;
    float medusa_radius_B = radius_outer*0.96;
    float ring_AB = step(dist_center, medusa_radius_A)
        - step(dist_center, medusa_radius_B);

    //inner ring
    float medusa_radius_C = radius*0.92;
    float medusa_radius_D = radius*0.88;
    float ring_CD = step(dist_center, medusa_radius_C)
        - step(dist_center, medusa_radius_D);
    float is_inner = step(dist_center, medusa_radius_D);

    //"wheel" radiuses of the medusa
    float radiuses = step(0.7,mod(angle_center, 0.02)*50);
    radiuses = radiuses*is_inner;
    float col_rad_intensity = smoothstep(0, medusa_radius_D, dist_center);
    vec3 col_rad = mix(col_sea, col_med, pow(col_rad_intensity,3));
    
    //smooth effect - radiuses
    float smooth_radius = 1-smoothstep(0,0.3,mod(angle_center, 0.02)*50);
    smooth_radius += smoothstep(0.3,0.7, mod(angle_center, 0.02)*50);
    smooth_radius -= radiuses;
    smooth_radius *= is_inner;
    vec3 col_inner_aux = mix(col_mix_80, col_mix_60, 
            pow(col_rad_intensity,3)); 
    vec3 col_inner = col_inner_aux*smooth_radius
        *(1-radiuses)+col_rad*radiuses;
    col_inner = max(col_inner, col_mix_80);

    //face
    float medusa_face_dist = radius*0.3*abs(sin(angle_center*2*PI*2));
    medusa_face_dist = clamp(medusa_face_dist, radius*0.1, 1);
    float medusa_face_inner = step(dist_center, medusa_face_dist);
    float medusa_face = medusa_face_inner - 
        step(dist_center, medusa_face_dist*3/4);
   
    //smooth effect - rings
    float smoothy =
        int(medusa_radius_B > medusa_radius_C) *
        smoothstep(medusa_radius_B, medusa_radius_C, dist_center) +
        int(medusa_radius_D > medusa_radius_A) *
        smoothstep(medusa_radius_A, medusa_radius_D, dist_center);
    float is_between = 
        int(medusa_radius_B > medusa_radius_C) *
        (step(dist_center, medusa_radius_B) - 
        step(dist_center, medusa_radius_C)) +
        int(medusa_radius_D > medusa_radius_A) *
        (step(dist_center, medusa_radius_D) -
         step(dist_center, medusa_radius_A));
    
    //smooth effect - silouette
    float max_rad = max(medusa_radius_A, medusa_radius_C);
    float smooth_silouette = smoothstep(max_rad*1.1, max_rad, dist_center);

    //smooth effect - face
    float medusa_face_smooth = 
        smoothstep(medusa_face_dist*1.2, medusa_face_dist, dist_center);
    medusa_face_smooth -= medusa_face_inner;
    medusa_face_smooth += 
          smoothstep(medusa_face_dist*3/4*0.6,
                    medusa_face_dist*3/4, dist_center) -
             step(medusa_face_dist*3/4, dist_center);
    
    //colors
    vec3 color = col_sea;
    color = color*(1-is_inner)+col_inner*is_inner;
    color = color*(1-ring_CD)+col_med*ring_CD;
    color = color + col_mix_60*ring_AB;
    color += mix(col_sea, col_mix_60, smoothy)*is_between;
    color =
        int(dist_center < max_rad) * color +
        int(dist_center > max_rad)
        * mix(col_sea, col_mix_80, smooth_silouette);
    color = clamp(color, col_sea, col_med);
    color = color*(1-medusa_face)+col_face*(medusa_face);
    color = mix(color, mix(color,col_face,0.5),  medusa_face_smooth);
    gl_FragColor = vec4(color, 1);
}
