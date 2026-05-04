let balls = [];
let Rings = [];


let ballpicked = 0;
let lifestage = [1, 2, 3, 4];
let soundMode = false;
let colr = [];


function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  colr = [color(255, 220, 0),
  color(180, 255, 180),
  color(100, 150, 255),
  color(255, 80, 50),];
  //drawballs
  for (let i = 0; i < 10; i++) {
    balls.push(new Ball(colr[floor(i / 2)]));
  }
}

function draw() {
  background(20, 30, 50);
  //drawrings
  for (let i = 0; i < Rings.length; i++) {
    Rings[i].display();
  }
  //ballsclick
  if (soundMode == false) {
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].notClick == true) {
        balls[i].display();
        balls[i].update();
      }
    }
  }
}

function mousePressed() {
  //checkclick
  for (let i = 0; i < balls.length; i++) {
    balls[i].checkMouse(Rings);
  }
  if (ballpicked == 8) {
    soundMode = true;
  }
}

class Ball {
  constructor(clr) {
    this.x = random(50, width - 50);
    this.y = random(height * 0.5, height - 50);
    this.speedX = random(-2, 2);
    this.speedY = random(-1, 1);
    this.col = clr;
    this.notClick = true;
  }

  display() {
    noStroke();
    fill(this.col);
    circle(this.x, this.y, 50)
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 20 || this.x > width - 20) {
      this.speedX *= -1;
    }
    if (this.y < 20 || this.y > height - 20) {
      this.speedY *= -1;
    }
  }



  checkMouse() {
    if (dist(this.x, this.y, mouseX, mouseY) < 25 && this.notClick == true) {
      ballpicked += 1
      //lifestage
      let currentStage = floor((ballpicked - 1) / 2);
      //stage-thick
      let stageThick = lifestage[currentStage];
      //transform to ring
      Rings.push(new Ring(this.col, ballpicked, stageThick));
      //howmanycollected
      console.log("Total:", ballpicked, " Stage:", currentStage);
      //disappear
      this.notClick = false;
    }
  }
}

class Ring {
  constructor(c, order, thick) {
    this.col = c;
    this.r = order * 30 + 30;
    this.thickness = thick
  }

  display() {
    noFill();
    stroke(this.col);
    strokeWeight(this.thickness);
    circle(width / 2, height / 2, this.r * 2);
  }
}