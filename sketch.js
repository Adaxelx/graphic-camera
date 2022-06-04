let mapOfPoints = {};
let mapOf2dPoints = {};
let connections = [];
let shapes = [];
let setOfLinesBinary = new Set();
let distance = 1000;
const observer = { x: 0, y: 0, z: -1000 };
const colors = ["blue", "yellow", "green", "red", "orange", "brown"];
let shapesForProjection = [];

let ka = 0.1;
let ks = 0.3;
let kd = 0.3;

const range = (start, end, step = 1) => {
  const output = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

const thisIsNotSrodekCiezkosciForSure = ({ p1, p2, p3, p4 }, val) =>
  Math[val](p1.z, p2.z, p3.z, p4.z);

const canvasWidth = 800;
const canvasHeight = 800;

const average = (...args) => args.reduce((a, b) => a + b) / args.length;

const params = {
  rotation: { x: 0, y: 0, z: 0 },
  translation: { x: 0, y: 0, z: 0 },
  zoom: { value: 90 },
  changedPoints: "",
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

let changedPoints = true;

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
      shapes = shapes.map((shape, i) => ({
        ...shape,
        color: colors[Math.round(i % 6)],
      }));
      shapes = shapes
        .map((shape) => {
          return splitWallsRec(getPoints(shape, mapOf2dPoints), 0)?.flat?.(2);
        })
        ?.flat?.(2);
      shapesForProjection = shapes;

      // shapes = shapes.sort(sortWalls);
      // generateLinesObject();
    };

    fr.readAsText(this.files[0]);
  });

  document.addEventListener("keydown", function (e) {
    Object.entries(keyboardConfig).forEach(([actionName, configs]) => {
      Object.entries(configs).forEach(([configName, options]) => {
        options.forEach((option) => {
          if (option.keys.some((keyValue) => e.key === keyValue)) {
            params[actionName][configName] += option.value;
            params.changedPoints = configName;
            changedPoints = true;
          }
        });
      });
    });
  });

  const kaElement = document.getElementById("ka");
  kaElement.value = ka * 100;
  const kdElement = document.getElementById("kd");
  kdElement.value = kd * 100;
  const ksElement = document.getElementById("ks");
  ksElement.value = ks * 100;

  document.getElementById("ksValue").textContent = ks;
  document.getElementById("kaValue").textContent = ka;
  document.getElementById("kdValue").textContent = kd;

  kaElement.addEventListener("change", (e) => {
    ka = Number(e.target.value) / 100;
    document.getElementById("kaValue").textContent = ka;
  });
  kdElement.addEventListener("change", (e) => {
    kd = Number(e.target.value) / 100;
    document.getElementById("kdValue").textContent = kd;
  });
  ksElement.addEventListener("change", (e) => {
    ks = Number(e.target.value) / 100;
    document.getElementById("ksValue").textContent = ks;
  });
}

const projectPoint = (point) => {
  const shouldRotate =
    params.changedPoints === "x" ||
    params.changedPoints === "y" ||
    params.changedPoints === "z";

  point = rotatePoint(params.rotation, point);

  point = {
    x: point.x + params.translation.x,
    y: point.y + params.translation.y,
    z: point.z + params.translation.z,
  };

  return perspectiveProjection(point, distance, params.zoom.value);
};

function draw() {
  clear();
  translate(width / 2, height / 2);
  frameRate(24);
  if (!shapes.length) return;
  if (changedPoints) {
    shapesForProjection = shapes.map(({ p1, p2, p3, p4, color }) => {
      return {
        p1: projectPoint(p1),
        p2: projectPoint(p2),
        p3: projectPoint(p3),
        p4: projectPoint(p4),
        color,
      };
    });

    shapesForProjection.sort(sortWalls);
  }
  shapesForProjection.forEach((points) => {
    const p1 = points.p1;
    const p2 = points.p2;
    const p3 = points.p3;
    const p4 = points.p4;
    // const { color } = points;
    const color = createPhongReflection(
      observer,
      { x: -25, y: 50, z: 50 },
      point,
      getSurface(points),
      {
        ambient: { r: 74, g: 95, b: 255 },
        specular: { r: 44, g: 35, b: 145 },
        diffuse: { r: 22, g: 2, b: 242 },
        pointColor: { r: 0, g: 0, b: 0 },
      }
    );

    fill(color.r, color.g, color.b);
    stroke(color.r, color.g, color.b);
    quad(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
  });
  changedPoints = false;
}

const getSurface = (wallA) => {
  const p1A = wallA.p1;
  const p2A = wallA.p2;
  const p3A = wallA.p3;
  const p4A = wallA.p4;
  const a =
    (p2A.y - p1A.y) * (p3A.z - p1A.z) - (p3A.y - p1A.y) * (p2A.z - p1A.z);
  const b =
    (p2A.z - p1A.z) * (p3A.x - p1A.x) - (p3A.z - p1A.z) * (p2A.x - p1A.x);
  const c =
    (p2A.x - p1A.x) * (p3A.y - p1A.y) - (p3A.x - p1A.x) * (p2A.y - p1A.y);
  const d = -1 * (a * p1A.x + b * p1A.y + c * p1A.z);
  // console.log(a, b, c, d);
  return { a, b, c, d };
};

const isPositive = ({ a, b, c, d }, { x, y, z }, observer) => {
  return (
    Math.sign(a * x + b * y + c * z + d) ===
    Math.sign(a * observer.x + b * observer.y + c * observer.z + d)
  );
};

const getCenterOfGravityDim = (wall, dim) =>
  (wall.p1[dim] + wall.p2[dim] + wall.p3[dim] + wall.p4[dim]) / 4;

const getCenterOfGravityWall = (wall) => ({
  ...wall,
  x: getCenterOfGravityDim(wall, "x"),
  y: getCenterOfGravityDim(wall, "y"),
  z: getCenterOfGravityDim(wall, "z"),
});

const distanceBetween2Points = (p1, p2) =>
  Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
      Math.pow(p2.y - p1.y, 2) +
      Math.pow(p2.y - p1.y, 2)
  );

const sortWalls = (wallA, wallB) => {
  const p1A = wallA.p1;
  const p2A = wallA.p2;
  const p3A = wallA.p3;
  const p4A = wallA.p4;

  const p1B = wallB.p1;
  const p2B = wallB.p2;
  const p3B = wallB.p3;
  const p4B = wallB.p4;

  minZA = Math.min(p1A.z, p2A.z, p3A.z, p4A.z);
  maxZA = Math.max(p1A.z, p2A.z, p3A.z, p4A.z);
  minZB = Math.min(p1B.z, p2B.z, p3B.z, p4B.z);
  maxZB = Math.max(p1B.z, p2B.z, p3B.z, p4B.z);

  if (maxZA > maxZB) {
    return 1;
  } else if (maxZB > maxZA) {
    return -1;
  } else if (minZA > minZB) {
    return 1;
  } else if (minZB > minZA) {
    return -1;
  }
};

const splitWallsRec = (wall, itCount) => {
  if (itCount === 3) return wall;

  const point1 = wall.p1;
  const point2 = wall.p2;
  const point3 = wall.p3;
  const point4 = wall.p4;
  const color = wall.color;
  result = [];
  middlePoint12 = getMiddlePointOfLine(point1, point2);
  middlePoint23 = getMiddlePointOfLine(point2, point3);
  middlePoint34 = getMiddlePointOfLine(point3, point4);
  middlePoint41 = getMiddlePointOfLine(point4, point1);
  wallMiddlePoint = {
    x: (point1.x + point2.x + point3.x + point4.x) / 4,
    y: (point1.y + point2.y + point3.y + point4.y) / 4,
    z: (point1.z + point2.z + point3.z + point4.z) / 4,
  };
  result = [
    generateObject(
      point1,
      middlePoint12,
      wallMiddlePoint,
      middlePoint41,
      color
    ),
    generateObject(
      point2,
      middlePoint23,
      wallMiddlePoint,
      middlePoint12,
      color
    ),
    generateObject(
      point3,
      middlePoint34,
      wallMiddlePoint,
      middlePoint23,
      color
    ),
    generateObject(
      point4,
      middlePoint41,
      wallMiddlePoint,
      middlePoint34,
      color
    ),
  ];

  return result.map((result) => splitWallsRec(result, itCount + 1));
};

const getPoints = (wall, mapOf2dPoints) => {
  const point1 = mapOf2dPoints[wall.p1];
  const point2 = mapOf2dPoints[wall.p2];
  const point3 = mapOf2dPoints[wall.p3];
  const point4 = mapOf2dPoints[wall.p4];
  return { p1: point1, p2: point2, p3: point3, p4: point4, color: wall.color };
};

const generateObject = (p1, p2, p3, p4, color) => ({
  p1,
  p2,
  p3,
  p4,
  color,
});

const getMiddlePointOfLine = (point1, point2) => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
    z: (point1.z + point2.z) / 2,
  };
};

// 3 Projekt

const multiplyRGBWithScalar = (color, scalar) =>
  Object.entries(color).reduce(
    (prevValue, [key, value]) => ({ ...prevValue, [key]: value * scalar }),
    {}
  );

const sumColors = (...colors) =>
  colors.reduce(
    (prevColor, currentColor) => ({
      r: prevColor.r + currentColor.r,
      g: prevColor.g + currentColor.g,
      b: prevColor.b + currentColor.b,
    }),
    { r: 0, g: 0, b: 0 }
  );

const createPhongReflection = (
  observer,
  pointOfLight,
  surfacePoint,
  surface,
  { ambient, diffuse, specular, pointColor } // {r: X,g:Y,b:Z}
) => {
  // const ka = 0.2; //0.1 - 0.2
  // const kd = 0.6; //0.3 - 0.6
  // const ks = 0.6; //0.3 - 0.6

  let surfaceVector = createVector(
    surfacePoint.x,
    surfacePoint.y,
    surfacePoint.z
  );
  let V = createVector(surfacePoint.x, surfacePoint.y, surfacePoint.z).sub(
    createVector(observer.x, observer.y, observer.z)
  );
  let L = createVector(surfacePoint.x, surfacePoint.y, surfacePoint.z).sub(
    createVector(pointOfLight.x, pointOfLight.y, pointOfLight.z)
  );

  let N = createVector(surfacePoint.x, surfacePoint.y, surfacePoint.z).sub(
    createVector(surface.a, surface.b, surface.c)
  );

  let R = N.copy()
    .normalize()
    .mult(L.copy().normalize())
    .mult(N.copy().normalize())
    .sub(L.copy().normalize())
    .mult(2);

  const A = multiplyRGBWithScalar(ambient, ka);
  const D = multiplyRGBWithScalar(
    diffuse,
    kd * L.copy().normalize().mult(N.copy().normalize()).mag()
  );
  const S = multiplyRGBWithScalar(
    specular,
    ks * Math.pow(V.copy().normalize().mult(R.copy().normalize()).mag(), Math.E)
  );
  const summedLightColor = sumColors(A, D, S);
  const Lp = {
    r: summedLightColor.r + pointColor.r,
    g: summedLightColor.g + pointColor.g,
    b: summedLightColor.b + pointColor.b,
  };
  return Lp;
};
