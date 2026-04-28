let balls = [];
let Rings = [];
//sound
let notes = [
  261.63, 293.66, 329.63, 349.23, 392.0,
  440.0, 493.88, 523.25, 587.33, 659.25
];

// girl
let writing = [];
let curImage = 0;

//ring
let ballpicked = 0;
let lifestage = [1, 2, 3, 4];
let soundMode = false;
let colr = [];

//hand
let handPose;
let video;
let hands = [];
let pinch = 0;

//diary
let dryImages = [];
let dryTexts = [
  "2023.10.31\nRead a beautiful passage today: \nOn a clear night, find a spot with a wide horizon and set up a telescope; \nthere will always be a star flickering just for you.\nThe stars tonight are breathtaking.",
  "2024.6.14\nI fell ill today.\n Seeing the medicine bottles on the desk, I was suddenly reminded of \nhow my parents and I used to turn them into delicate wind chimes when \nI was little. \nThe weather is lovely today.",
  "2025.5.23\nFinals start tomorrow. \nPhysics has always been my Achilles' heel. \nI had a good cry, but the logic still escapes me.",
  "2024.5.1\nHeartbreaking news today\nthe math teacher from Class 6 has passed away. \nHe was a truly kind soul, so close to his retirement. \nEveryone is devastated.",
  "2024.8.31\nCelebrated my friend's birthday over lunch today. \nThe cake was divine. \nAs we finished the birthday song,\n the whole room seemed to rise in applause for her."
];
let displayMsg = "";
let displayTime = 0;

function preload() {
  //cam
  handPose = ml5.handPose();
  //girl
  for (let i = 1; i < 3; i++) {
    let filename = 'write' + i + '.PNG';
    writing.push(loadImage(filename));
  }

  //SIGN
  for (let i = 1; i <= 5; i++) {
    dryImages.push(loadImage('dry' + i + '.PNG'));
  }
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);

  colr = [
    color(255, 220, 0),
    color(100, 150, 255),
    color(255, 80, 50),
    color(180, 255, 180),
    color(100, 100, 255)
  ];

  //upload
  for (let i = 0; i < 10; i++) {
    let order = floor(i / 2);
    balls.push(new Ball(
      colr[order],
      dryImages[order],
      dryTexts[order],
      notes[i]
    ));
  }
}


function draw() {
  background(20, 30, 50);

  //grab
  if (hands.length > 0) {
    // Find the index finger tip and thumb tip
    let finger = hands[0].ring_finger_tip;
    let thumb = hands[0].thumb_tip;

    // Draw circles at finger positions
    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;
    // Calculate the pinch "distance" between finger and thumb
    let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

    // This circle's size is controlled by a "pinch" gesture
    fill(0, 255, 0, 200);
    stroke(0);
    strokeWeight(2);
    circle(centerX, centerY, pinch);

    //check
    for (let i = 0; i < balls.length; i++) {
      balls[i].checkGrab(centerX, centerY, pinch);
    }

    if (ballpicked == 8) {
      soundMode = true;
    }

    //ring
    for (let i = 0; i < Rings.length; i++) {
      Rings[i].display();
      Rings[i].checkHand(centerX, centerY);
      Rings[i].updateOsc();
    }
  }



  //signs
  if (soundMode == false) {
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].notClick == true) {
        balls[i].display();
        balls[i].update();
      }
    }
  }

  //girl
  imageMode(CENTER);
  image(writing[curImage], 400, 250, 600, 400);
  //framechange
  if (frameCount % 10 == 0) {
    curImage = (curImage + 1) % writing.length;
  }

  //diary display
  if (millis() < displayTime) {
    //
    push();
    fill(255);
    noStroke();
    textAlign(CENTER);
    textSize(18);
    //textbackground
    fill(0, 0, 0, 150);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 20, 630, 200, 10);

    fill(255);
    text(displayMsg, width / 2, height / 2 - 80);
    pop();
  }
}


//ball
class Ball {
  constructor(clr, img, txt, freq) {
    this.x = random(50, width - 50);
    this.y = random(height * 0.5, height - 50);
    this.speedX = random(-2, 2);
    this.speedY = random(-1, 1);

    this.col = clr;
    this.dryImg = img;
    this.infoText = txt;
    this.freq = freq;
    this.notClick = true;
  }

  display() {
    imageMode(CENTER);
    image(this.dryImg, this.x, this.y, 100, 100);
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

  checkGrab(centerX, centerY, pinch) {
    if (dist(this.x, this.y, centerX, centerY) < 30 && pinch < 60 && this.notClick == true) {
      ballpicked += 1;

      let currentStage = floor((ballpicked - 1) / 2);
      let stageThick = lifestage[currentStage];
      Rings.push(new Ring(this.col, ballpicked, stageThick, this.freq));
      console.log("Total:", ballpicked, " Stage:", currentStage);

      //show text
      displayMsg = this.infoText;
      displayTime = millis() + 7000;

      this.notClick = false;
    }
  }
}

class Ring {
  constructor(c, order, thick, freq) {
    this.col = c;
    this.r = order * 30 + 30;
    this.thickness = thick;
    //sound
    this.osc = new p5.Oscillator("sine");

    this.oscFreqValue = freq;
    this.osc.freq(this.oscFreqValue);

    this.oscFreqValue = freq;
    this.oscAmpValue = 0.0;
    this.osc.amp(0);
    this.osc.start();

  }

  display() {
    noFill();
    stroke(this.col);
    strokeWeight(this.thickness);
    circle(width / 2, height / 2, this.r * 2);
  }

  checkHand(handX, handY) {
    if (soundMode == true) {
      let d = dist(width / 2, height / 2, handX, handY);
      let offRing = abs(d - this.r);

      if (offRing < 15) {
        //sound
        this.oscAmpValue = 0.4;
      } else {
        this.oscAmpValue = 0;
      }
    } else {

      this.oscAmpValue = 0;
    }
  }

  updateOsc() {
    this.osc.amp(this.oscAmpValue, 0.1);
  }


}

function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

function mousePressed() {

}