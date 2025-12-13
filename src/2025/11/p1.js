import { getData, measureExecutionTime } from '../../lib/utils';

const data = await getData(import.meta.dir, false);

const graph = new Map(
  data.split('\n').map((line) => {
    const [node, destNodesStr] = line.split(':');

    return [node, destNodesStr.trim().split(' ')];
  })
);

function main() {
  let totalPaths = 0;
  const stack = graph.get('you');

  while (stack.length) {
    const node = stack.pop();
    const destNodes = graph.get(node);

    for (const destNode of destNodes) {
      if (destNode === 'out') {
        totalPaths += 1;
        continue;
      }

      stack.push(destNode);
    }
  }

  return totalPaths;
}

console.log(measureExecutionTime(main));
