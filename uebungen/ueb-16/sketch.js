let posX = 0;
let posY;
let angle;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
   background(0);
}

function draw() {
 
  

  // xPosition in einen Winkel umwandeln für Sinusfunktion
  // xPosition 0 -> Winkel 0
  // xPosition width -> Winkel 180 Grad, versuche das anzupassen und auf 360 Grad zu mappen, schau, was passiert
  angle = map(posX, 0, width, 0, 180);
  posY = sin(angle) * height; // Sinuswert für den Winkel berechnen und mit Amplitude 200 multiplizieren
  //Versuche hier einen anderen Wert als Amplitude zu nehmen statt height und beobachte, was passiert


  ellipse(posX, posY, 10, 10);

  
  if (posX < width - 5) {
    posX = posX + 5;
  }
}