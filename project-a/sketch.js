//background parameter
let s = 5;
let d;
let x, y;
let x2, y2, w;
//fish parameter
let FishX, FishY;
let currentSize = 0.2;
let maxSize = 1;
let minSize = 0.2;
let speed;
let ax = 2;
let ay = 3;
//bubble parameter
let bubbleX, bubbleY;
//scared parameter
let scaredStartTime = 0;
let FishisScared = false;
//trash parameter
let trashX, trashY;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
}

function draw() {
    background(0);
    noStroke();
    push();
    translate(width / 2, height / 2);
    rotate(sin(frameCount * 0.01));
    beginShape();
    for (let i = 0; i < TWO_PI; i += TWO_PI / vNumber) {
        let offset = noise(
            smoothness * sin(i),
            smoothness * cos(i),
            frameCount * 0.01
        );
        offset = map(offset, 0, 1, -R * 0.2, R * 0.2);
        let radius = R + offset;
        x = radius * cos(i);
        y = radius * sin(i);
        curveVertex(x, y);
    }
    endShape(CLOSE);
    pop();
}

