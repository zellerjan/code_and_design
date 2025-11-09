// INIT VARIABLES ––––––––––––––––––––––––––––––––––––––––––––
let numRects = 10;
let rectW = 50;
let rectH = 50;

let rectX = [];
let rectY = [];
let rectSpeed = [];
let framesLeft = [];

let gameStarted = false;
let gamePaused = false;


// SETUP ––––––––––––––––––––––––––––––––––––––––––––––––––––
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // init rectangles
  for (let i = 0; i < numRects; i++) {
    rectX[i] = 10;
    rectY[i] = 100 + i * 80;
    rectSpeed[i] = random(4, 4.5); // set speed randomly
    framesLeft[i] = 0; // standard: 0 frames
  }
}

// DRAW –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
function draw() {
  background(255);

  for (let i = 0; i < numRects; i++) {

    // set color of rect based on red/green light
    if (gamePaused) {
      fill(200, 0, 0);
    }
    else {
      fill(0, 200, 0);
    }
    rect(rectX[i], rectY[i], rectW, rectH);


    // regular movement: if game live or frames left
    if (gameStarted && (!gamePaused || framesLeft[i] > 0)) {
      rectX[i] += rectSpeed[i];

      // bounce back
      if (rectX[i] > width - rectW || rectX[i] < 0) {
        rectSpeed[i] *= -1;
      }

      // count down frames left for late stoppers
      if (framesLeft[i] > 0) {
        framesLeft[i]--;
      }
    }
  }


  // INTRO INFOS
  if (!gameStarted) {
    fill(0);
    textFont('Courier New');

    // display title of game
    textSize(48);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("Red Light – Green Light", width / 2, height / 2 - 50);

    // display instruction to start
    push()
    fill(150);
    textSize(24);
    textStyle(NORMAL);
    text("Click to start the game", width / 2, height / 2);
    pop()

    // display how to play
    textSize(18);
    textStyle(ITALIC);
    text('Press "SpaceBar" to stop – Eliminate with "click"', width / 2, height / 2 + 100);

  }
  else {

    // winner message
    if (numRects === 1) {
      fill(0)
      textSize(48);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text("You've selected a winner!", width / 2, height / 2 - 50);

      // display screenshot + reload option
      textSize(18);
      textStyle(ITALIC);
      text('Press "s" to take a screenshot of your winner – Press "r" to start again', width / 2, height / 2);

    }
    // no winner message 
    else if (numRects === 0) {
      fill(0)
      textSize(48);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text("No winner... you've eliminated them all", width / 2, height / 2 - 50);

      // display screenshot + reload option
      textSize(18);
      textStyle(ITALIC);
      text('Press "r" to start again', width / 2, height / 2);
    }
    else {
      // show how to play on bottom in lightgray
      fill(150);
      textSize(18);
      textStyle(ITALIC);
      text('Press "SpaceBar" to stop – Eliminate with "click"', width / 2, height - 50);
    }
  }
}

// START GAME ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
function mouseClicked() {
  // Start game on click
  if (!gameStarted) {
    gameStarted = true;
  }
  else {
    for (let i = numRects - 1; i >= 0; i--) {
      // check if mouse is over rect
      if (mouseX > rectX[i] && mouseX < rectX[i] + rectW && mouseY > rectY[i] && mouseY < rectY[i] + rectH) {
        rectX.splice(i, 1);
        rectY.splice(i, 1);
        rectSpeed.splice(i, 1);
        framesLeft.splice(i, 1);
        numRects--;
      }
    }
  }
}

// KEY INPUTS ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
function keyPressed() {
  // save result as screenshot
  if (key == 's' || key == 'S') {
    saveCanvas('Jans-Aufgabe-2', 'png');
  }

  // reload site
  if (key === 'r' || key === 'R') {
    window.location.reload();
  }

  // space bar to pause game
  if (gameStarted && key == ' ') {
    gamePaused = !gamePaused;

    if (gamePaused) {
      let numContinue = floor(random(0, 4));
      for (let i = 0; i < numContinue; i++) {
        let j = floor(random(numRects));
        framesLeft[j] = floor(random(0, 15));
      }
    }
  }
}