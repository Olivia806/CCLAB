let balls = [];
let Rings = [];
let visible = 0;
//let curT = displayMsg.substring(0, visible)

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

//state
let state = "intro";

//diary
let dryImages = [];
let dryTexts = [
  "2023.10.31-Moved\nRead a beautiful passage today: \nOn a clear night, find a spot with a wide horizon and set up a telescope; \nthere will always be a star flickering just for you.\nThe stars tonight are breathtaking.",

  "2024.6.14-Memory\nI fell ill today.\n Seeing the medicine bottles on the desk, I was suddenly reminded of \nhow my parents and I used to turn them into delicate wind chimes when \nI was little. \nThe weather is lovely today.",

  "2024.5.23-Anxious\nFinals start tomorrow. \nPhysics has always been my Achilles' heel. \nI had a good cry, but the logic still escapes me.",

  "2025.9.1-Cried\nHeartbreaking news today\nthe math teacher from Class 6 has passed away. \nHe was a truly kind soul, so close to his retirement. \nEveryone is devastated.",

  "2025.5.20-Happy\nCelebrated my friend's birthday over lunch today. \nThe cake was divine. \nAs we finished the birthday song,\n the whole room seemed to rise in applause for her.",

  "2023.12.27-Moved\nToday was just... wonderful.\nGames in PE, the chatter during breaks, \nand a beam of sunlight in math class.\nSimple things, but they made my whole day feel so light.",

  "2023.12.24-Memory\nFrom age three to twelve, I devoutly believed Santa Claus was real.\nUntil one day, I saw a post from my friend's mother:\nThere is no Santa; there are only parents who love you.",

  "2023.6.19-Anxious\nToday I have to choose my high school electives.\nIm so conflicted—\nI still dont know where I truly belong.",

  "2025.6.20-Cired\nGraduation day.\nThe ceremony was beautiful, yet I couldn't stop crying.\nI really don't want to say goodbye to my classmates.",

  "2025.11.2-Happy\nExams are coming, \nbut Mom took me to a concert in Hangzhou anyway.\nI am beyond happy!"

];
let displayMsg = "";
let displayTime = 0;
let myFont;
let colorMsg;

//start page
let Startimg1;
let startTxt = "This is a diary from the year 2026.\n\nYou open it, and the signature has faded beyond \nrecognition, while the pages inside are blank. \nAt that moment, you notice faint, drifting fragments \nof memory floating around you—\neach one giving off a soft, singular sound.\n \nSo you reach out to catch one—"
let Startimg2;
let startTxt2 = "CLICK TO START"

//final message
let finalMsg = "2026.4.23\nI think life is like a song.\nEvery person we meet and every event we experience is a note in this melody.";
let showFinalText = false;
let finalTextEndTime = 0;
let finalVisible = 0;

function preload() {
  //cam
  handPose = ml5.handPose({ flipped: true });
  //girl
  for (let i = 1; i < 3; i++) {
    let filename = 'write' + i + '.PNG';
    writing.push(loadImage(filename));
  }
  //SIGN
  for (let i = 1; i <= 10; i++) {
    dryImages.push(loadImage('dry' + i + '.PNG'));
  }
  //starting page
  Startimg1 = loadImage("start1.png");
  Startimg2 = loadImage("start2.png");
  //fontstyle
  myFont = loadFont('style.ttf');
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);

  colr = [
    color(255, 220, 0),
    color(180, 255, 180),
    color(100, 150, 255),
    color(100, 100, 255),
    color(255, 80, 50),
    color(255, 220, 0),
    color(180, 255, 180),
    color(100, 150, 255),
    color(100, 100, 255),
    color(255, 80, 50),
  ];

  //upload
  for (let i = 0; i < 10; i++) {
    balls.push(new Ball(
      colr[i],
      dryImages[i],
      dryTexts[i],
      notes[i]
    ));
  }
}


function draw() {
  background(20, 30, 50);
  //intro part
  if (state == 'intro') {
    drawIntro();
    return;
  }
  //main interaction
  if (state == 'main') {
    drawmain();
    return;
  }
  //end
  if (state == 'end') {
    drawEnd();
    return;
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
    if (dist(this.x, this.y, centerX, centerY) < 30 && pinch < 30 && this.notClick == true) {
      ballpicked += 1;

      let currentStage = floor((ballpicked - 1) / 2);
      let stageThick = lifestage[currentStage];
      Rings.push(new Ring(this.col, ballpicked, stageThick, this.freq));
      console.log("Total:", ballpicked, " Stage:", currentStage);

      //girl position change

      //show text

      displayMsg = this.infoText;
      colorMsg = this.col
      displayTime = millis() + 3000;
      visible = 0;
      //visible = 0;

      this.notClick = false;
    }
  }
}

class Ring {
  constructor(c, order, thick, freq) {
    this.col = c;
    this.r = order * 20 + 80;
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
    let grow = sin(frameCount * 0.05 + this.r) * 2;
    let shine = map(sin(frameCount * 0.03 + this.r), -1, 1, 100, 255);
    noFill();
    stroke(this.col, shine);
    strokeWeight(this.thickness);
    circle(width / 2, height / 2, (this.r + grow) * 2);
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
  if (state == 'intro') {
    state = 'main';
  }

}

function drawIntro() {
  image(Startimg1, 530, 230, 240, 240);
  image(Startimg2, 40, 290, 170, 120);
  push();
  fill(255);
  textFont('Courier New');
  textSize(20);
  text(startTxt, 50, 50);
  pop();

  push();
  fill(255, map(sin(frameCount * 0.05), -1, 1, 50, 255));
  textFont('Courier New');
  textSize(24);
  text(startTxt2, width / 2 - 100, 350);
  pop();
}

function drawmain() {

  //final text
  if (showFinalText == true) {
    background(20, 30, 50);
    let curFinalT = finalMsg.substring(0, finalVisible); // 打字机处理
    push();
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont(myFont);
    textSize(24);
    text(curFinalT, width / 2, height / 2, 600, 300);
    pop();
    //appear
    if (frameCount % 5 == 0) {
      if (finalVisible < finalMsg.length) {
        finalVisible++;
        finalTextEndTime = millis() + 3000;
      }
    }
    if (finalVisible >= finalMsg.length && millis() > finalTextEndTime) {
      showFinalText = false;
      soundMode = true;
    }
    return;
  }

  //grab
  if (hands.length > 0) {
    // Find the tip
    let finger = hands[0].middle_finger_tip;
    let thumb = hands[0].middle_finger_mcp;

    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;

    let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

    //draw circle
    if (millis() > displayTime) {
      push();
      fill(255, 255, 255, 15);
      noStroke();
      circle(centerX, centerY, pinch);
      pop();
    }

    //check
    if (millis() > displayTime && ballpicked < 8) {
      for (let i = 0; i < balls.length; i++) {
        balls[i].checkGrab(centerX, centerY, pinch);
      }
    }

    //final message:after8balls, before sound,after all diaries showed
    if (ballpicked == 8 && soundMode == false && showFinalText == false && millis() > displayTime) {
      showFinalText = true;
      finalVisible = 0;
      finalTextEndTime = millis() + 3000;
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
    if (millis() > displayTime) {
      for (let i = 0; i < balls.length; i++) {
        if (balls[i].notClick == true) {
          balls[i].display();
          balls[i].update();
        }
      }
    }
  }

  //girl
  imageMode(CENTER);
  //image(writing[curImage], 400, 250, 600, 400);
  //framechange
  if (frameCount % 10 == 0) {
    curImage = (curImage + 1) % writing.length;
  }

  //diary display
  //push();
  if (millis() < displayTime) {
    //
    let curT = displayMsg.substring(0, visible)


    noStroke();
    textAlign(CENTER);
    textSize(18);

    //textbackground
    if (frameCount % 5 == 0) {
      if (visible < displayMsg.length) {
        visible++;
        displayTime = millis() + 3000;
      }
    }
    //girl change
    image(writing[curImage], 650, 380, 510, 340);

    fill(0, 0, 0, 150);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 20, 630, 200, 10);
    push();
    textFont(myFont);
    fill(colorMsg);
    text(curT, width / 2, height / 2 - 80);
    pop();



  } else {
    //girl normal position
    image(writing[curImage], 400, 250, 510, 340);
  }
  // pop();

  //to the end
  if (soundMode == true) {
    push();
    textAlign(CENTER);
    textFont('Courier New');

    //play
    fill(255, 200);
    textSize(22);
    text("Now, play the song of your lives.", width / 2, height - 80);

    //end
    fill(255, 120);
    textSize(16);
    text("(Press SPACE to end)", width / 2, height - 40);
    pop();
  }
}

function drawEnd() {
  background(20, 30, 50);
  imageMode(CENTER);
  image(Startimg1, width / 2, height / 2, 300, 300);
  fill(255);
  textAlign(CENTER);
  textFont(myFont);
  textSize(20);
  text("The end of the diary.", width / 2, height - 50);
}

function keyPressed() {
  if (key === ' ' && soundMode == true) {
    state = 'end';
    soundMode == false;
  }
}