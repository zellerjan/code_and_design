let handpose;
let video;
let hands = [];
let ratio;
let isModelReady = false;

// Pinch-Explosion
let pinches = [];

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
}

function draw() {
  background(0);

  push();
  translate(width, 0);
  scale(-1, 1);

  if (isModelReady && hands.length > 0) {
    hands.forEach((hand) => {
      // Pinch-Erkennung: Daumen + Zeigefinger oder Daumen + Mittelfinger
      let thumb = hand.keypoints[4];
      let index = hand.keypoints[8];
      let middle = hand.keypoints[12];

      let pinchDist1 = dist(thumb.x, thumb.y, index.x, index.y);
      let pinchDist2 = dist(thumb.x, thumb.y, middle.x, middle.y);

      if (pinchDist1 < 40 || pinchDist2 < 40) {
        pinches.push({
          startTime: millis(),
          x: (thumb.x + index.x + middle.x) / 3 * ratio,
          y: (thumb.y + index.y + middle.y) / 3 * ratio
        });
      }
    });
  }

  // Hintergrund-Pinch-Kreise
  let now = millis();
  pinches = pinches.filter(p => now - p.startTime < 1000); // nur 1 Sekunde aktiv
  pinches.forEach(p => {
    for (let i = 0; i < 40; i++) {
      fill(random(255), random(255), random(255), 80);
      noStroke();
      let r = random(50, 150);
      ellipse(p.x + random(-100, 100), p.y + random(-100, 100), r, r);
    }
  });

  pop();
}

function gotHands(results) {
  hands = results;
  if (hands.length > 0) isModelReady = true;
}
