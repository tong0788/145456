let video;
let facemesh;
let predictions = [];
const indices1 = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
const indices2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 步驟一：繪製第一組紅色線條
    stroke(255, 0, 0); // 紅色
    strokeWeight(15); // 線條粗細
    noFill();
    beginShape();
    for (let i = 0; i < indices1.length; i++) {
      const idx = indices1[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape();

    // 步驟三：繪製第二組紅色線條
    beginShape();
    for (let i = 0; i < indices2.length; i++) {
      const idx = indices2[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 步驟四：填滿第二組內部黃色
    fill(255, 255, 0, 200); // 半透明黃色
    noStroke();
    beginShape();
    for (let i = 0; i < indices2.length; i++) {
      const idx = indices2[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 步驟五：填滿第一組與第二組之間綠色
    fill(0, 255, 0, 150); // 半透明綠色
    noStroke();
    beginShape();
    for (let i = 0; i < indices1.length; i++) {
      const idx = indices1[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    for (let i = indices2.length - 1; i >= 0; i--) {
      const idx = indices2[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}