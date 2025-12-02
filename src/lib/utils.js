import { join } from 'node:path';

export async function getData(callerDir, isExample) {
  const filename = isExample ? 'example' : 'data';
  const filePath = join(callerDir, `${filename}.txt`);
  return (await Bun.file(filePath).text()).trim();
}

export function measureExecutionTime(callback) {
  console.time('Execution Time');
  const result = callback();
  console.timeEnd('Execution Time');

  return result;
}
