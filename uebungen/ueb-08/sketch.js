let drehwinkel = 0;
let anzahl = 50;
let abstand;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  abstand = width / (anzahl - 1);
}

function draw() {
  background(255, 80);
  fill(0);
  rectMode(CENTER);

  for (let i = 0; i < anzahl; i = i + 1) {
    push();
    translate(i * abstand, height / 2);
    //Distanz zum Zeichnungsmittelpunkt
    let distanz = dist(mouseX, mouseY, i * abstand, height / 2);
    //Abhängig von der Distanz verschieben, bei viel Distanz gegen unten, bei wenig gegen oben
    let yposShift = map(distanz, 0, height, -100, 100);
    //Rotations- und Zeichenpunkt verschieben in der y-Achse 
    translate(0, yposShift);
    //rotieren
    rotate(drehwinkel);

    // Laenge der Linie abhängig von der Distanz
    let linienLaenge = map(distanz, 0, width, 500, 50);
    line(linienLaenge*-1, 0, linienLaenge, 0);
    ellipse(0, 0, 5);
    pop();

  }

  drehwinkel = drehwinkel + 1;
}


function keyPressed() {
  if (key == 's' || key == 'S') {
    saveCanvas('RotationInteraktion', 'png');
  }
}