const Matrix = () => {
  const getTranslationMatrix = ({ x, y, z }) => [
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1],
  ];

  const getScaleMatrix = (s) => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1 / s],
  ];

  const getRotateXLineMatrix = ({ B, C }) => {
    const divider = Math.sqrt(B ** 2 + C ** 2);
    return [
      [1, 0, 0, 0],
      [0, C / divider, -B / divider, 0],
      [0, B / divider, -C / divider, 0],
      [0, 0, 0, 1],
    ];
  };

  const getRotateYLineMatrix = ({ A, B, C }) => {
    const divider = Math.sqrt(A ** 2 + B ** 2 + C ** 2);
    const BCsqrt = Math.sqrt(B ** 2 + C ** 2);
    return [
      [A / divider, 0, BCsqrt / divider, 0],
      [0, 1, 0, 0],
      [-BCsqrt / divider, 0, A / divider, 0],
      [0, 0, 0, 1],
    ];
  };

  const getPerspectiveMatrix = (d) => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 1 / d, 1],
  ];

  const getPerspectiveMatrix2 = (a, fi = 90, zf = 1000, zn = 0.01) => [
    [1 / Math.tan(fi / 2), 0, 0, 0],
    [0, 1 / Math.tan(fi / 2), 0, 0],
    [0, 0, -zf / (zf - zn), -1],
    [0, 0, (zf * zn) / (zf - zn), 0],
  ];

  const getRotateXMatrix = (angle) => [
    [1, 0, 0, 0],
    [0, Math.cos(angle), -Math.sin(angle), 0],
    [0, Math.sin(angle), Math.cos(angle), 0],
    [0, 0, 0, 1],
  ];

  const getRotateYMatrix = (angle) => [
    [Math.cos(angle), 0, Math.sin(angle), 0],
    [0, 1, 0, 0],
    [-Math.sin(angle), 0, Math.cos(angle), 0],
    [0, 0, 0, 1],
  ];

  const getRotateZMatrix = (angle) => [
    [Math.cos(angle), -Math.sin(angle), 0, 0],
    [Math.sin(angle), Math.cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  const generatePointMatrix = ({ x, y, z }) => [[x], [y], [z], [1]];

  const generateEmptyMatrix = (rows, cols) => {
    const result = new Array(rows);
    for (let i = 0; i < rows; i++) {
      result[i] = new Array(cols).fill(0);
    }
    return result;
  };

  const multiplyMatrixes = (pMatrix, point) => {
    const pMatrixRows = pMatrix.length;
    const pMatrixCols = pMatrix[0].length;
    const pointCols = point?.[0]?.length ?? 1;
    const result = generateEmptyMatrix(pMatrixRows, pointCols);

    for (let i = 0; i < pMatrixRows; i++) {
      for (let j = 0; j < pointCols; j++) {
        for (let k = 0; k < pMatrixCols; k++) {
          result[i][j] += pMatrix[i][k] * point[k][j];
        }
      }
    }
    return result;
  };

  const perspectiveMultiplyParse = (pMatrix, point, distance) => {
    const result = multiplyMatrixes(pMatrix, point);
    const zp = point[2][0];
    const [x, y, z] = result
      .flat()
      .map((value) => (value * distance) / (zp + distance))
      .slice(0, 3);

    return { x, y, z };
  };

  const multiplyParsed = (pMatrix, point) => {
    const result = multiplyMatrixes(pMatrix, point);
    const [x, y, z, n] = result.flat();
    return { x, y, z, n };
  };

  const rotateX3d = (point, angle) =>
    multiplyParsed(getRotateXMatrix(angle), generatePointMatrix(point));

  const rotateY3d = (point, angle) =>
    multiplyParsed(getRotateYMatrix(angle), generatePointMatrix(point));

  const rotateZ3d = (point, angle) =>
    multiplyParsed(getRotateZMatrix(angle), generatePointMatrix(point));

  const rotatePoint = ({ x, y, z }, point) =>
    multiplyParsed(
      math.multiply(
        getRotateXMatrix(x),
        getRotateYMatrix(y),
        getRotateZMatrix(z)
      ),
      generatePointMatrix(point)
    );

  const perspectiveProjection = (point, distance, fi) => {
    const perspectivePoint = perspectiveMultiplyParse(
      getPerspectiveMatrix2(1, fi),
      generatePointMatrix(point),
      distance
    );
    return perspectivePoint;
  };

  const translatePoint = (point, translation) =>
    multiplyParsed(
      getTranslationMatrix(translation),
      generatePointMatrix(point)
    );

  const rotatePointAroundLine = (point, T1, rotateObj, degree) => {
    const T2 = {
      x: T1.x + rotateObj.A,
      y: T1.y + rotateObj.B,
      z: T1.z + rotateObj.C,
    };

    const translationMatrix = getTranslationMatrix({
      x: -T1.x,
      y: -T1.y,
      z: -T1.z,
    });
    const rotateLineXMatrix = getRotateXLineMatrix(rotateObj);
    const rotateLineYMatrix = getRotateYLineMatrix(rotateObj);

    return multiplyParsed(
      math.multiply(
        math.multiply(math.inv(translationMatrix), math.inv(rotateLineXMatrix)),
        math.inv(rotateLineYMatrix),
        getRotateXMatrix(degree),
        rotateLineYMatrix,
        rotateLineXMatrix,
        translationMatrix
      ),
      generatePointMatrix(point)
    );
  };

  const multiplyScale = (pMatrix, point, s) => {
    const result = multiplyMatrixes(pMatrix, point);
    const [x, y, z, n] = result.flat().map((value) => value * s);
    return { x, y, z, n };
  };

  const scalePoint = (point, s) =>
    multiplyScale(getScaleMatrix(s), generatePointMatrix(point), s);

  return {
    perspectiveProjection,
    rotateX3d,
    rotateZ3d,
    rotateY3d,
    translatePoint,
    getRotateXLineMatrix,
    getRotateYLineMatrix,
    getTranslationMatrix,
    rotatePointAroundLine,
    scalePoint,
    getPerspectiveMatrix2,
    rotatePoint,
  };
};
