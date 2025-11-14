let handpose;
let video;
let hands = [];
let ratio;
let isModelReady = false;

// Party Overlay
let overlayColor;
let lastColorChange = 0;
let colorInterval = 100; // 0.5s

function preload() {
  handpose = ml5.handPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  ratio = width / video.width;

  handpose.detectStart(video, gotHands);

  overlayColor = color(255, 0, 0, 25); // initial transparent
}

function draw() {
  background(0);

  push();
  translate(width, 0);
  scale(-1, 1);

  image(video, 0, 0, video.width * ratio, video.height * ratio);

  if (isModelReady && hands.length > 0) {
    let hand = hands[0];
    drawHandPoints(hand);

    if (isRocknRoll(hand)) {
      console.log("Rock'n'Roll Handzeichen erkannt!");

      if (millis() - lastColorChange > colorInterval) {
        overlayColor = color(random(255), random(255), random(255), 50);
        lastColorChange = millis();
      }

      fill(overlayColor);
      noStroke();
      rect(0, 0, width, height);
    }
  }

  pop();
}

/**
 * Callback für HandPose
 */
function gotHands(results) {
  hands = results;
  if (hands.length > 0) {
    isModelReady = true;
  }
}

/**
 * Alle 21 Keypoints zeichnen
 */
function drawHandPoints(hand) {
  for (let j = 0; j < hand.keypoints.length; j++) {
    let keypoint = hand.keypoints[j];
    fill(0, 255, 0);
    noStroke();
    circle(keypoint.x * ratio, keypoint.y * ratio, 10);
  }
}

/**
 * Prüft Rock'n'Roll-Handzeichen
 */
function isRocknRoll(hand) {
  let wrist = hand.keypoints[0];

  function distToWrist(idx) {
    let kp = hand.keypoints[idx];
    return dist(kp.x * ratio, kp.y * ratio, wrist.x * ratio, wrist.y * ratio);
  }

  // Abstände
  let indexDist = distToWrist(8);   // Zeigefinger
  let middleDist = distToWrist(12); // Mittelfinger
  let ringDist = distToWrist(16);   // Ringfinger
  let pinkyDist = distToWrist(20);  // Kleinfinger

  // console.log(indexDist);
  // console.log(middleDist);
    

  // Faust-Regeln: mittlerer & ringfinger nah, index & pinky weit
  if (middleDist < 400 && ringDist < 400 && indexDist > 350 && pinkyDist > 350) {
    return true;
  }

  return false;
}
