// init variables
let numRects = 10;
let rectW = 50;
let rectH = 50;

let rectX = [];
let rectY = [];
let rectSpeed = [];

let gameStarted = false;
let gamePaused = false;



function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // init rectangles
  for (let i = 0; i < numRects; i++) {
    rectX[i] = 10;
    rectY[i] = 100 + i * 80;
    rectSpeed[i] = random(4, 4.5); // set speed randomly
  }
}




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

    // regular movement of rectangles
    if (!gamePaused) {
      for (let i = 0; i < numRects; i++) {
        rectX[i] += rectSpeed[i];

        // bounce back on right side
        if (rectX[i] > width - rectW || rectX[i] < 0) {
          rectSpeed[i] *= -1;
        }
      }
    }

    // show how to play on bottom in lightgray
    fill(150);
    textSize(18);
    textStyle(ITALIC);
    text('Press "SpaceBar" to stop – Eliminate with "click"', width / 2, height - 50);
  }

  // console.log(numRects);
}

// Start game on click
function mouseClicked() {
  if (!gameStarted) {
    gameStarted = true;
  }
  else {
    // check if rect got eliminated and reduce numRects
    for (let i = numRects - 1; i >= 0; i--) {
      if (mouseX > rectX[i] && mouseX < rectX[i] + rectW &&
        mouseY > rectY[i] && mouseY < rectY[i] + rectH) {
        rectX.splice(i, 1);
        rectY.splice(i, 1);
        rectSpeed.splice(i, 1);
        numRects--;
      }
    }
  }
}

function keyPressed() {
  // save result as screenshot
  if (key == 's' || key == 'S') {
    saveCanvas('Jans-Aufgabe-2', 'png');
  }

  // space bar to pause game
  if (gameStarted && key == ' ') {
    gamePaused = !gamePaused;
  }
}