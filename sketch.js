let mapOfPoints = {};
let mapOf2dPoints = {};
let connections = [];

let distance = 1000;

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

const rotationAxisParams = {
  y: { A: 0, B: 1, C: 0 },
  x: { A: 100, B: 1, C: 0 },
  z: { A: 0, B: 1, C: 100 },
};

const params = {
  rotation: { x: 0, y: 0, z: 0 },
  translation: { x: 0, y: 0, z: 0 },
  zoom: 1,
};

function setup() {
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
            mapOf2dPoints[key] = perspectiveProjection(value, distance);
          });
        } else if (titleCount === 2) {
          const [from, to] = line.split(" ");
          connections.push({ from, to });
        }
      });
    };

    fr.readAsText(this.files[0]);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      params.rotation.y += 0.1;
    } else if (e.key === "ArrowLeft") {
      params.rotation.y -= 0.1;
    } else if (e.key === "ArrowUp") {
      params.rotation.x += 0.1;
    } else if (e.key === "ArrowDown") {
      params.rotation.x -= 0.1;
    } else if (e.key === "q" || e.key === "Q") {
      params.rotation.z -= 0.1;
    } else if (e.key === "e" || e.key === "E") {
      params.rotation.z += 0.1;
    } else if (e.key === "a" || e.key === "A") {
      params.translation.x -= 10;
    } else if (e.key === "d" || e.key === "D") {
      params.translation.x += 10;
    } else if (e.key === "w" || e.key === "W") {
      params.translation.y -= 10;
    } else if (e.key === "s" || e.key === "S") {
      params.translation.y += 10;
    } else if (e.key === "z" || e.key === "Z") {
      params.translation.z -= 10;
    } else if (e.key === "x" || e.key === "X") {
      params.translation.z += 10;
    } else if (e.key === "o" || e.key === "O") {
      params.zoom += 0.1;
    } else if (e.key === "p" || e.key === "P") {
      params.zoom -= 0.1;
    }
  });
}

function draw() {
  clear();
  translate(width / 2, height / 2);
  frameRate(5);
  if (connections.length) {
    Object.entries(mapOfPoints).forEach(([key, value]) => {
      const T1 = { x: 0, y: 0, z: 0 };
      let point = {
        x: value.x + params.translation.x,
        y: value.y + params.translation.y,
        z: value.z + params.translation.z,
      };
      point = scalePoint(point, params.zoom);

      Object.entries(params.rotation).forEach(([key, value]) => {
        if (value) {
          point = rotatePointAroundLine(
            point,
            T1,
            rotationAxisParams[key],
            params.rotation[key]
          );
        }
      });
      mapOf2dPoints[key] = perspectiveProjection(point, distance);
    });

    connections.forEach(({ from, to }) => {
      const { x: xFrom, y: yFrom } = mapOf2dPoints[from];
      const { x: xTo, y: yTo } = mapOf2dPoints[to];

      line(xFrom, yFrom, xTo, yTo);
      strokeWeight(1);
    });
  }
}

// Not used

const normalizePoints = () => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  Object.entries(mapOf2dPoints).forEach(([key, value]) => {
    if (minX > value.x) {
      minX = value.x;
    }
    if (minY > value.y) {
      minY = value.y;
    }
    if (maxX < value.x) {
      maxX = value.x;
    }
    if (maxY < value.y) {
      maxY = value.y;
    }
  });
  const diagonal = Math.sqrt(
    Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2)
  );
  const newMapOf2dPoints = Object.entries(mapOf2dPoints).reduce(
    (prevObject, [key, value]) => {
      return {
        ...prevObject,
        [key]: {
          x: ((value.x - minX) / diagonal) * 400,
          y: ((value.y - minY) / diagonal) * 400,
        },
      };
    },
    {}
  );
  mapOf2dPoints = newMapOf2dPoints;
};
