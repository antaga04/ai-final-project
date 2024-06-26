let maze, start, end;
let fifoResult, lifoResult;
let fifoSteps = null; // Number of steps for FIFO
let lifoSteps = null; // Number of steps for LIFO

const readFile = (files) => {
  const file = files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const content = event.target.result;
      const lines = content.split('\n');
      const size = parseInt(lines.pop());
      const coordinates = lines.pop().split('),(');

      start = coordinates[0].replace('(', '').replace(')', '').split(',').map(Number);
      end = coordinates[1].replace('(', '').replace(')', '').split(',').map(Number);
      maze = Array.from({ length: size }, () => Array(size).fill(' '));

      lines.forEach((line, y) => {
        for (let x = 0; x < line.length; x++) {
          if (line[x] !== ' ') maze[y][x] = line[x];
        }
      });

      document.getElementById('message').textContent =
        'File loaded correctly. Choose an option to solve the maze.';
      document
        .querySelectorAll('#option_buttons button')
        .forEach((button) => (button.disabled = false));

      fifoResult = null;
      lifoResult = null;
    } catch (err) {
      console.log(err);
      document.getElementById('message').textContent =
        'Incorrect file format. Select another file.';
    }
  };

  reader.readAsText(file);
};

const fifoAlgorithm = () => {
  if (!maze) return;
  const algorithm = 'fifo';

  const directions = [
    { x: -1, y: 0 }, // Up
    { x: 0, y: -1 }, // Left
    { x: 1, y: 0 }, // Down
    { x: 0, y: 1 }, // Right
  ];
  const queue = [start];
  const visited = new Set([`${start[0]},${start[1]}`]);
  const path = [];
  const queueStates = []; // Store the state of the queue in each step
  let steps = 0;
  let stepsDeMas = 0;
  let found = false;

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    path.push([x, y]);
    queueStates.push([...queue]); // Store a copy of the current queue

    if (x === end[0] && y === end[1]) {
      found = true;
      steps++;
    } else if (!(x === end[0] && y === end[1]) && !found) {
      steps++;
    }

    for (const { x: dx, y: dy } of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (
        newX >= 0 &&
        newX < maze.length &&
        newY >= 0 &&
        newY < maze[0].length &&
        maze[newX][newY] === ' ' &&
        !visited.has(`${newX},${newY}`)
      ) {
        queue.push([newX, newY]);
        visited.add(`${newX},${newY}`);
      }
    }
  }

  if (found) {
    showMaze(path, algorithm);
    showQueueOrStack(queueStates, path, algorithm); // Pass the queue states
    fifoSteps = steps; // Save the number of steps
    fifoResult = path; // Save the result
    return true;
  }

  showMaze(path, algorithm);
  showQueueOrStack(queueStates, path, algorithm); // Pass the queue states
  fifoSteps = steps; // Save the number of steps
  console.log('No valid path found.');
  fifoResult = path; // Save the result
  return false;
};

const lifoAlgorithm = () => {
  if (!maze) return;

  const algorithm = 'lifo';

  const directions = [
    { x: -1, y: 0 }, // Up
    { x: 0, y: -1 }, // Left
    { x: 1, y: 0 }, // Down
    { x: 0, y: 1 }, // Right
  ];

  const stack = [start];
  const visited = new Set([`${start[0]},${start[1]}`]);
  const path = [];
  const stackStates = []; // Store the state of the stack in each step
  let steps = 0;
  let found = false;

  while (stack.length > 0) {
    const [x, y] = stack.pop();
    path.push([x, y]);
    stackStates.push([...stack]); // Store a copy of the current stack

    if (x === end[0] && y === end[1]) {
      found = true;
      steps++;
    } else if (!(x === end[0] && y === end[1]) && !found) {
      steps++;
    }

    // Push directions in reverse order to achieve the correct processing order
    for (let i = directions.length - 1; i >= 0; i--) {
      const { x: dx, y: dy } = directions[i];
      const newX = x + dx;
      const newY = y + dy;

      if (
        newX >= 0 &&
        newX < maze.length &&
        newY >= 0 &&
        newY < maze[0].length &&
        maze[newX][newY] === ' ' &&
        !visited.has(`${newX},${newY}`)
      ) {
        stack.push([newX, newY]);
        visited.add(`${newX},${newY}`);
      }
    }
  }

  if (found) {
    showMaze(path, algorithm);
    showQueueOrStack(stackStates, path, algorithm); // Pass the stack states
    lifoSteps = steps; // Save the number of steps
    lifoResult = path; // Save the result
    return true;
  }

  showMaze(path, algorithm);
  showQueueOrStack(stackStates, path, algorithm); // Pass the stack states
  lifoSteps = steps; // Save the number of steps
  console.log('No valid path found.');
  lifoResult = path; // Save the result
  return false;
};

const showMaze = (path, algorithm) => {
  const mazeContainer = document.getElementById(`${algorithm}_maze`);
  const h2 = document.createElement('h2');
  h2.innerText = `${algorithm.toUpperCase()} SOLVED MAZE`;

  mazeContainer.innerHTML = '';
  const tableContainer = document.createElement('div');
  tableContainer.classList.add('tableContainer');
  const table = document.createElement('table');

  maze.forEach((row, y) => {
    const tr = document.createElement('tr');
    tr.classList.add('mazeTr');
    row.forEach((cell, x) => {
      const td = document.createElement('td');
      td.className = 'cell';

      const stepIndex = path.findIndex(([py, px]) => py === y && px === x);
      if (stepIndex !== -1) {
        td.classList.add('path');
        td.textContent = stepIndex;
      }

      if (y === start[0] && x === start[1]) {
        td.classList.add('start');
        td.textContent = 'S';
      } else if (y === end[0] && x === end[1]) {
        td.classList.add('end');
        td.textContent = 'E';
      } else if (cell === '|') {
        td.classList.add('wall');
      } else if (cell === '-') {
        td.classList.add('wall');
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  mazeContainer.appendChild(h2);
  tableContainer.appendChild(table);
  mazeContainer.appendChild(tableContainer);
};

const showQueueOrStack = (states, path, algorithm) => {
  const container = document.getElementById(
    `${algorithm}_path_${algorithm === 'fifo' ? 'queue' : 'stack'}`
  );
  container.innerHTML = `<h3>${algorithm.toUpperCase()} Path and ${
    algorithm === 'fifo' ? 'Queue' : 'Stack'
  }</h3>`;

  const table = document.createElement('table');
  table.classList.add('data_table');
  const header = table.insertRow();
  const th1 = document.createElement('th');
  th1.textContent = 'Step';
  const th2 = document.createElement('th');
  th2.textContent = 'Coordinates';
  const th3 = document.createElement('th');
  th3.textContent = `${algorithm === 'fifo' ? 'Queue' : 'Stack'} State`;
  header.appendChild(th1);
  header.appendChild(th2);
  header.appendChild(th3);

  path.forEach((step, index) => {
    const row = table.insertRow();
    row.insertCell().textContent = index;
    row.insertCell().textContent = `(${step[0]}, ${step[1]})`;
    row.insertCell().textContent = JSON.stringify(states[index] || []);
  });

  container.appendChild(table);
};

const loadExample = () => {
  const exampleContent = `
--------|
        | 
   ---- |
 |      |
 |--  |-|
 |       
 |--| | |
 |     ||
    |    
(1,1),(6,7)
9`;
  const blob = new Blob([exampleContent.trim()], { type: 'text/plain' });
  const file = new File([blob], 'example.txt', { type: 'text/plain' });
  readFile([file]);
};

const setActiveButton = (activeButtonId) => {
  document.querySelectorAll('#lifoBtn, #fifoBtn, #compareBtn').forEach((button) => {
    button.classList.remove('active');
  });
  document.getElementById(activeButtonId).classList.add('active');
};

const showResult = (algorithm) => {
  const fifoMazeElement = document.getElementById('fifo_maze');
  const lifoMazeElement = document.getElementById('lifo_maze');
  const fifoPathQueueElement = document.getElementById('fifo_path_queue');
  const lifoPathStackElement = document.getElementById('lifo_path_stack');
  const fifoTimeElement = document.getElementById('fifoTime');
  const lifoTimeElement = document.getElementById('lifoTime');

  fifoMazeElement.style.display =
    algorithm === 'fifo' || algorithm === 'compare' ? 'block' : 'none';
  lifoMazeElement.style.display =
    algorithm === 'lifo' || algorithm === 'compare' ? 'block' : 'none';
  fifoPathQueueElement.style.display =
    algorithm === 'fifo' || algorithm === 'compare' ? 'block' : 'none';
  lifoPathStackElement.style.display =
    algorithm === 'lifo' || algorithm === 'compare' ? 'block' : 'none';

  if (algorithm === 'fifo' || algorithm === 'compare') {
    fifoTimeElement.textContent =
      fifoSteps !== null ? `FIFO Number of Steps: ${fifoSteps - 2}` : '';
    fifoTimeElement.style.display = 'block';
  } else {
    fifoTimeElement.style.display = 'none';
  }

  if (algorithm === 'lifo' || algorithm === 'compare') {
    lifoTimeElement.textContent =
      lifoSteps !== null ? `LIFO Number of Steps: ${lifoSteps - 2}` : '';
    lifoTimeElement.style.display = 'block';
  } else {
    lifoTimeElement.style.display = 'none';
  }
};

const clearMaze = () => {};

document.getElementById('fileInput').addEventListener('change', (event) => {
  readFile(event.target.files);
});

document.getElementById('fifoBtn').addEventListener('click', () => {
  if (maze) {
    setActiveButton('fifoBtn');
    if (!fifoResult) fifoAlgorithm(); // Only calculate if not already done
    showResult('fifo');
  } else {
    document.getElementById('message').textContent = 'You must load a file first.';
  }
});

document.getElementById('lifoBtn').addEventListener('click', () => {
  if (maze) {
    setActiveButton('lifoBtn');
    if (!lifoResult) lifoAlgorithm(); // Only calculate if not already done
    showResult('lifo');
  } else {
    document.getElementById('message').textContent = 'You must load a file first.';
  }
});

document.getElementById('compareBtn').addEventListener('click', () => {
  if (maze) {
    setActiveButton('compareBtn');
    if (!lifoResult) lifoAlgorithm(); // Only calculate if not already done
    if (!fifoResult) fifoAlgorithm(); // Only calculate if not already done
    showResult('compare');
  } else {
    document.getElementById('message').textContent = 'You must load a file first.';
  }
});

document.getElementById('exampleBtn').addEventListener('click', loadExample);

document.getElementById('fileInput').addEventListener('change', (event) => {
  readFile(event.target.files);
});

// document.getElementById('clearMaze').addEventListener('click', clearMaze);
