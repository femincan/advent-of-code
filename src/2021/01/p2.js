const input = (await Bun.file(`${import.meta.dir}/data.txt`).text())
  .split('\n')
  .map((line) => line.split('').map((num) => parseInt(num)));

let step = 1;
while (true) {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      input[i][j] += 1;
    }
  }
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] > 9) {
        flash(i, j);
      }
    }
  }

  let allFlashed = true;
  outer: for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] !== 0) {
        allFlashed = false;
        break outer;
      }
    }
  }

  if (allFlashed) {
    break;
  }

  step++;
}

function flash(row, col) {
  if (input[row][col] === -1) {
    return;
  }

  // Mark octopus to inform that
  // it already flashed
  input[row][col] = -1;

  // Adjacents in above and below line
  for (let j = -1; j <= 1; j += 2) {
    for (let i = -1; i <= 1; i++) {
      if (input[row + j]?.[col + i]) {
        if (input[row + j][col + i] === 9) {
          flash(row + j, col + i);
        } else {
          input[row + j][col + i] += 1;
        }
      }
    }
  }

  // Adjacents in current line
  for (let i = -1; i <= 1; i += 2) {
    if (input[row]?.[col + i]) {
      if (input[row][col + i] === 9) {
        flash(row, col + i);
      } else {
        input[row][col + i] += 1;
      }
    }
  }

  input[row][col] = 0;
}

console.log(step);
