/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new Eggie(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class Eggie {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.leg1turn = 1;
    this.leg2turn = -1;
    this.t = 0;
  }
  update() {
    this.x = this.startX + sin(frameCount * 0.03) * 50;
    this.y = this.startY + sin(frameCount * 0.05) * 30;

  }
  display() {

    push();
    translate(this.x, this.y);
    this.leg1();
    this.leg2();
    this.body1();
    this.body2();
    this.drawReferenceShapes()
    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }

  body1() {
    push();
    let n = 12;
    fill("white");
    beginShape();
    for (let i = 0; i < n; i++) {
      let angle = map(i, 0, n, 0, 360);
      let offset = map(i, 0, n, 0, 15);
      let rad = 60 + sin(frameCount / 10 + offset) * 10;
      let x = cos(radians(angle)) * rad;
      let y = -10 + sin(radians(angle)) * rad;
      curveVertex(x, y);
    }

    endShape(CLOSE);
    pop();
  }

  body2() {
    let xc = map(sin(frameCount / 10), -1, 1, -5, 5)
    push();
    noStroke();
    fill(255, 182, 46);
    circle(xc, -15, 50);
    pop();

    push();
    stroke("black");
    strokeWeight(3);
    line(-15 + xc, -18, -10 + xc, -20);
    line(10 + xc, -20, 15 + xc, -18);
    pop();

    push();
    noStroke();
    fill(252, 250, 240);
    circle(xc, -5, map(sin(frameCount / 10), -1, 1, 5, 10))
    pop();

    push();
    noStroke();
    fill(255, 224, 231);
    ellipse(-20 + xc, -9, 10, 5);
    ellipse(20 + xc, -9, 10, 5);
    pop();
  }

  leg1() {
    push();
    translate(0, 40);
    rotate(sin(frameCount * 0.05) * 0.5 * this.leg1turn);
    stroke(255, 182, 46);
    strokeWeight(4);
    noFill();
    line(-5, 0, -8, 30);
    line(-8, 30, -4, 55);
    stroke(255, 140, 0);
    strokeWeight(5);
    line(-4, 55, -12, 60);
    pop();
  }

  leg2() {
    push();
    translate(0, 40);
    rotate(sin(frameCount * 0.05) * 0.5 * this.leg2turn);
    stroke(255, 182, 46);
    strokeWeight(4);
    noFill();
    line(5, 0, 8, 30);
    line(8, 30, 4, 55);
    stroke(255, 140, 0);
    strokeWeight(5);
    line(4, 55, 12, 60);
    pop();
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/