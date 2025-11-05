let posX, posY;

let xBewegung, yBewegung;

let durchmesser=0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  posX = width / 2;
  posY = height / 2;

  durchmesser = random(10, 60);

  //Bewegung in x- und y-Richtung mit zufaelligen Werten initialisieren
  xBewegung = random(-3, 3);
  yBewegung = random(-3, 3);

  background(0);
  fill(255, 20)
}

function draw() {
  
  noStroke();
  ellipse(posX, posY, durchmesser, durchmesser);

  //Bewegen der Kugel
  posX = posX + xBewegung;
  posY = posY + yBewegung;

  //Umkehren der Bewegungsrichtung bei Kollision mit Rand

 

  //Rechter Rand 
  if (posX > width) {
    xBewegung = -xBewegung ;
    durchmesser = random(20, 100);
  }

   // Linker Rand
  if (posX < 0) {
    xBewegung = -xBewegung ;
    durchmesser = random(20, 100);
  }

  //Unterer Rand
  if (posY > height) {
    yBewegung = -yBewegung ;
    durchmesser = random(20, 100);
  }

  //Oberer Rand
  if (posY < 0) {
    yBewegung = -yBewegung ;
    durchmesser = random(20, 100);
  }

  
}