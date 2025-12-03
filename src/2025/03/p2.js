import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const lines = data.split('\n');

function main() {
  let totalJoltage = 0;

  for (const bank of lines) {
    const batterySelections = Array.from({ length: 12 }, () => null);

    for (let i = 0; i < bank.length; i++) {
      let selected = false;
      for (let j = 0; j < batterySelections.length; j++) {
        if (selected) {
          batterySelections[j] = null;
          continue;
        }

        if (
          bank[i] > batterySelections[j] &&
          batterySelections.length - j <= bank.length - i
        ) {
          batterySelections[j] = bank[i];
          selected = true;
        }
      }
    }

    totalJoltage += Number(batterySelections.join(''));
  }

  return totalJoltage;
}

console.log(measureExecutionTime(main));
