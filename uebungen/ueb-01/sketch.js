let size = 50;
let mouseIsPressed = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(0)
}

function draw() {
  background(220, 10);

  if (mouseIsPressed) {
    if (size > 1 && size <= (windowWidth + 500)) {
      size = size + 10;
    }
    else {
      size = 50;
      mouseIsPressed = false;
    }
  }
  fill(random(0, 255), random(0, 50), random(0, 50));
  circle(mouseX, mouseY, size);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  mouseIsPressed = true;
}

