let scanned = [];
let plant;
let rain;
let line;

let curPlant = 0;
let curRain = 0;
let curLine = 0;
let PlantX = 300;
let PlantY = 400;

function preload() {
  for (let i = 1; i <= 7; i++) {
    scanned.push(loadImage("draw" + i + ".jpg"));
  }
}

function setup() {
  createCanvas(800, 500);

  eraseBg(scanned, 10);
  plant = crop(scanned, 0, 0, 490, 433);
  rain = crop(scanned, 1500, 569, 800, 900);
  line = crop(scanned, 121, 1117, 959, 1453);
}

function draw() {
  background(255);

  // examples: eye
  let dp = abs(mouseX - PlantX);
  if (dp < 80) {
    curPlant = floor((frameCount / 20) % plant.length);
  }

  image(
    plant[curPlant],
    PlantX, PlantY, 100, 100
  );



  // rain

  push();
  image(rain[curRain], mouseX - 50, mouseY - 50, 300, 300);
  curRain = floor((frameCount / 10) % rain.length);
  pop();


  //line
  push();
  let r = map(noise(frameCount * 0.01), 0, 1, 100, 255);
  let g = map(mouseX, 0, width, 0, 255);
  let b = map(mouseY, 0, height, 0, 255);
  tint(r, g, b);
  image(line[curLine], 50, 200, line[0].width * 0.3, line[0].height * 0.3);
  curLine = floor(map(sin(frameCount / 10), -1, 1, 0, line.length));
  pop();
}

// You shouldn't need to modify these helper functions:

function crop(imgs, x, y, w, h) {
  let cropped = [];
  for (let i = 0; i < imgs.length; i++) {
    cropped.push(imgs[i].get(x, y, w, h));
  }
  return cropped;
}

function eraseBg(imgs, threshold = 10) {
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    img.loadPixels();
    for (let j = 0; j < img.pixels.length; j += 4) {
      let d = 255 - img.pixels[j];
      d += 255 - img.pixels[j + 1];
      d += 255 - img.pixels[j + 2];
      if (d < threshold) {
        img.pixels[j + 3] = 0;
      }
    }
    img.updatePixels();
  }
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned
}
