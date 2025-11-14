/**
 * HandPose + Faust/Offene-Hand-Interaktion
 *
 * Kreis auf der Mittelfinger-Spitze wächst oder schrumpft je nach Handöffnung.
 * Farbe ändert sich bei jedem Öffnen/Schliessen basierend auf Handposition.
 */

let handpose;
let video;
let hands = [];
let ratio;
let isModelReady = false;

// Kreis
let circleSize = 20;
let minSize = 50;    // Mindestgröße
let maxSize = 400;   // maximale Größe
let circleColor;
let lastStateClosed = null; // für Farbwechsel

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

  // Initialfarbe
  circleColor = color(255, 200, 0);
}

function draw() {
  background(0);

  push();
  translate(width, 0);
  scale(-1, 1);

  image(video, 0, 0, video.width * ratio, video.height * ratio);

  if (isModelReady && hands.length > 0) {
    drawHandPoints();

    let hand = hands[0];
    let openness = getThumbPinkyDistance(hand);

    // Schwellen
    let closedThreshold = 80;  
    let openThreshold = 120;

    // Zustand Faust/Offene Hand
    let isClosed = openness < closedThreshold;

    // Farbwechsel bei Zustandsänderung
    if (lastStateClosed !== null && isClosed !== lastStateClosed) {
      let wrist = hand.keypoints[0];
      let xNorm = wrist.x / video.width; // 0 bis 1
      circleColor = color(lerp(50, 255, xNorm), random(100, 255), random(100, 255));
    }
    lastStateClosed = isClosed;

    // Kreisgröße anpassen
    if (isClosed) {
      circleSize = lerp(circleSize, minSize, 0.2);
    } else if (openness > openThreshold) {
      circleSize += 6;
      if (circleSize > maxSize) circleSize = maxSize;
    }

    // Kreis auf Mittelfinger-Spitze zeichnen (Keypoint 12)
    let midTip = hand.keypoints[12];
    let cx = midTip.x * ratio;
    let cy = midTip.y * ratio;

    fill(circleColor);
    noStroke();
    circle(cx, cy, circleSize);
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
function drawHandPoints() {
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x * ratio, keypoint.y * ratio, 10);
    }
  }
}

/**
 * Abstand zwischen Daumenspitze (4) und Kleinfingerspitze (20)
 */
function getThumbPinkyDistance(hand) {
  let thumb = hand.keypoints[4];
  let pinky = hand.keypoints[20];
  return dist(
    thumb.x * ratio, thumb.y * ratio,
    pinky.x * ratio, pinky.y * ratio
  );
}
