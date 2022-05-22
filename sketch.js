let mapOfPoints = {};
let mapOf2dPoints = {};
let connections = [];
let shapes = [];

let distance = 1000;

const canvasWidth = 800;
const canvasHeight = 800;

const average = (...args) => args.reduce((a, b) => a + b) / args.length;
const T1 = { x: 0, y: 0, z: 0 };

const rotationAxisParams = {
  y: { A: 0, B: 1, C: 0 },
  x: { A: 100, B: 1, C: 0 },
  z: { A: 0, B: 1, C: 100 },
};

const params = {
  rotation: { x: 0, y: 0, z: 0 },
  translation: { x: 0, y: 0, z: 0 },
  zoom: { value: 90 },
  changed: "",
};

const {
  perspectiveProjection,
  translatePoint,
  rotateX3d,
  rotateY3d,
  rotateZ3d,
  scalePoint,
  rotatePoint,
} = Matrix();

let changed = true;

const { keyboardConfig, createListOfKeys } = Helpers();

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  fill(0);
  createListOfKeys();
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
            mapOf2dPoints[key] = perspectiveProjection(
              value,
              distance,
              params.zoom.value
            );
          });
        } else if (titleCount === 2) {
          const [p1, p2, p3, p4] = line.split(" ");
          shapes.push({ p1, p2, p3, p4 });
        }
      });
      shapes = shapes.sort(sortWalls);
    };

    fr.readAsText(this.files[0]);
  });

  document.addEventListener("keydown", function (e) {
    Object.entries(keyboardConfig).forEach(([actionName, configs]) => {
      Object.entries(configs).forEach(([configName, options]) => {
        options.forEach((option) => {
          if (option.keys.some((keyValue) => e.key === keyValue)) {
            params[actionName][configName] += option.value;
            params.changed = configName;
            changed = true;
          }
        });
      });
    });
  });
}

function draw() {
  clear();
  translate(width / 2, height / 2);
  frameRate(24);
  // if (!shapes.length) return;
  if (changed) {
    Object.entries(mapOfPoints).forEach(([key, value]) => {
      let point = value;

      const shouldRotate =
        params.changed === "x" ||
        params.changed === "y" ||
        params.changed === "z";

      point = rotatePoint(params.rotation, value);
      // console.log(point);
      point = {
        x: point.x + params.translation.x,
        y: point.y + params.translation.y,
        z: point.z + params.translation.z,
      };
      // console.log(point);
      shapes = shapes.sort(sortWalls);
      mapOf2dPoints[key] = perspectiveProjection(
        point,
        distance,
        params.zoom.value
      );
      // console.log(mapOf2dPoints[key]);
    });

    // console.log(
    //   shapes.map((points) => {
    //     const p1 = mapOf2dPoints[points.p1];
    //     const p2 = mapOf2dPoints[points.p2];
    //     const p3 = mapOf2dPoints[points.p3];
    //     const p4 = mapOf2dPoints[points.p4];
    //     return Math.max(p1.z, p2.z, p3.z, p4.z);
    //   }),
    //   mapOfPoints
    // );
  }

  shapes.forEach((points) => {
    const p1 = mapOf2dPoints[points.p1];
    const p2 = mapOf2dPoints[points.p2];
    const p3 = mapOf2dPoints[points.p3];
    const p4 = mapOf2dPoints[points.p4];
    let c = color(255, 204, 0);
    fill(c);
    quad(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
  });

  changed = false;
}

const sortWalls = (wallA, wallB) => {
  const p1A = mapOf2dPoints[wallA.p1];
  const p2A = mapOf2dPoints[wallA.p2];
  const p3A = mapOf2dPoints[wallA.p3];
  const p4A = mapOf2dPoints[wallA.p4];

  const p1B = mapOf2dPoints[wallB.p1];
  const p2B = mapOf2dPoints[wallB.p2];
  const p3B = mapOf2dPoints[wallB.p3];
  const p4B = mapOf2dPoints[wallB.p4];

  const minZA = Math.min(p1A.z, p2A.z, p3A.z, p4A.z);
  const maxZA = Math.max(p1A.z, p2A.z, p3A.z, p4A.z);
  const maxZB = Math.max(p1B.z, p2B.z, p3B.z, p4B.z);
  const minZB = Math.min(p1B.z, p2B.z, p3B.z, p4B.z);
  console.log({ minZA, maxZA, minZB, maxZB });
  if (maxZA > maxZB) {
    return 1;
  } else if (maxZB > maxZA) {
    return -1;
  } else if (minZA > minZB) {
    return 1;
  } else if (minZB > minZA) {
    return -1;
  }

  return 1;
};

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

// if (
//   Math.max(
//     Math.abs(p1A.z),
//     Math.abs(p2A.z),
//     Math.abs(p3A.z),
//     Math.abs(p4A.z)
//   ) >
//   Math.max(Math.abs(p1B.z), Math.abs(p2B.z), Math.abs(p3B.z), Math.abs(p4B.z))
// ) {
//   return -1;
// } else if (
//   Math.max(
//     Math.abs(p1A.z),
//     Math.abs(p2A.z),
//     Math.abs(p3A.z),
//     Math.abs(p4A.z)
//   ) <
//   Math.max(Math.abs(p1B.z), Math.abs(p2B.z), Math.abs(p3B.z), Math.abs(p4B.z))
// ) {
//   return 1;
// }
