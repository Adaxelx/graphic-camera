// const surface = getSurface(wallA);

// // const averageX = (p1B.x + p2B.x + p3B.x + p4B.x) / 4;
// // const averageY = (p1B.y + p2B.y + p3B.y + p4B.y) / 4;
// // const averageZ = (p1B.z + p2B.z + p3B.z + p4B.z) / 4;

// const isAnyOnTheSameSide = [p1B, p2B, p3B, p4B]
//   .map((point) => {
//     if (isPositive(surface, point, observer)) {
//       return 1;
//     }
//     return -1;
//   })
//   .some((value) => value === 1);

// if (isAnyOnTheSameSide) {
//   return 1;
// }

// const isDupa = [p1B, p2B, p3B, p4B].map((point) => {
//   if (
//     isPositive2(
//       surface,
//       { x: point.x, y: point.y, z: point.z },
//       { x: 0, y: 0, z: 1000 }
//     )
//   ) {
//     return -1;
//   }
//   return 1;
// });
// if (isDupa.some((point) => point === -1)) {
//   return -1;
// }
// return 1;

// if (isPositive(surface, { x: p1B.x, y: p1B.y, z: p1B.z })) {
//   return 1;
// } else if (isPositive(surface, { x: p2B.x, y: p2B.y, z: p2B.z })) {
//   return 1;
// } else if (isPositive(surface, { x: p3B.x, y: p3B.y, z: p3B.z })) {
//   return 1;
// } else if (isPositive(surface, { x: p4B.x, y: p4B.y, z: p4B.z })) {
//   return 1;
// }
// return -1;
// const minZA = Math.min(p1A.z, p2A.z, p3A.z, p4A.z);
// const maxZA = Math.max(p1A.z, p2A.z, p3A.z, p4A.z);
// const maxZB = Math.max(p1B.z, p2B.z, p3B.z, p4B.z);
// const minZB = Math.min(p1B.z, p2B.z, p3B.z, p4B.z);

// if (maxZA > maxZB) {
//   return 1;
// } else if (maxZB > maxZA) {
//   return -1;
// } else if (minZA > minZB) {
//   return 1;
// } else if (minZB > minZA) {
//   return -1;
// }

/// TREE

// function displayTree(tree, point = { x: 0, y: 0, z: -1000 }) {
//   if (tree === null) return;
//   const { root, left, right } = tree;
//   const rootA = copyOf2dPoints[root.a];
//   const rootB = copyOf2dPoints[root.b];
//   if (isLeft(rootA, rootB, point)) {
//     displayTree(right, point);
//     line(rootA.x, rootA.y, rootA.z, rootB.x, rootB.y, rootB.z);
//     displayTree(left, point);
//   } else {
//     displayTree(left, point);
//     line(rootA.x, rootA.y, rootA.z, rootB.x, rootB.y, rootB.z);
//     displayTree(right, point);
//   }
// }

// let bspTree;

// function isLeft(a, b, c) {
//   return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0;
// }
// const uniqueArray = (a) =>
//   [...new Set(a.map((o) => JSON.stringify(o)))].map((s) => JSON.parse(s));

// const generateLinesObject = () => {
//   shapes.forEach((shape) => {
//     const p1 = mapOf2dPoints[shape.p1];
//     const p2 = mapOf2dPoints[shape.p2];
//     const p3 = mapOf2dPoints[shape.p3];
//     const p4 = mapOf2dPoints[shape.p4];

//     if (!setOfLinesBinary.has(JSON.stringify({ a: shape.p2, b: shape.p1 }))) {
//       setOfLinesBinary.add(JSON.stringify({ a: shape.p1, b: shape.p2 }));
//     }
//     if (!setOfLinesBinary.has(JSON.stringify({ a: shape.p3, b: shape.p2 }))) {
//       setOfLinesBinary.add(JSON.stringify({ a: shape.p2, b: shape.p3 }));
//     }
//     if (!setOfLinesBinary.has(JSON.stringify({ a: shape.p4, b: shape.p3 }))) {
//       setOfLinesBinary.add(JSON.stringify({ a: shape.p3, b: shape.p4 }));
//     }
//     if (!setOfLinesBinary.has(JSON.stringify({ a: shape.p1, b: shape.p4 }))) {
//       setOfLinesBinary.add(JSON.stringify({ a: shape.p4, b: shape.p1 }));
//     }
//   });
//   setOfLinesBinary = [...setOfLinesBinary].map((line) => JSON.parse(line));
// };

// let nextId = 9;
// let copyOf2dPoints = { ...mapOf2dPoints };

// const bspHelper = () => {
//   nextId = 9;
//   const copyOfLines = [...setOfLinesBinary];
//   copyOf2dPoints = { ...mapOf2dPoints };
//   const bspTree = bsp(copyOfLines, copyOf2dPoints);
//   console.log(bspTree);
//   return bspTree;
// };

// const bsp = (lines, copyOf) => {
//   let root, l, backPart, frontPart, backList, frontList;
//   console.log(lines);
//   if (lines.length === 0) {
//     return null;
//   }
//   root = lines.pop();
//   backList = [];
//   frontList = [];
//   lines.forEach((line) => {
//     if (isLineInFrontOfRoot(root, line)) {
//       frontList.push(line);
//     } else if (isLineInBackOfRoot(root, line)) {
//       backList.push(line);
//     } else {
//       const isALeft = isLeft(
//         copyOf2dPoints[root.a],
//         copyOf2dPoints[root.b],
//         copyOf2dPoints[line.a]
//       );
//       const [front, back] = splitLine(root, line, isALeft);
//       frontList.push(front);
//       backList.push(back);
//     }
//   });
//   console.log({ frontList, backList });
//   return mergeTree(bsp(frontList), root, bsp(backList));
// };

// const isLineInFrontOfRoot = (root, line) => {
//   console.log(root, line, copyOf2dPoints[line.a]);
//   return (
//     isLeft(
//       copyOf2dPoints[root.a],
//       copyOf2dPoints[root.b],
//       copyOf2dPoints[line.a]
//     ) &&
//     isLeft(
//       copyOf2dPoints[root.a],
//       copyOf2dPoints[root.b],
//       copyOf2dPoints[line.b]
//     )
//   );
// };

// const isLineInBackOfRoot = (root, line) => {
//   return (
//     !isLeft(
//       copyOf2dPoints[root.a],
//       copyOf2dPoints[root.b],
//       copyOf2dPoints[line.a]
//     ) &&
//     !isLeft(
//       copyOf2dPoints[root.a],
//       copyOf2dPoints[root.b],
//       copyOf2dPoints[line.b]
//     )
//   );
// };

// const getABCOfLine = (line) => {
//   const p1Line = copyOf2dPoints[line.a];
//   const p2Line = copyOf2dPoints[line.b];
//   const l = p2Line.x - p1Line.x;
//   const m = p2Line.y - p1Line.y;
//   const n = p2Line.z - p1Line.z;

//   return [l, m, n];
// };

// const splitLine = (root, line, isALeft) => {
//   const [a1, b1, c1] = getABCOfLine(line);
//   const [a2, b2, c2] = getABCOfLine(root);
//   const { x: x1, y: y1, z: z1 } = copyOf2dPoints[line.a];
//   const { x: x2, y: y2, z: z2 } = copyOf2dPoints[root.a];
//   const lambda = (a2 * (y2 - y1) - b1 * (x2 - x1)) / (a2 * b1 - a1 * b2);
//   const [x, y, z] = [x1 + lambda * a1, y1 + lambda * b1, z1 + lambda * c1];
//   const id = nextId++;
//   copyOf2dPoints[id] = { x, y, z };
//   if (isALeft) {
//     return [
//       { a: line.a, b: id },
//       { a: id, b: line.b },
//     ];
//   }
//   return [
//     { a: id, b: line.b },
//     { a: line.a, b: id },
//   ];
// };

// const mergeTree = (left, root, right) => {
//   return {
//     root,
//     left,
//     right,
//   };
// };

// const tree = {
//   nextId: 1,
//   root: {
//     left: null,
//     right: null,
//   },
// };

// // Not used

// const normalizePoints = () => {
//   let minX = Infinity;
//   let minY = Infinity;
//   let maxX = -Infinity;
//   let maxY = -Infinity;
//   Object.entries(mapOf2dPoints).forEach(([key, value]) => {
//     if (minX > value.x) {
//       minX = value.x;
//     }
//     if (minY > value.y) {
//       minY = value.y;
//     }
//     if (maxX < value.x) {
//       maxX = value.x;
//     }
//     if (maxY < value.y) {
//       maxY = value.y;
//     }
//   });

//   const diagonal = Math.sqrt(
//     Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2)
//   );

//   const newMapOf2dPoints = Object.entries(mapOf2dPoints).reduce(
//     (prevObject, [key, value]) => {
//       return {
//         ...prevObject,
//         [key]: {
//           x: ((value.x - minX) / diagonal) * 400,
//           y: ((value.y - minY) / diagonal) * 400,
//         },
//       };
//     },
//     {}
//   );
//   mapOf2dPoints = newMapOf2dPoints;
// };

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

// .sort((shape, shape2) => {
//   if (shape.priority > shape2.priority) {
//     return 1;
//   } else if (shape.priority < shape2.priority) {
//     return -1;
//   }
//   const p1A = mapOf2dPoints[shape.p1];
//   const p2A = mapOf2dPoints[shape.p2];
//   const p3A = mapOf2dPoints[shape.p3];
//   const p4A = mapOf2dPoints[shape.p4];

//   const p1B = mapOf2dPoints[shape2.p1];
//   const p2B = mapOf2dPoints[shape2.p2];
//   const p3B = mapOf2dPoints[shape2.p3];
//   const p4B = mapOf2dPoints[shape2.p4];

//   const z1 = thisIsNotSrodekCiezkosciForSure(
//     {
//       p1: p1A,
//       p2: p2A,
//       p3: p3A,
//       p4: p4A,
//     },
//     "min"
//   );
//   const z2 = thisIsNotSrodekCiezkosciForSure(
//     {
//       p1: p1B,
//       p2: p2B,
//       p3: p3B,
//       p4: p4B,
//     },
//     "max"
//   );

//   console.log(z1, z2);

//   if (z1 < z2) {
//     return 1;
//   } else if (z1 > z2) {
//     return -1;
//   }
//   console.log("xd");
//   return 0;
// });

// const getSurface2 = (wallA) => {
//   const p1 = mapOf2dPoints[wallA.p1];
//   const p2 = mapOf2dPoints[wallA.p2];
//   const p3 = mapOf2dPoints[wallA.p3];
//   const ba = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
//   const ca = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };
//   const baxca = { a: ba.x * ca.x, b: ba.y * ca.y, c: ba.z * ca.z };
//   const { a, b, c } = baxca;
//   const d = -a * p1.x - b * p1.y - c * p1.z;
//   return { a, b, c, d };
// };

// const getValue = ({ a, b, c, d }, { x, y, z }) => a * x + b * y + c * z + d;
// const epsilon = 0.000001;
// const isOnPlane = (surface, point) =>
//   Math.abs(getValue(surface, point)) < epsilon;

// const isPositive = ({ a, b, c, d }, { x, y, z }, observer) => {
//   return (
//     Math.sign(a * x + b * y + c * z + d) ===
//     Math.sign(a * observer.x + b * observer.y + c * observer.z + d)
//   );
// };

// const isPositive2 = (surface, p1, p2) => {
//   const p1Val = getValue(surface, p1);
//   const p2Val = getValue(surface, p2);
//   if (isOnPlane(surface, p1) || isOnPlane(surface, p1)) return false;

//   return (p1Val > 0 && p2Val > 0) || (p1Val < 0 && p2Val < 0);
// };

// console.log(point);
// shapes = shapes.map((shape, i) => ({ ...shape, priority: tmp[i] }));

// shapes.forEach((shape, i) => {
//   shapes.forEach((shape2, j) => {
//     if (i === j) return;
//     tmp[i] += sortWalls(shape, shape2);
//   });
// });
// bspTree = bspHelper();
// displayTree(bspTree);
// console.log(mapOf2dPoints[key]);
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
// if (bspTree) {
//   displayTree(bspTree);
// }
