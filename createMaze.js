let mazeSize = 5;
let maze = [];
let cordsInicio = '';
let cordsFinal = '';
let hayInicio = false;
let hayFinal = false;

function createMaze() {
  mazeSize = parseInt(document.getElementById('mazeSize').value);
  hayInicio = false;
  hayFinal = false;
  generateMatrix();
  renderMaze();
}

function generateMatrix() {
  maze = Array.from({ length: mazeSize }, () => Array(mazeSize).fill('X'));
}

function renderMaze() {
  console.log('render maze');
  const mazeDiv = document.getElementById('maze');
  mazeDiv.innerHTML = '';

  for (let i = 0; i < mazeSize; i++) {
    const div = document.createElement('div');
    div.className = 'mazeRow';
    for (let j = 0; j < mazeSize; j++) {
      const button = document.createElement('button');
      button.className = 'mazeButton';
      button.textContent = 'X';
      button.style.backgroundColor = 'var(--primary)';
      button.onclick = () => toggleCell(i, j, button);
      div.appendChild(button);
    }
    mazeDiv.appendChild(div);
  }
}

function toggleCell(i, j, button) {
  console.log('toggleCell');
  const states = ['X', 'S', 'E', '|', '-'];
  const currentState = maze[i][j];
  let nextIndex = (states.indexOf(currentState) + 1) % states.length;
  let nextState = states[nextIndex];

  if (currentState === 'S') {
    hayInicio = false;
  } else if (currentState === 'E') {
    hayFinal = false;
  }

  while ((nextState === 'S' && hayInicio) || (nextState === 'E' && hayFinal)) {
    nextIndex = (nextIndex + 1) % states.length;
    nextState = states[nextIndex];
  }

  if (nextState === 'S') {
    hayInicio = true;
  } else if (nextState === 'E') {
    hayFinal = true;
  }

  maze[i][j] = nextState;
  updateButton(button, nextState);
}

function updateButton(button, state) {
  button.textContent = state;
  switch (state) {
    case 'X':
      button.style.backgroundColor = 'var(--primary)';
      button.style.color = 'transparent';
      break;
    case '|':
      button.style.backgroundColor = 'var(--wall)';
      button.style.color = 'var(--secondary)';
      break;
    case '-':
      button.style.backgroundColor = 'var(--wall)';
      button.style.color = 'var(--secondary)';
      break;
    case 'S':
      button.style.backgroundColor = 'green';
      button.style.color = 'white';
      break;
      case 'E':
      button.style.backgroundColor = 'red';
      button.style.color = 'white';
      break;
  }
}

function downloadMaze() {
  let cordsInicio = '';
  let cordsFinal = '';
  let inicio = false;
  let final = false;

  const mazeCopy = maze.map((row, i) =>
    row.map((cell, j) => {
      if (cell === 'S') {
        inicio = true;
        cordsInicio = `(${i},${j})`;
        return ' ';
      } else if (cell === 'E') {
        final = true;
        cordsFinal = `,(${i},${j})`;
        return ' ';
      }
      return cell;
    })
  );

  if (inicio && final) {
    const replaceXWithSpace = (str) => str.replace(/X/g, ' ');

    const mazeContent =
      mazeCopy
        .map((row) => row.join(''))
        .map(replaceXWithSpace)
        .join('\n') + `\n${cordsInicio}${cordsFinal}\n${mazeSize}`;
    const blob = new Blob([mazeContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'maze.txt';
    link.click();
  } else {
    alert('You must place both a start (S) and an end (E) in the maze in order to unload it.');
    return;
  }
}
