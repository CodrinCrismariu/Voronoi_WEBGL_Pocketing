let points = [];
let colors = [];

let drag = false;
let drag_index = 0;
const epsilon_drag = 200;

function preload(){
  theShader = loadShader('assets/basic.vert', 'assets/basic.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  // shader() sets the active shader with our shader
  shader(theShader);

  if(drag) {
    points[drag_index * 2] = mouseX;
    points[drag_index * 2 + 1] = mouseY;
  }

  theShader.setUniform('height', height);
  theShader.setUniform('width', width);

  theShader.setUniform('points', points);
  theShader.setUniform('colors', colors);
  theShader.setUniform('num_points', points.length / 2);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
} 

function mousePressed() {

  for(let i = 0; i < points.length / 2; i++) {
    let x = points[i * 2] - mouseX;
    let y = points[i * 2 + 1] - mouseY;
    let dist = x*x + y*y;

    if(dist <= epsilon_drag) {
      drag = true;
      drag_index = i;

      break;
    }
  }

  if(!drag) {
    points = points.concat([mouseX, mouseY]);
    colors = colors.concat([random(0, 1), random(0, 1), random(0, 1)]);
  }
}

function mouseClicked() {
  drag = false;
}