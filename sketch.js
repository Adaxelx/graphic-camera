let mapOfPoints = {};
let mapOf2dPoints = {};
let connections = [];

let distance = 1000;

const canvasWidth = 800;
const canvasHeight = 800;

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
          const [from, to] = line.split(" ");
          connections.push({ from, to });
        }
      });
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
  if (!connections.length) return;
  if (changed) {
    Object.entries(mapOfPoints).forEach(([key, value]) => {
      let point = value;

      const shouldRotate =
        params.changed === "x" ||
        params.changed === "y" ||
        params.changed === "z";

      // Object.entries(params.rotation).forEach(([key, value]) => {
      //   // console.log(key === params.changed);
      //   if (!value) return;
      //   if (key === "z") {
      //     point = rotateZ3d(point, value);
      //   } else if (key === "x") {
      //     point = rotateX3d(point, value);
      //   } else if (key === "y") {
      //     point = rotateY3d(point, value);
      //   }
      // });
      point = rotatePoint(params.rotation, value);
      console.log(point);
      // console.log(
      //   params.changed,
      //   shouldRotate,
      //   params.rotation[params.changed]
      // );
      // if (shouldRotate) {
      //   if (params.changed === "z") {
      //     point = rotateZ3d(point, params.rotation[params.changed]);
      //   } else if (params.changed === "x") {
      //     point = rotateX3d(point, params.rotation[params.changed]);
      //   } else if (params.changed === "y") {
      //     point = rotateY3d(point, params.rotation[params.changed]);
      //   }
      // }

      point = {
        x: point.x + params.translation.x,
        y: point.y + params.translation.y,
        z: point.z + params.translation.z,
      };
      // point = scalePoint(point, params.zoom.value);

      mapOf2dPoints[key] = perspectiveProjection(
        point,
        distance,
        params.zoom.value
      );
    });
  }

  connections.forEach(({ from, to }) => {
    const { x: xFrom, y: yFrom } = mapOf2dPoints[from];
    const { x: xTo, y: yTo } = mapOf2dPoints[to];

    line(xFrom, yFrom, xTo, yTo);
    strokeWeight(1);
  });

  changed = false;
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
