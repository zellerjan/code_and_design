// init variables
let minSize = 50;
let maxSize; // depends on screen width
let circles = [];
let growing = [];
let colors = [
  [255, 0, 0, 120],     // red
  [0, 255, 0, 120],     // green
  [0, 0, 255, 120],     // blue
  [255, 255, 0, 120]    // yellow
];



function setup() {
  createCanvas(windowWidth, windowHeight);

  // creates slider 0 - 100
  growthSlider = createSlider(0, 50, 5, 1);
  chaosSlider = createSlider(0, 50, 0, 1);

  // no outlines for circles
  noStroke();

  // set initial circles
  for (let i = 0; i < 4; i++) {
    let difference = i * 20;
    circles[i] = minSize - difference;
    growing[i] = true;
  }
}



function draw() {

  background(255, 200);

  // position of slider in bottom center of screen
  growthSlider.position(windowWidth / 2 - 100, windowHeight - 100);
  chaosSlider.position(windowWidth / 2 - 100, windowHeight - 140);

  // set max size of circles
  maxSize = windowWidth + 200;

  // map set slider values
  let speed = map(growthSlider.value(), 0, 50, 1, 50);
  let chaos = map(chaosSlider.value(), 0, 50, 0, 10);

  // log values of speed and chaos
  // console.log('Chaos Value: ' + chaos);
  // console.log('Speed Value: ' + speed);

  // create text grow
  fill(0, 0, 0);
  textSize(300);
  textAlign(CENTER);
  text('GROW', windowWidth / 2 - 85, windowHeight / 2 + 105);

  for (let i = 0; i < 4; i++) {

    // different circles get different growth when chaos kicks in
    let growthRateWithChaos = speed + (i * chaos);

    // Grow or get smaller + Check if MaxSize reached
    if (growing[i]) {
      circles[i] += growthRateWithChaos;
      if (circles[i] >= maxSize) {
        growing[i] = false;
      }
    }
    else {
      circles[i] -= growthRateWithChaos;
      if (circles[i] <= minSize) {
        growing[i] = true;
      }
    }

    // create circle
    fill(...colors[i]);
    ellipse(windowWidth / 2, windowHeight / 2, circles[i], circles[i]);
  }

  // slider names
  fill(210);
  textSize(14);
  textAlign(RIGHT);
  text('Growth Speed', growthSlider.x - 10, growthSlider.y + 15);
  text('Difference (Chaos)', chaosSlider.x - 10, chaosSlider.y + 15);

}

// resize window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}