let valueSlider;

let sizeWidth = 1;
let sizeHeight = 1;


function setup() {
  createCanvas(windowWidth, windowHeight);

  // creates Slider 0 - 100
  valueSlider = createSlider(0, 100, 0);
  valueDifferenceSlider = createSlider(100, 1000, 500);
  // position of Slider in bottom center of screen
  valueSlider.position(windowWidth / 2 - 100, windowHeight - 100);
  valueDifferenceSlider.position(windowWidth / 2 - 100, windowHeight - 140);
  

  noStroke();
}

function draw() {
  let outputGrow = valueSlider.value();
  let growSpeed = map(outputGrow, 0, 200, 1, 50);

  let differenceValue = valueDifferenceSlider.value();
  let secondCircle = map(differenceValue, 100, 250, 0, 100);
  let thirdCircle = map(differenceValue, 200, 500, 0, 100);
  let fourthCircle = map(differenceValue, 100, 350, 0, 100);

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

  // // add text in white
  // if (sizeWidth >= 1000) {
  //   fill(255, 255, 255);
  //   textSize(300);
  //   textAlign(CENTER);
  //   text('GROW', windowWidth / 2, windowHeight / 2 + 100);
  // }

  // RESET
  if (sizeWidth >= windowWidth + 500) {
    sizeWidth = 1;
    sizeHeight = 1;
  }

  sizeWidth = sizeWidth + growSpeed;
  sizeHeight = sizeHeight + growSpeed;
}