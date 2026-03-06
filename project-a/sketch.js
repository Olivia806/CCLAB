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

    bubbleX = random(100, 800);
    bubbleY = 500;
    speed = 0.002;
    trashX = random(100, 700);
    trashY = random(200, 400);
    FishX = random(0, 800);
    FishY = random(0, 500);
}

function draw() {
    background(220);
    drawBackground();
    //fish initial size
    currentSize += 0.0001;
    //trash
    trashXn = trashX + sin(frameCount * 0.02) * 15;
    trashYn = trashY + cos(frameCount * 0.03) * 10;
    let dMoTr = dist(mouseX, mouseY, trashXn, trashYn);

    if (dMoTr < 70) {
        fill("red");
    } else {
        fill(7, 50, 135);
    }
    drawTrash(trashXn, trashYn, 1);
    let dFiTr = dist(FishX, FishY, trashXn, trashYn);
    if (dFiTr < 40) {
        currentSize -= 0.05;
        if (currentSize < minSize) {
            currentSize = minSize;
        }
        trashX = random(100, 700);
        trashY = random(100, 400);
    }
    //fish scared
    let dMoFi = dist(mouseX, mouseY, FishX, FishY);
    if (dMoFi < 50) {
        if (scaredStartTime == 0) {
            scaredStartTime = frameCount;
            FishisScared = true;
        }
    }
    //fish speedup
    if (scaredStartTime != 0) {
        speed = 0.008;
    }

    if (frameCount - scaredStartTime > 60 * 2) {
        scaredStartTime = 0;
        FishisScared = false;
        speed = 0.002;
    }
    //在scared过后，并不会在原地停下来，还会刷新新的坐标 看着好奇怪
    FishX += (noise(frameCount * speed) - 0.5) * 3 + ax
    FishY += (noise(frameCount * speed * 2 + 900) - 0.5) * 4 + ay;

    //opposite direction
    if (FishisScared == true) {
        if (mouseX < FishX) {
            ax = 5;
        } else if (mouseX > FishX) {
            ax = -5;
        }
    }
    //turn around

    if (FishX > 790) {
        ax = ax * -1
        FishX = 780
    } else if (FishX < 0) {
        ax = ax * -1
        FishX = 2
    }

    if (FishY > 490 || FishY < 0) {
        ay = ay * -1
    }

    drawCreature(FishX, FishY);
    //bubble natural movement
    drawBubble(bubbleX, bubbleY);
    bubbleY = bubbleY - 1;
    let offset = sin(frameCount * 0.05) * 3;
    bubbleX = bubbleX + offset;
    //fish eat bubble
    let dFiBu = dist(FishX, FishY, bubbleX, bubbleY);

    if (dFiBu < 20) {
        //fish bigger
        currentSize += 0.1;
        //reset bubble 
        bubbleY = height;
        bubbleX = random(100, 800);
        //size constraint
        if (currentSize > maxSize) {
            currentSize = maxSize;
        }
        if (currentSize < minSize) {
            currentSize = minSize;
        }
    }

    //bubble reaches margin
    if (bubbleY < 0) {
        bubbleY = height;
        bubbleX = random(100, 800);
    }
    drawTorch(mouseX - 10, mouseY + 5, 90);
}



function drawCreature(x, y) {
    push();
    translate(x, y);
    let d = dist(mouseX, mouseY, x, y);
    let fishScale = currentSize;
    //fish speed up
    if (mouseIsPressed == true) {
        scale(-fishScale, fishScale);
        speed = 0.004;
        currentSize = currentSize - 0.001;
        if (currentSize < minSize) {
            currentSize = minSize;
        }
    } else {
        scale(fishScale);
    }

    //scared
    if (FishisScared == true) {
        textSize(80);
        textAlign(CENTER);
        text("‼️", 0, -80);
    }

    drawTail(70, 0, 0, 1);
    drawBody(0, 0, 0, 1.0);
    drawFin1(0, 0, 0, 1);
    drawFin2(0, 0, 0, -1);
    drawFinmid(-2, 0, map(sin(frameCount * 0.2), -1, 1, radians(-15), radians(15)), 1);

    pop();
}

function drawBody(x, y, a, s) {
    push();
    noStroke();
    translate(x, y);
    console.log(mouseX - width / 2, mouseY - height / 2);
    rotate(a);
    scale(s);
    //body
    fill(131, 102, 153); //#836699
    ellipse(0, 0, 180, 140);
    //mouse
    push();
    fill(224, 132, 149);
    rotate(radians(-50));
    ellipse(-75, -25, 12, 20);
    fill(199, 117, 132);
    ellipse(
        -75,
        -25,
        5 + map(sin(frameCount * 0.02), -1, 1, 0, 4),
        9 + map(sin(frameCount * 0.02), -1, 1, 0, 4)
    );
    pop();
    //eye
    push();
    fill(255, 249, 237);
    circle(-50, -5, 30);
    pop();
    //eye1
    push();
    fill("black");
    //circle(-52,-5,10);
    circle(map(mouseX, 0, width, -52, -45), map(mouseY, 0, height, -10, 0), 10);
    pop();

    pop();
}

function drawFin1(x, y, a, s) {
    push();
    noStroke();
    translate(x, y);
    rotate(a);
    scale(s);
    fill(176, 102, 232);
    let t = frameCount * 0.02;
    let FinupX = 8 + map(noise(t + 10000), 0, 1, -20, 20);
    let FinupY = -87 + map(noise(t + 40000), 0, 1, -5, 5);
    beginShape();
    curveVertex(-40, -48);
    curveVertex(-45, -58);
    curveVertex(-23, -73);
    curveVertex(FinupX, FinupY);
    curveVertex(30, -80);
    curveVertex(44, -60);
    curveVertex(7, -61);
    curveVertex(-40, -48);
    endShape();
    pop();
}

function drawFin2(x, y, a, s) {
    push();
    noStroke();
    translate(x, y);
    rotate(a);
    scale(s);
    fill(176, 102, 232);
    let t = frameCount * 0.02;
    let FinupX = 8 - map(noise(t + 10000), 0, 1, -20, 20);
    let FinupY = -87 - map(noise(t + 40000), 0, 1, -5, 5);
    beginShape();
    curveVertex(-40, -48);
    curveVertex(-42, -58);
    curveVertex(-23, -73);
    curveVertex(FinupX, FinupY);
    curveVertex(30, -80);
    curveVertex(44, -60);
    curveVertex(7, -61);
    curveVertex(-40, -48);
    endShape();
    pop();
}

function drawFinmid(x, y, a, s) {
    push();
    noStroke();
    translate(x, y);
    rotate(a);
    scale(s);
    beginShape();
    fill(176, 102, 232);
    curveVertex(0, 0);
    curveVertex(0, 0);
    curveVertex(15, -20);
    curveVertex(30, -26);
    curveVertex(40, 0);
    curveVertex(30, 26);
    curveVertex(15, 20);
    curveVertex(0, 0);
    endShape();

    beginShape();
    fill(181, 144, 209);
    curveVertex(0, 0);
    curveVertex(0, 0);
    curveVertex(12, -15);
    curveVertex(25, -20);
    curveVertex(35, 0);
    curveVertex(25, 20);
    curveVertex(12, 15);
    curveVertex(0, 0);
    endShape();

    beginShape();
    fill(194, 167, 214);
    curveVertex(0, 0);
    curveVertex(0, 0);
    curveVertex(8, -10);
    curveVertex(22, -15);
    curveVertex(35, 0);
    curveVertex(22, 15);
    curveVertex(8, 10);
    curveVertex(0, 0);
    endShape();
    pop();
}

function drawTail(x, y, a, s) {
    push();
    translate(x, y);
    rotate(a);
    scale(s);
    let t = frameCount * 0.5;
    scale(map(sin(t), -1, 1, 0.5, 1.2), 1);
    //swing
    let noiseY = map(noise(t + 5000), 0, 1, -20, 20);
    let noiseX = map(noise(t + 8000), 0, 1, -5, 5);
    noStroke();
    //out
    fill(176, 102, 232);
    beginShape();
    curveVertex(0, 0);
    curveVertex(0, 0);
    curveVertex(60, -70);
    curveVertex(110 + noiseX, noiseY);
    curveVertex(60, 70);
    curveVertex(0, 0);
    curveVertex(0, 0);
    endShape(CLOSE);

    //in
    fill(210, 170, 235);
    beginShape();
    curveVertex(0, 0);
    curveVertex(0, 0);
    curveVertex(40, -50);
    curveVertex(80 + noiseX * 0.5, noiseY * 0.5);
    curveVertex(40, 50);
    curveVertex(0, 0);
    curveVertex(0, 0);
    endShape(CLOSE);

    pop();
}

// function drawBubble(x,y,swing){
//   push();
//   colorMode(RGB);
//   let bubbleX = x * 0.05 + sin(swing) * 0.5;
//   circle(bubbleX, y, 20);
//   pop();

function drawBubble(x, y) {
    push();
    colorMode(RGB);
    translate(x, y);
    noStroke();
    fill(213, 245, 245);
    circle(0, 0, 20);
    fill("white");
    circle(4, -5, 5);
    pop();
}

function drawTrash(x, y, spd) {
    push();
    translate(x, y);
    rotate(radians(frameCount * spd));
    noStroke();
    square(0, 0, 20);
    pop();
}

function drawBackground() {
    push();
    colorMode(HSB);
    for (let x = s / 2; x < width; x += s) {
        for (let y = s / 2; y < height; y += s) {
            let noiseVal = noise(
                x / 500 + frameCount / 600,
                y / 500 + frameCount / 40
            );
            circle(x, y, s);
            d = dist(mouseX, mouseY, x, y);
            let off = noise(frameCount / 20) * 50;
            //手电筒的光时大时小
            if (d < 30 + off) {
                fill(map(noiseVal, 0, 1, 60, 65), 80, 100);
            } else if (d < 60 + off) {
                fill(map(noiseVal, 0, 1, 50, 60), 40, 80);
            } else if (d < 80 + off) {
                fill(map(noiseVal, 0, 1, 60, 65), 20, 60);
            } else {
                fill(map(noiseVal, 0, 1, 140, 290), 80, 60);
            }
        }
    }
    //波浪
    push();
    colorMode(RGB);
    noFill();
    strokeWeight(2);
    stroke(191, 223, 224);
    let t = frameCount * 0.03;

    for (let y1 = 50; y1 < height; y1 += 40) {
        beginShape();
        let d = mouseY - y1;
        if (d < 0) {
            d = -d;
        }
        let change = map(d, 0, 150, 1.5, 0.5);
        if (change < 0.5) {
            change = 0.5;
        }
        for (let x1 = 0; x1 < width; x1 += 10) {
            let sineWave = sin(x1 * 0.02 + t + y1 * 0.1) * 20;
            let noiseWave = noise(x1 * 0.01, y1 * 0.02, t) * 30;
            let waveY = y1 + (sineWave + noiseWave) * change;
            vertex(x1, waveY);
        }
        endShape();
    }
    pop();

    //海草
    push();
    let speed = frameCount * 0.03;
    let seaweed = map(mouseX, 0, width, 10, 60);

    for (let x2 = 80; x2 < width; x2 += 60) {
        for (let y2 = 0; y2 < 18; y2++) {
            let move = sin(speed + x2 * 0.05 + y2 * 0.3) * seaweed * (y2 / 18);
            let w = noise(x2 * 0.05, y2 * 0.2) * 20;
            noStroke();
            fill("green");
            circle(x2 + move, height - 20 - y2 * 12, w);
        }
    }
    pop();

    pop();
}

function drawTorch(x, y, a) {
    push();
    translate(x, y);
    rotate(a);
    textSize(40);
    textAlign(CENTER);
    text("🔦", 0, 0);
    pop();

}

