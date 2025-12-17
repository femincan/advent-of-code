import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);
const lines = data.split('\n');
const shapeCorners = lines.map((line) => line.split(',').map(Number));
const shapeCornersSet = new Set(lines);
const shapeEdges = shapeCorners.map((corner, i) => [
  corner,
  shapeCorners.at((i + 1) % shapeCorners.length),
]);
const shapeVerticalEdges = shapeEdges.filter(
  (edge) => edge[0][0] === edge[1][0]
);
const shapeHorizontalEdges = shapeEdges.filter(
  (edge) => edge[0][1] === edge[1][1]
);
const insideCorners = new Set();
const outsideCorners = new Set();

function main() {
  let largestArea = 0;

  for (let i = 0; i < shapeCorners.length - 1; i++) {
    const [x1, y1] = shapeCorners[i];

    for (let j = i + 1; j < shapeCorners.length; j++) {
      const [x2, y2] = shapeCorners[j];

      // Assume the largest shape should not be only-height or only-width
      if (x1 === x2 || y1 === y2) continue;

      const area = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);

      if (area < largestArea) continue;

      const rectCorners = [
        [x1, y1],
        [x1, y2],
        [x2, y1],
        [x2, y2],
      ];

      const isCornersInside = checkCornersInside(
        rectCorners,
        shapeVerticalEdges
      );

      if (!isCornersInside) continue;

      const rectEdges = [
        [
          [x1, y1],
          [x2, y1],
        ],
        [
          [x2, y1],
          [x2, y2],
        ],
        [
          [x2, y2],
          [x1, y2],
        ],
        [
          [x1, y2],
          [x1, y1],
        ],
      ];

      const isEdgesInside = checkEdgesInside(rectEdges, shapeEdges);

      if (!isEdgesInside) continue;

      largestArea = area;
    }
  }
  return largestArea;
}

console.log(measureExecutionTime(main));

function checkCornersInside(rectCorners) {
  for (const [px, py] of rectCorners) {
    const key = `${px},${py}`;

    if (outsideCorners.has(key)) return false;
    if (insideCorners.has(key) || shapeCornersSet.has(key)) continue;

    let crossingCount = 0;

    for (const [[x, y1], [, y2]] of shapeVerticalEdges) {
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      if (py >= minY && py < maxY && px <= x) {
        crossingCount += 1;
      }
    }

    if (crossingCount === 0 || crossingCount % 2 === 0) {
      outsideCorners.add(key);
      return false;
    }

    insideCorners.add(key);
  }

  return true;
}

function checkEdgesInside(rectEdges) {
  for (const [[x1, y1], [x2, y2]] of rectEdges) {
    const isRectEdgeVertical = x1 === x2;

    if (isRectEdgeVertical) {
      const x = x1;
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      for (const [[hx1, hy], [hx2]] of shapeHorizontalEdges) {
        const minHx = Math.min(hx1, hx2);
        const maxHx = Math.max(hx1, hx2);

        if (x > minHx && x < maxHx && hy > minY && hy < maxY) {
          return false;
        }
      }
    } else {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const y = y1;

      for (const [[hx, hy1], [, hy2]] of shapeVerticalEdges) {
        const minHy = Math.min(hy1, hy2);
        const maxHy = Math.max(hy1, hy2);

        if (hx > minX && hx < maxX && y > minHy && y < maxHy) {
          return false;
        }
      }
    }
  }

  return true;
}
