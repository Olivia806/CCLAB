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
let noiseX = 0;
let noiseY = 500;
let rushX = 0;
let rushY = 0;
let movement;
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
    speed = 0.005;
    trashX = random(100, 700);
    trashY = random(200, 400);
    trashX2 = random(100, 700);
    trashY2 = random(200, 400);
    FishX = random(100, 700);
    FishY = random(100, 400);
    bubbleFeed = false;
}

function draw() {
    background(220);
    drawBackground();

    //fish initial grow 
    currentSize += 0.0001;

    //trash
    push();
    trashXn = trashX + sin(frameCount * 0.02) * 15;
    trashYn = trashY + cos(frameCount * 0.03) * 10;
    let dMoTr = dist(mouseX, mouseY, trashXn, trashYn);
    fill(dMoTr < 70 ? "red" : color(7, 50, 135));
    drawTrash(trashXn, trashYn, 1);
    pop();

    //trash
    push();
    trashXn2 = trashX2 + sin(frameCount * 0.02) * 15;
    trashYn2 = trashY2 + cos(frameCount * 0.03) * 10;
    let dMoTr2 = dist(mouseX, mouseY, trashXn2, trashYn2);
    fill(dMoTr2 < 70 ? "red" : color(7, 50, 135));
    drawTrash(trashXn2, trashYn2, 1);
    pop();

    //trash hurt fish
    let dFiTr = dist(FishX, FishY, trashXn, trashYn);
    if (dFiTr < 40) {
        currentSize = max(currentSize - 0.05, minSize);
        trashX = random(100, 700);
        trashY = random(100, 400);
    }
    let dFiTr2 = dist(FishX, FishY, trashXn2, trashYn2);
    if (dFiTr2 < 40) {
        currentSize = max(currentSize - 0.05, minSize);
        trashX2 = random(100, 700);
        trashY2 = random(100, 400);
    }

    //fish scared
    let dMoFi = dist(mouseX, mouseY, FishX, FishY);
    if (dMoFi < 50 && scaredStartTime === 0) {
        scaredStartTime = frameCount;
        FishisScared = true;
    }

    //swim fast
    if (scaredStartTime !== 0) {
        speed = 0.02;
    }

    //not scared
    if (scaredStartTime !== 0 && frameCount - scaredStartTime > 60 * 1.5) {
        scaredStartTime = 0;
        FishisScared = false;
        speed = 0.005;
        rushX = 0;
        rushY = 0;
    }

    //fish swim away
    if (FishisScared) {

        if (mouseX < FishX) {
            rushX = 2.5;
        } else if (mouseX > FishX) {
            rushX = - 2.5;
        }
        if (mouseY < FishY) {
            rushY = 2.5;
        } else if (mouseY > FishY) {
            rushY = - 2.5;
        }

    }

    //fish move direction
    let direX = (noise(noiseX) - 0.5) * 2;
    let direY = (noise(noiseY) - 0.5) * 2;

    //moving scale
    if (FishisScared) {
        movement = 5;
    } else {
        movement = 2;
    }

    //fish location
    FishX += direX * movement + rushX + 1;
    FishY += direY * movement * 0.5 + rushY + 0.5;

    //noise change
    noiseX += speed;
    noiseY += speed;

    //bounce
    if (FishX > 780) {
        FishX = 780;
        rushX = -2.5;
    } else if (FishX < 20) {
        FishX = 20;
        rushX = 2.5;
    }

    if (FishY > 480) {
        FishY = 480;
        rushY = -1.5;
    } else if (FishY < 20) {
        FishY = 20;
        rushY = 1.5;
    }

    drawCreature(FishX, FishY);
    //bubble natural movement
    bubbleY = bubbleY - 1;
    let offset = sin(frameCount * 0.05) * 3;
    bubbleX = bubbleX + offset;
    drawBubble(bubbleX, bubbleY);
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

    //feed the fish
    if (mouseIsPressed) {
        if (dFiBu < 300 && dFiBu > 10) {
            bubbleX = lerp(bubbleX, FishX, 0.05);
            bubbleY = lerp(bubbleY, FishY, 0.05);
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
    scale(fishScale);


    //scared sign
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
    push();
    fill(131, 102, 140); //#836699
    ellipse(0, 0, 180, 140);
    pop();

    //dots
    push();
    for (let j = 0; j < 8; j++) {
        let yDot = map(j, 0, 8, -55, 70);
        let dotSize = map(sin(frameCount * 0.1 + j), -1, 1, 5, 12);
        fill(150, 174, 217, 180);
        circle(
            35 + sin(map(j, 0, 8, radians(0), radians(180))) * 10,
            yDot,
            dotSize
        );
    }
    pop();

    push();
    for (let j = 0; j < 8; j++) {
        let yDot = map(j, 0, 8, -45, 50);
        let dotSize = map(sin(frameCount * 0.1 + j), -1, 1, 5, 10);
        fill(160, 181, 219, 180);
        circle(
            60 + sin(map(j, 0, 8, radians(0), radians(180))) * 12,
            yDot,
            dotSize
        );
    }
    pop();

    push();
    for (let j = 0; j < 8; j++) {
        let yDot = map(j, 0, 8, -62, 80);
        let dotSize = map(sin(frameCount * 0.1 + j), -1, 1, 5, 12);
        fill(140, 168, 219, 180);
        circle(10 + sin(map(j, 0, 8, radians(0), radians(180))) * 6, yDot, dotSize);
    }
    pop();

    push();
    for (let j = 0; j < 8; j++) {
        let yDot = map(j, 0, 8, -62, 80);
        let dotSize = map(sin(frameCount * 0.1 + j), -1, 1, 5, 12);
        fill(125, 158, 219, 180);
        circle(
            -10 + sin(map(j, 0, 8, radians(0), radians(180))) * -4,
            yDot,
            dotSize
        );
    }
    pop();

    push();
    for (let j = 0; j < 8; j++) {
        let yDot = map(j, 0, 8, -55, 70);
        let dotSize = map(sin(frameCount * 0.1 + j), -1, 1, 5, 12);
        fill(114, 151, 219, 180);
        circle(
            -35 + sin(map(j, 0, 8, radians(0), radians(180))) * -8,
            yDot,
            dotSize
        );
    }
    pop();

    push();
    for (let j = 0; j < 8; j++) {
        let yDot = map(j, 0, 8, -45, 50);
        let dotSize = map(sin(frameCount * 0.1 + j), -1, 1, 5, 10);
        fill(101, 143, 219, 180);
        circle(-60 + sin(map(j, 0, 8, radians(0), radians(180))) * -12,
            yDot,
            dotSize
        );
    }
    pop();
    //
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
    textSize(40);
    textAlign(CENTER);
    text("♺", 0, 0);
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
            let sinWave = sin(x1 * 0.02 + t + y1 * 0.1) * 20;
            let noiseWave = noise(x1 * 0.01, y1 * 0.02, t) * 30;
            let waveY = y1 + (sinWave + noiseWave) * change;
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