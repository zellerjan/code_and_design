let valueSlider;


function setup() {
  createCanvas(windowWidth, windowHeight);

  valueSlider = createSlider(-10, 38, 9);
  valueSlider.position(100, 100);
}

function draw() {

  // let inputValue = mouseX;
  // let inputValue2 = mouseY;

  let outputSliderValue = valueSlider.value();
  console.log(outputSliderValue);

  let inputMin = -10;
  // let inputMax = windowWidth;
  let inputMax = 38
  let inputMax2 = windowHeight;

  let outputMin = 0;
  let outputMax = 255;

  let outputValue = map(outputSliderValue, inputMin, inputMax, outputMin, outputMax);
  // let outputValue = map(inputValue, inputMin, inputMax, outputMin, outputMax);
  // let outputValue2 = map(inputValue2, inputMin, inputMax2, outputMin, outputMax);

  background(outputValue, 100, 255);
}
