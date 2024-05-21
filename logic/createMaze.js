let mazeSize = 5; // Tamaño predeterminado
let maze = [];
let cordsInicio = '';
let cordsFinal = '';
let hayInicio = false;
let hayFinal = false;

function createMaze() {
  mazeSize = parseInt(document.getElementById('mazeSize').value);
  generateMatrix();
  renderMaze();
}

function generateMatrix() {
  maze = Array.from({ length: mazeSize }, () => Array(mazeSize).fill(' '));
}

function renderMaze() {
  const mazeDiv = document.getElementById('maze');
  mazeDiv.innerHTML = '';

  for (let i = 0; i < mazeSize; i++) {
    for (let j = 0; j < mazeSize; j++) {
      const button = document.createElement('button');
      button.id = 'mazeButton';
      button.textContent = ' ';
      button.style.backgroundColor = 'grey';
      button.onclick = () => toggleCell(i, j, button);
      mazeDiv.appendChild(button);
    }
    mazeDiv.appendChild(document.createElement('br'));
  }
}

function toggleCell(i, j, button) {
  switch (maze[i][j]) {
    case ' ':
      maze[i][j] = '|';
      button.style.backgroundColor = 'black';
      button.style.color = 'red';
      button.textContent = '|';
      break;
    case '|':
      maze[i][j] = '-';
      button.style.backgroundColor = 'black';
      button.style.color = 'red';
      button.textContent = '-';
      break;
    case '-':
      if (!hayInicio) {
        maze[i][j] = 'S';
        button.style.backgroundColor = 'green';
        button.style.color = 'white';
        button.textContent = 'S';
        hayInicio = true;
        break;
      } else if (!hayFinal) {
        maze[i][j] = 'E';
        button.style.backgroundColor = 'red';
        button.style.color = 'white';
        button.textContent = 'E';
        hayFinal = true;
        break;
      } else {
        maze[i][j] = '|';
        button.style.backgroundColor = 'black';
        button.style.color = 'red';
        button.textContent = '|';
        break;
      }
    case 'S':
      if (!hayFinal) {
        maze[i][j] = 'E';
        button.style.backgroundColor = 'red';
        button.style.color = 'white';
        button.textContent = 'E';
        hayInicio = false;
        hayFinal = true;
        break;
      } else {
        maze[i][j] = ' ';
        button.style.backgroundColor = 'grey';
        button.style.color = 'red';
        button.textContent = ' ';
        hayInicio = false;
        break;
      }

    case 'E':
      maze[i][j] = ' ';
      button.style.backgroundColor = 'grey';
      button.style.color = 'red';
      button.textContent = ' ';
      hayFinal = false;
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
        cordsFinal = `(${i},${j})`;
        return ' ';
      }
      return cell;
    })
  );


  if (inicio && final) {
    const mazeContent = mazeCopy.map(row => row.join('')).join('\n') + `\n${cordsInicio}${cordsFinal}`;
    const blob = new Blob([mazeContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'maze.txt';
    link.click();
  } else {
    alert("Debes colocar tanto un inicio (S) como un final (E) en el laberinto para poder descargarlo.");
    return;
  }
}
