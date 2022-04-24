let mapOfPoints = {};
let mapOf2dPoints = {};
let connections = [];
const translation = { x: 100, y: 100, z: 0 };
let distance = 10;
let rotateDeg = 0;
let scale = 1;
const {
  perspectiveProjection,
  rotateX3d,
  rotateZ3d,
  rotateY3d,
  translatePoint,
  rotatePointAroundLine,
  scalePoint,
} = Matrix();

const canvasWidth = 800;
const canvasHeight = 800;

function setup() {
  const observerVector = createVector(canvasWidth / 2, canvasHeight);

  console.log(observerVector);
  createCanvas(canvasWidth, canvasHeight);
  fill(0);

  document.getElementById("inputfile").addEventListener("change", function () {
    var fr = new FileReader();
    fr.onload = function () {
      const lines = fr.result.split("\n");
      let titleCount = 0;

      lines.forEach((line) => {
        if (/id/.test(line)) {
          titleCount++;
        } else if (titleCount === 1) {
          const [id, x, y, z] = line.split(" ").map((str) => Number(str));
          mapOfPoints[id] = { x, y, z };
          Object.entries(mapOfPoints).forEach(([key, value]) => {
            // const rotated2 = rotateY3d(value, 30);

            // const rotated1 = rotateZ3d(rotated2, 30);

            // const rotated = rotateX3d(rotated1, 30);

            mapOf2dPoints[key] = perspectiveProjection(
              translatePoint(value, translation),
              distance
            );
          });
        } else if (titleCount === 2) {
          const [from, to] = line.split(" ");
          connections.push({ from, to });
        }
      });
    };

    fr.readAsText(this.files[0]);
  });

  document.getElementById("rotation").addEventListener("change", function (e) {
    rotateDeg = e.target.value;
    const rotationValue = e.target.value;
    Object.entries(mapOfPoints).forEach(([key, value]) => {
      const rotated2 = rotateY3d(
        translatePoint(value, translation),
        rotationValue
      );

      //   const rotated1 = rotateZ3d(rotated2, rotationValue);

      //   const rotated = rotateX3d(rotated1, rotationValue);
      console.log(rotated2);
      mapOf2dPoints[key] = perspectiveProjection(rotated2, distance);
    });
    console.log(mapOf2dPoints);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      rotateDeg += 0.1;
    } else if (e.key === "ArrowLeft") {
      rotateDeg -= 0.1;
    } else if (e.key === "Enter") {
      distance += 10;
    } else if (e.key === "p") {
      distance -= 10;
    } else if (e.key === "q") {
      scale += 0.1;
    } else if (e.key == "w") {
      scale -= 0.1;
    }
    // const rotationValue = e.target.value;
    // Object.entries(mapOfPoints).forEach(([key, value]) => {
    //   const rotated2 = rotateY3d(
    //     translatePoint(value, translation),
    //     rotationValue
    //   );

    //   //   const rotated1 = rotateZ3d(rotated2, rotationValue);

    //   //   const rotated = rotateX3d(rotated1, rotationValue);
    //   console.log(rotated2);
    //   mapOf2dPoints[key] = perspectiveProjection(rotated2, distance);
    // });
    // console.log(mapOf2dPoints);
  });
}

let rotationValue = 0;
let change = 0.1;
function draw() {
  clear();
  translate(width / 2, height / 2);
  frameRate(5);
  //   console.log(rotationValue);
  if (connections.length) {
    Object.entries(mapOfPoints).forEach(([key, value]) => {
      //   console.log(
      //     translatePoint(value, { x: 200 - value.x, y: 400 - value.y, z: 0 })
      //   );
      //   console.log(
      //     rotateY3d(
      //       translatePoint(value, { x: 200 - value.x, y: 400 - value.y, z: 0 }),
      //       rotationValue
      //     )
      //   );
      const rotated2 = translatePoint(
        rotateY3d(
          translatePoint(value, { x: 200 - value.x, y: 400 - value.y, z: 0 }),
          rotationValue
        ),
        { x: value.x - 200, y: value.y - 400, z: 0 }
      );

      const rotateObjY = { A: 0, B: 1, C: 0 };
      const rotateObjX = { A: 1, B: 1, C: 0 };
      const T1 = { x: width / 2, y: height, z: 0 };

      const scaled = scalePoint(value, scale);

      const rotatedPointY = rotatePointAroundLine(
        scaled,
        T1,
        rotateObjY,
        rotateDeg
      );
      const rotatedPointX = rotatePointAroundLine(
        scaled,
        T1,
        rotateObjX,
        rotateDeg
      );

      //   const rotated1 = rotateZ3d(rotated2, rotationValue);

      //   const rotated = rotateX3d(rotated1, rotationValue);
      mapOf2dPoints[key] = perspectiveProjection(rotatedPointX, distance);
    });
    connections.forEach(({ from, to }) => {
      const { x: xFrom, y: yFrom } = mapOf2dPoints[from];
      const { x: xTo, y: yTo } = mapOf2dPoints[to];

      line(xFrom, yFrom, xTo, yTo);
      strokeWeight(1);
    });
    rotationValue += change;

    // noLoop();
  }
}

function mousePressed() {
  clear();
}
