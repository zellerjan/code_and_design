/**
 * HandPose Boilerplate mit ml5.js
 * 
 * Dieses Sketch erkennt Hände über die Webcam und zeichnet die erkannten Keypoints.
 * Es dient als Ausgangspunkt für eigene Hand-Tracking-Projekte.
 * 
 * Dokumentation: https://docs.ml5js.org/#/reference/handpose
 * 
 * Jede Hand hat 21 Keypoints (0-20):
 * - 0: Handgelenk
 * - 1-4: Daumen
 * - 5-8: Zeigefinger
 * - 9-12: Mittelfinger
 * - 13-16: Ringfinger
 * - 17-20: Kleiner Finger
 */

// Globale Variablen
let handpose;           // Das ml5.js HandPose-Modell
let video;              // Die Webcam
let hands = [];         // Array mit allen erkannten Händen
let ratio;              // Skalierungsfaktor zwischen Video und Canvas
let isModelReady = false; // Flag, ob das Modell geladen und Hände erkannt wurden
let detectedGesture = '';
let modelInitFailed = false;

// Finger-Index (ml5 handpose landmark indices)
const TIP = { THUMB:4, INDEX:8, MIDDLE:12, RING:16, PINKY:20 };

// Pinch-Detection State (pro Hand)
let pinchState = [];      // 'none' | 'maybe' | 'pinched'
let pinchTimer = [];      // ms
let smoothedD = [];       // geglättete, normalisierte Distanz
let pinchStartPos = [];   // {x,y}
let lastPinchPos = [];    // {x,y}

// Interaktiver Kreis (wird basierend auf Pinch-Grösse skaliert)
let interactiveCircle = {
  x: null,
  y: null,
  maxSize: 300,
  minSize: 40,
  size: 300
};

// Thresholds / Parameter (anpassen bei Bedarf)
const START_THRESH = 0.06;   // normalized distance to start pinch
const RELEASE_THRESH = 0.09; // normalized distance to release (hysteresis)
const MAYBE_MS = 80;         // ms to confirm pinch
const CLICK_MS = 200;        // max ms for click
const LONGPRESS_MS = 600;    // ms for longpress
const SMOOTH_ALPHA = 0.2;    // smoothing factor for distance


/**
 * Lädt das HandPose-Modell vor dem Setup
 * Diese Funktion wird automatisch vor setup() ausgeführt
 */
function preload() {
  // kein preload nötig; ml5.handpose wird im setup initialisiert
}

/**
 * Initialisiert Canvas und Webcam
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Performanceoptimierung
  
  // Webcam einrichten
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Versteckt das Standard-Video-Element
  
  // Berechne Skalierungsfaktor für Video-zu-Canvas-Anpassung
  ratio = width / video.width;
  
  // Starte Hand-Erkennung mit ml5.handpose
  // (ml5.handpose nimmt das Video-Element als Eingabe und feuert 'predict' Events)
  // do not try to init immediately — wait until video is ready
  if (video && video.elt) {
    // if video element readyState is sufficient, init now
    if (video.elt.readyState >= 2) {
      initHandpose();
    } else {
      // wait for loadeddata
      video.elt.addEventListener('loadeddata', () => initHandpose());
      // fallback: also try after a short timeout
      setTimeout(() => { if (!handpose && !modelInitFailed) initHandpose(); }, 1500);
    }
  } else {
    // fallback: try a bit later
    setTimeout(() => { if (!handpose && !modelInitFailed) initHandpose(); }, 500);
  }


// robust init function with verbose logging
function initHandpose() {
  console.log('initHandpose: video ready?', !!(video && video.elt), 'video.elt.readyState=', video && video.elt ? video.elt.readyState : 'no-elt');
  console.log('ml5 available?', typeof ml5 !== 'undefined');
  if (typeof ml5 !== 'undefined') console.log('ml5 keys:', Object.keys(ml5));
  try {
    if (typeof ml5 === 'undefined') throw new Error('ml5 not loaded');

    // try common names
    const apiNames = ['handpose','handPose'];
    let created = false;
    for (let name of apiNames) {
      if (ml5[name]) {
        console.log('Using ml5.'+name+' to create model');
        handpose = ml5[name](video, modelReady);
        created = true;
        break;
      }
    }
    if (!created) throw new Error('No ml5 handpose factory found');

    console.log('handpose model object keys:', Object.keys(handpose || {}));

    if (handpose && typeof handpose.on === 'function') {
      console.log('Using handpose.on("predict") API');
      handpose.on('predict', gotHands);
    } else if (handpose && typeof handpose.predict === 'function') {
      console.log('Using handpose.predict API — starting predict loop');
      (async function predictLoop() {
        try {
          const res = await handpose.predict(video.elt || video);
          if (res) gotHands(res);
        } catch (e) { console.error('handpose.predict error', e); }
        requestAnimationFrame(predictLoop);
      })();
      isModelReady = true;
    } else if (handpose && typeof handpose.estimateHands === 'function') {
      console.log('Using handpose.estimateHands API — starting estimate loop');
      (async function estimateLoop() {
        try {
          const res = await handpose.estimateHands(video.elt || video);
          if (res) gotHands(res);
        } catch (e) { console.error('handpose.estimateHands error', e); }
        requestAnimationFrame(estimateLoop);
      })();
      isModelReady = true;
    } else {
      throw new Error('handpose model has no known API methods');
    }
  } catch (e) {
    console.error('Failed to init handpose in initHandpose():', e);
    modelInitFailed = true;
  }
}
  // initiale Zustände (sicherheitshalber für mehrere Hände)
  for (let i = 0; i < 4; i++) {
    pinchState[i] = 'none';
    pinchTimer[i] = 0;
    smoothedD[i] = 1.0;
    pinchStartPos[i] = {x:0,y:0};
    lastPinchPos[i] = {x:0,y:0};
  }

  // setze Default-Position des interaktiven Kreises in die Mitte
  interactiveCircle.x = width / 2;
  interactiveCircle.y = height / 2;
}

function modelReady() {
  console.log('Handpose model ready');
  isModelReady = true;
}

/**
 * Hauptzeichnungs-Loop
 */
function draw() {
  background(0);

  // Spiegle die Darstellung horizontal (für intuitivere Interaktion)
  push();
  translate(width, 0);
  scale(-1, 1);

  //Zeige das Video (optional)
  image(video, 0, 0, video.width * ratio, video.height * ratio);
  
  // Wenn Modell-Init fehlgeschlagen ist, zeige Fehlermeldung statt absturz
  if (modelInitFailed) {
    push();
    resetMatrix();
    fill(255, 50, 50);
    textSize(18);
    textAlign(CENTER, CENTER);
    text('Fehler: ml5 handpose konnte nicht initialisiert werden. Prüfe die Konsole.', width/2, height/2);
    pop();
    pop();
    return;
  }

  // Zeichne Handpunkte falls vorhanden
  if (isModelReady) {
    drawHandPoints();

    // Update Pinch-Logik pro Hand
    if (hands && hands.length > 0) {
      for (let i = 0; i < hands.length; i++) {
        updatePinch(hands[i], i, deltaTime);
      }
    }
  }

  // Debug-UI / Overlay (nicht gespiegelt)
  pop(); // restore from mirror
  push();
  fill(255);
  noStroke();
  textSize(20);
  textAlign(LEFT, TOP);
  text('Geste: ' + detectedGesture, 10, 10);

  // Zeichne interaktiven Kreis basierend auf erster Hand (falls vorhanden)
  drawInteractiveCircle();
  pop();
  
  pop();
}

/**
 * Callback-Funktion für HandPose-Ergebnisse
 * Wird automatisch aufgerufen, wenn neue Hand-Daten verfügbar sind
 * 
 * @param {Array} results - Array mit erkannten Händen
 */
function gotHands(results) {
  hands = results;
  
  // Setze Flag, sobald erste Hand erkannt wurde
  if (hands.length > 0) {
    isModelReady = true;
  }
}

// Hilfsfunktion: liefert x,y eines Landmarks (unterstützt unterschiedliche ml5-Versionen)
function getLandmarkXY(hand, idx) {
  if (!hand) return null;
  // ml5 handpose liefert häufig `landmarks` als [[x,y,z],...]
  if (hand.landmarks && hand.landmarks[idx]) {
    return { x: hand.landmarks[idx][0], y: hand.landmarks[idx][1] };
  }
  // ältere/andere Struktur: keypoints mit {x,y}
  if (hand.keypoints && hand.keypoints[idx]) {
    const kp = hand.keypoints[idx];
    return { x: kp.x, y: kp.y };
  }
  return null;
}

function normalizeDistance(d, hand) {
  // normalisiere Abstand anhand Handgröße: Wrist(0) -> Middle_MCP(9)
  const w0 = getLandmarkXY(hand, 0);
  const m9 = getLandmarkXY(hand, 9);
  let base = video.width; // fallback
  if (w0 && m9) {
    base = dist(w0.x, w0.y, m9.x, m9.y);
    if (base < 1) base = video.width;
  }
  return d / base;
}

function updatePinch(hand, handIndex, dt) {
  // dt in ms (p5.deltaTime)
  const thumb = getLandmarkXY(hand, TIP.THUMB);
  const index = getLandmarkXY(hand, TIP.INDEX);
  if (!thumb || !index) return;

  // Distanz in Pixel
  const d = dist(thumb.x, thumb.y, index.x, index.y);
  const dNorm = normalizeDistance(d, hand);

  // smoothing
  smoothedD[handIndex] = SMOOTH_ALPHA * dNorm + (1 - SMOOTH_ALPHA) * smoothedD[handIndex];

  // Pinch-Mittelpunkt
  const pinchPos = { x: (thumb.x + index.x) / 2, y: (thumb.y + index.y) / 2 };
  lastPinchPos[handIndex] = pinchPos;

  // State machine
  if (pinchState[handIndex] === 'none') {
    if (smoothedD[handIndex] < START_THRESH) {
      pinchState[handIndex] = 'maybe';
      pinchTimer[handIndex] = 0;
      pinchStartPos[handIndex] = pinchPos;
    }
  } else if (pinchState[handIndex] === 'maybe') {
    pinchTimer[handIndex] += dt;
    if (smoothedD[handIndex] > RELEASE_THRESH) {
      // false alarm
      pinchState[handIndex] = 'none';
      pinchTimer[handIndex] = 0;
    } else if (pinchTimer[handIndex] > MAYBE_MS) {
      // confirmed pinch
      pinchState[handIndex] = 'pinched';
      pinchTimer[handIndex] = 0;
      onPinchStart(handIndex, pinchPos);
    }
  } else if (pinchState[handIndex] === 'pinched') {
    if (smoothedD[handIndex] > RELEASE_THRESH) {
      // release
      onPinchEnd(handIndex, pinchTimer[handIndex]);
      pinchState[handIndex] = 'none';
      pinchTimer[handIndex] = 0;
    } else {
      pinchTimer[handIndex] += dt;
      onPinchMove(handIndex, pinchPos, pinchTimer[handIndex]);
    }
  }

  // Visualisierung: Linie & Pinch-Kugel
  push();
  noFill();
  stroke(255, 200, 0);
  strokeWeight(2);
  line(thumb.x * ratio, thumb.y * ratio, index.x * ratio, index.y * ratio);
  noStroke();
  fill(255, 120, 0, 180);
  const size = map(smoothedD[handIndex], 0, 0.15, 24, 6, true);
  circle(pinchPos.x * ratio, pinchPos.y * ratio, size);
  pop();
}

// Event-Handler: anpassen für deine Anwendung
function onPinchStart(handIndex, pos) {
  detectedGesture = 'Pinch Start';
  console.log('Pinch Start', handIndex, pos);
  // hier: z.B. markiere Objekt, beginne Drag
}

function onPinchMove(handIndex, pos, duration) {
  // duration: ms seit Pinch-Beginn
  detectedGesture = 'Pinching (' + Math.round(duration) + 'ms)';
  // hier: z.B. verschiebe Objekt zur Position pos (Mittelpunkt zwischen Daumen&Zeige)
}

function onPinchEnd(handIndex, duration) {
  if (duration < CLICK_MS) {
    detectedGesture = 'Click';
    console.log('Pinch Click', handIndex, duration);
    // trigger click action
  } else if (duration >= LONGPRESS_MS) {
    detectedGesture = 'Long Press';
    console.log('Pinch Long Press', handIndex, duration);
    // trigger long-press action
  } else {
    detectedGesture = 'Pinch Released';
    console.log('Pinch Release', handIndex, duration);
    // drop
  }
}

// Zeichnet einen interaktiven Kreis, dessen Größe vom Pinch-Abstand abhängt.
function drawInteractiveCircle() {
  // Verwende die erste Hand (falls vorhanden); sonst volle Grösse
  let d = smoothedD[0] || 1.0;
  // Mappe d (normalisiert) zu Kreisgrösse: kleiner d -> kleinere Kugel
  // clamp-Bereich anpassen falls nötig
  const mapped = map(d, 0.02, 0.15, interactiveCircle.minSize, interactiveCircle.maxSize, true);
  interactiveCircle.size = mapped;

  // Zeichne (im gleichen, gespiegelten Koordinatensystem)
  push();
  noStroke();
  fill(50, 150, 255, 180);
  circle(interactiveCircle.x * ratio, interactiveCircle.y * ratio, interactiveCircle.size);
  // optional: Outline
  stroke(255);
  strokeWeight(2);
  noFill();
  circle(interactiveCircle.x * ratio, interactiveCircle.y * ratio, interactiveCircle.size + 6);
  pop();
}

/**
 * Zeichnet alle erkannten Hand-Keypoints
 * Jede Hand hat 21 Keypoints (siehe Kommentar oben)
 */
function drawHandPoints() {
  // Durchlaufe alle erkannten Hände (normalerweise max. 2)
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    
    // Durchlaufe alle 21 Keypoints einer Hand
    // Unterstütze `landmarks` und `keypoints` Strukturen
    const count = (hand.landmarks && hand.landmarks.length) ? hand.landmarks.length : (hand.keypoints ? hand.keypoints.length : 0);
    for (let j = 0; j < count; j++) {
      const p = getLandmarkXY(hand, j);
      if (!p) continue;
      // Zeichne Keypoint als grüner Kreis
      fill(0, 255, 0);
      noStroke();
      circle(p.x * ratio, p.y * ratio, 10);
    }
  }
}

