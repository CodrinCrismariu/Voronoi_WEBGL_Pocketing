// casey conchinha - @kcconch ( https://github.com/kcconch )
// louise lessel - @louiselessel ( https://github.com/louiselessel )
// more p5.js + shader examples: https://itp-xstory.github.io/p5js-shaders/
// this is a modification of a shader by adam ferriss
// https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/2_texture-coordinates/2-1_basic

precision mediump float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
varying vec2 vTexCoord;

const int max_points = 200;
const float vertex_stroke = 3.0;
const float point_stroke = 2.0;
const float epsilon = 5.0;

uniform float width;
uniform float height;

uniform int num_points;
uniform vec2 points[max_points];
uniform vec3 colors[max_points];

float dist(vec2 a, vec2 b) {
    return sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

float heron_area(vec2 a, vec2 b, vec2 c) {
    float A = dist(b, c);
    float B = dist(a, c);
    float C = dist(a, b);

    float S = (A + B + C) / 2.0;

    return sqrt(S * (S - A) * (S - B) * (S - C));
}

void main() {
    
    // copy the vTexCoord
    // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
    // we can use it to access every pixel on the screen
    vec2 coord = vec2(vTexCoord.x * width, (1.0 - vTexCoord.y) * height);
    gl_FragColor = vec4(1.0);

    if(num_points >= 2) {

        // get closest index
        float mn = dist(points[0], coord);
        vec2 first_point = points[0];
        vec3 c = vec3(0.0, 0.0, 0.0);

        for(int i = 0; i < max_points; i++) {
            if(i >= num_points) break;

            float d = dist(points[i], coord);

            if(mn > d) {
                mn = d;
                first_point = points[i];
                c = colors[i];
            }
        }

        //gl_FragColor = vec4(c, 1.0);

        mn = height * height + width * width;
        vec2 second_point = points[0];
        for(int i = 0; i < max_points; i++) {
            if(i >= num_points) break;
            if(points[i] == first_point) continue;

            float d = dist(points[i], coord);

            if(mn > d) {
                mn = d;
                second_point = points[i];
            }
        }

            // get height
        float h = heron_area(first_point, second_point, coord) / dist(first_point, second_point) * 2.0;
        float A = dist(first_point, coord);
        float B = dist(second_point, coord);

        float a = sqrt(A * A - h * h);
        float b = sqrt(B * B - h * h);
        
        if(abs(a - b) <= vertex_stroke) gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);

    }

    for(int i = 0; i < max_points; i++) {
        if(i >= num_points) break;
        float d = length(coord.xy - points[i]);

        if(d <= point_stroke) gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0 );
    }
    
    // x values for red, y values for green, both for blue
    
}
