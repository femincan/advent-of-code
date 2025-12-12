import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const lines = data.split('\n');

function main() {
  let totalJoltage = 0;

  for (let bank of lines) {
    const batterySelections = Array.from({ length: 12 }, () => undefined);

    for (let i = batterySelections.length - 1; i >= 0; i--) {
      const availableBatteries = bank.slice(0, bank.length - i);

      const maxBattery = Math.max(...availableBatteries);
      batterySelections[i] = maxBattery;

      bank = bank.slice(bank.indexOf(maxBattery) + 1);
    }

    totalJoltage += batterySelections.reduce(
      (num, batteryVal, i) => num + batteryVal * 10 ** i,
      0
    );
  }

  return totalJoltage;
}

console.log(measureExecutionTime(main));
