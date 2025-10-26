// init variables
let sizeWidth = 1;
let sizeHeight = 1;

let minSize = 50;
let maxSize; // depends on screen width
let circles = [];



function setup() {
  createCanvas(windowWidth, windowHeight);

  // creates slider 0 - 100
  growthSlider = createSlider(0, 10, 2, 0.1);
  chaosSlider = createSlider(0, 5, 0, 0.1);

  // no outlines for circles
  noStroke();


  for (let i = 0; i < 4; i++) {
    circles.push({
      size: minSize + i * 20,
      growing: true
    });
  }
}

function draw() {
  // position of slider in bottom center of screen
  growthSlider.position(windowWidth / 2 - 100, windowHeight - 100);
  chaosSlider.position(windowWidth / 2 - 100, windowHeight - 140);

  // map set slider values
  let growValue = map(growthSlider.value(), 0, 100, 1, 50);
  let chaosValue = map(chaosSlider.value(), 0, 100, 0, 300);

  let secondCircle = map(chaosValue, 100, 250, 0, 100);
  let thirdCircle = map(chaosValue, 200, 500, 0, 100);
  let fourthCircle = map(chaosValue, 100, 350, 0, 100);

  // Mouse for color 
  let mouseMap = map(mouseX, 0, 1600, 0, 255);


  background(255);

  // text grow in pink
  fill(0, 0, 0);
  textSize(300);
  textAlign(CENTER);
  text('GROW', windowWidth / 2 - 85, windowHeight / 2 + 105);

  // ellipse 
  fill(mouseMap, 0, 0);
  ellipse(windowWidth / 2, windowHeight / 2, sizeWidth, sizeHeight)

  fill(mouseMap, 255, 0);
  ellipse(windowWidth / 2, windowHeight / 2, sizeWidth - secondCircle, sizeHeight - secondCircle)

  fill(mouseMap, 255, 255);
  ellipse(windowWidth / 2, windowHeight / 2, sizeWidth - thirdCircle, sizeHeight - thirdCircle)

  fill(mouseMap, 100, 255);
  ellipse(windowWidth / 2, windowHeight / 2, sizeWidth - fourthCircle, sizeHeight - fourthCircle)


  // RESET
  if (sizeWidth >= windowWidth + 500) {
    sizeWidth = 1;
    sizeHeight = 1;
  }

  sizeWidth = sizeWidth + growValue;
  sizeHeight = sizeHeight + growValue;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}