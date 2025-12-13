import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const lines = data.split('\n').map((line) => line.split(''));

function main() {
  const beamsMap = new Map([[lines[0].indexOf('S'), 1]]);

  for (let i = 2; i < lines.length; i += 2) {
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      if (line[j] !== '^') continue;

      if (!beamsMap.has(j)) continue;

      const beamIntensity = beamsMap.get(j);

      beamsMap.set(j - 1, (beamsMap.get(j - 1) || 0) + beamIntensity);
      beamsMap.set(j + 1, (beamsMap.get(j + 1) || 0) + beamIntensity);

      beamsMap.delete(j);
    }
  }

  let totalTimelines = 0;
  for (const beamIntensity of beamsMap.values()) {
    totalTimelines += beamIntensity;
  }

  return totalTimelines;
}

console.log(measureExecutionTime(main));
