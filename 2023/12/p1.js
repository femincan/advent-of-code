console.time('Execution Time');

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = true;
const filePath = join(__dirname, example ? 'example.txt' : 'data.txt');
const data = readFileSync(filePath).toString().trim().split('\n');
const records = data.map((line) => {
  const [conditionRecords, rawGroupInfos] = line.split(' ');

  const groupInfos = rawGroupInfos.match(/\d/g).map((item) => Number(item));

  return { conditionRecords, groupInfos };
});

console.log(records);

console.timeEnd('Execution Time');
