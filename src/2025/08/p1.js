import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

function main() {
  const coordinates = data
    .split('\n')
    .map((coordStr) => coordStr.split(',').map(Number));
  const circuits = new Set();
  const shortestDistances = new Set();

  for (let i = 0; i < 1000; i++) {
    let shortestDistance = Infinity;
    let coord1, coord2;

    for (let i = 0; i < coordinates.length; i++) {
      const [x1, y1, z1] = coordinates[i];
      for (let j = i + 1; j < coordinates.length; j++) {
        const [x2, y2, z2] = coordinates[j];
        const distance = Math.sqrt(
          (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
        );

        if (distance > shortestDistance || shortestDistances.has(distance))
          continue;

        shortestDistance = distance;
        coord1 = i;
        coord2 = j;
      }
    }

    shortestDistances.add(shortestDistance);
    let newCircuit = new Set();
    circuits.forEach((circuit) => {
      if (circuit.has(coord1) || circuit.has(coord2)) {
        newCircuit = newCircuit.union(circuit);
        circuits.delete(circuit);
      }
    });
    if (newCircuit.size) {
      newCircuit.add(coord1);
      newCircuit.add(coord2);
      circuits.add(newCircuit);
    } else {
      circuits.add(new Set([coord1, coord2]));
    }
  }

  const circuitsArr = Array.from(circuits).sort(
    (circuit1, circuit2) => circuit2.size - circuit1.size
  );

  return circuitsArr[0].size * circuitsArr[1].size * circuitsArr[2].size;
}

console.log(measureExecutionTime(main));
