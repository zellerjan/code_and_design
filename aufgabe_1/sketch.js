let valueSlider;

let sizeWidth = 10;
let sizeHeight = 10;


function setup() {
  createCanvas(windowWidth, windowHeight);

  // creates Slider 0 - 100
  valueSlider = createSlider(0, 100, 10);

  // position of Slider in bottom center of screen
  valueSlider.position(windowWidth / 2 - 100, windowHeight - 100);

  noStroke();
}

function draw() {
  background(255);

  // text grow in pink
  fill(255, 0, 255);
  textSize(300);
  textAlign(CENTER);
  text('GROW', windowWidth / 2, windowHeight / 2);


  // ellipse 
  fill(255, 0, 0);
  ellipse(windowWidth/2, windowHeight/2, sizeWidth, sizeHeight)

  

  if (sizeWidth >= 500) {
  // text grow in pink
  fill(255, 255, 255);
  textSize(300);
  textAlign(CENTER);
  text('GROW', windowWidth / 2, windowHeight / 2);

  }

  sizeWidth++;
  sizeHeight++;

}
