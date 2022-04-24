const Matrix = () => {
  const getTranslationMatrix = ({ x, y, z }) => [
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1],
  ];

  const getPerspectiveMatrix = (d) => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 1 / d, 1],
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

  const perspectiveProjection = (point, distance) =>
    perspectiveMultiplyParse(
      getPerspectiveMatrix(distance),
      generatePointMatrix(point),
      distance
    );

  const translatePoint = (point, translation) =>
    multiplyParsed(
      getTranslationMatrix(translation),
      generatePointMatrix(point)
    );

  return {
    perspectiveProjection,
    rotateX3d,
    rotateZ3d,
    rotateY3d,
    translatePoint,
  };
};
