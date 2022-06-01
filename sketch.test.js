const splitWallsRec = (wall, itCount, mapOf2dPoints) => {
  if (itCount === 3) return wall;
  const point1 = wall.p1;
  const point2 = wall.p2;
  const point3 = wall.p3;
  const point4 = wall.p4;
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
    generateObject(point1, middlePoint12, wallMiddlePoint, middlePoint41),
    generateObject(point2, middlePoint23, wallMiddlePoint, middlePoint12),
    generateObject(point3, middlePoint34, wallMiddlePoint, middlePoint23),
    generateObject(point4, middlePoint41, wallMiddlePoint, middlePoint34),
  ];
  //   console.log(result);
  return result.map((result) =>
    splitWallsRec(result, itCount + 1, mapOf2dPoints)
  );
};

const getPoints = (wall, mapOf2dPoints) => {
  const point1 = mapOf2dPoints[wall.p1];
  const point2 = mapOf2dPoints[wall.p2];
  const point3 = mapOf2dPoints[wall.p3];
  const point4 = mapOf2dPoints[wall.p4];
  return { p1: point1, p2: point2, p3: point3, p4: point4 };
};

const generateObject = (p1, p2, p3, p4) => ({
  p1,
  p2,
  p3,
  p4,
});

const getMiddlePointOfLine = (point1, point2) => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
    z: (point1.z + point2.z) / 2,
  };
};

test("splitWallsRec", () => {
  const mapOf2dPoints = {
    0: { x: 123, y: 123, z: 123 },
    1: { x: 53, y: 43, z: 73 },
    2: { x: 173, y: 23, z: 53 },
    3: { x: 133, y: 193, z: 23 },
    4: { x: 51233, y: 4233, z: 7233 },
    5: { x: 173, y: 223, z: 5323 },
    6: { x: 13323, y: 193, z: 23 },
  };
  const walls = [
    { p1: 0, p2: 1, p3: 2, p4: 3 },
    { p1: 3, p2: 4, p3: 5, p4: 6 },
  ];
  const value = walls
    .map((wall) =>
      splitWallsRec(getPoints(wall, mapOf2dPoints), 0, mapOf2dPoints)?.flat?.(2)
    )
    .flat(2);
  console.log(Array.isArray(value), value, "xd");
  expect(value.length).toBe(128);
});
