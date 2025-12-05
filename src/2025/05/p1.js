import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const [_freshRanges, _idList] = data
  .split('\n\n')
  .map((item) => item.split('\n'));

const freshRanges = _freshRanges.map((range) => range.split('-').map(Number));
const idList = _idList.map(Number);

function main() {
  let count = 0;
  for (const id of idList) {
    count += freshRanges.some((range) => id >= range[0] && id <= range[1])
      ? 1
      : 0;
  }

  return count;
}

console.log(measureExecutionTime(main));
