import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const lines = data.split('\n');

function main() {
  let totalJoltage = 0;

  for (const bank of lines) {
    let p1 = bank[0],
      p2 = bank[1];
    for (let i = 1; i < bank.length; i++) {
      const batteryChargeLevel = bank[i];

      if (batteryChargeLevel > p1 && i !== bank.length - 1) {
        p1 = bank[i];
        p2 = bank[i + 1];
        continue;
      }

      if (batteryChargeLevel > p2) {
        p2 = bank[i];
      }
    }

    totalJoltage += p1 * 10 + p2 * 1;
  }

  return totalJoltage;
}

console.log(measureExecutionTime(main));
