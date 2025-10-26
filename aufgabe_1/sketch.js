// init variables
let minSize = 50;
let maxSize; // depends on screen width
let circles = [];
let growing = true;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // creates slider 0 - 100
  growthSlider = createSlider(0, 50, 1, 1);
  chaosSlider = createSlider(0, 50, 0, 1);

  // no outlines for circles
  noStroke();

  background(255);

  for (let i = 0; i < 4; i++) {
    // set initial difference
    let difference = i * 10;
    circles[i] = minSize - difference;

  }
}

function draw() {

  background(255);
  // position of slider in bottom center of screen
  growthSlider.position(windowWidth / 2 - 100, windowHeight - 100);
  chaosSlider.position(windowWidth / 2 - 100, windowHeight - 140);

  // set max size of circles
  maxSize = windowWidth + 200;

  // map set slider values
  let speed = map(growthSlider.value(), 0, 50, 1, 10);
  let chaos = map(chaosSlider.value(), 0, 50, 0, 10);

  console.log(chaos);

  // // Mouse for color 
  // let mouseMap = map(mouseX, 0, 1600, 0, 255);


  // create text grow
  fill(0, 0, 0);
  textSize(300);
  textAlign(CENTER);
  text('GROW', windowWidth / 2 - 85, windowHeight / 2 + 105);

  for (let i = 0; i < 4; i++) {

    // different circles get different growth when chaos kicks in
    let growthRate = speed + (i * chaos);

    // let smallest circle grow the biggest
    let nr = 3 - i;

    if (growing) {
      circles[nr] += growthRate;
    }
    else {
      circles[nr] -= growthRate;
    }

    // create circle
    fill(50 + i * 50, 255 * i / 4, 255 - i * 50);
    ellipse(windowWidth / 2, windowHeight / 2, circles[i], circles[i]);


    // check if maxSize reached 
    if (growing && circles[i] >= maxSize) {
      growing = false;
    }
    else if (!growing && circles[i] <= minSize) {
      growing = true;
    }


  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}