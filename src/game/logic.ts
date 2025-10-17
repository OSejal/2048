export type Direction = 'up' | 'down' | 'left' | 'right';
export type Board = number[][];

export interface GameState {
  board: Board;
  score: number;
  won: boolean;
  over: boolean;
}

function createEmptyBoard(size: number): Board {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function getEmptyCells(board: Board) {
  const cells: { r: number; c: number }[] = [];
  board.forEach((row, r) =>
    row.forEach((val, c) => val === 0 && cells.push({ r, c }))
  );
  return cells;
}

function addRandomTile(board: Board): Board {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return board;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

export function initializeGame(size = 4): GameState {
  let board = createEmptyBoard(size);
  board = addRandomTile(board);
  board = addRandomTile(board);
  return { board, score: 0, won: false, over: false };
}

function slide(line: number[]) {
  const arr = line.filter(n => n !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      arr[i + 1] = 0;
    }
  }
  return arr.filter(n => n !== 0);
}

function moveLeft(board: Board): { newBoard: Board; score: number; moved: boolean } {
  let score = 0;
  const newBoard = board.map(row => {
    const newRow = slide(row);
    while (newRow.length < board.length) newRow.push(0);
    score += newRow.reduce((s, n) => s + (n === 0 ? 0 : n), 0);
    return newRow;
  });
  const moved = JSON.stringify(board) !== JSON.stringify(newBoard);
  return { newBoard, score, moved };
}

function rotateClockwise(board: Board): Board {
  const size = board.length;
  const newBoard = createEmptyBoard(size);
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      newBoard[c][size - 1 - r] = board[r][c];
  return newBoard;
}

export function move(board: Board, dir: Direction): { board: Board; score: number; moved: boolean } {
  let working = board;
  let turns = 0;
  if (dir === 'up') turns = 3;
  else if (dir === 'right') turns = 2;
  else if (dir === 'down') turns = 1;

  // Rotate board to reuse "moveLeft"
  for (let i = 0; i < turns; i++) working = rotateClockwise(working);

  const { newBoard, score, moved } = moveLeft(working);

  // Rotate back to original direction
  let rotatedBack = newBoard;
  for (let i = 0; i < (4 - turns) % 4; i++) rotatedBack = rotateClockwise(rotatedBack);

  return { board: rotatedBack, score, moved };
}


export function applyMove(state: GameState, dir: Direction): GameState {
  const { board, score } = state;
  const { board: moved, score: gained, moved: didMove } = move(board, dir);
  if (!didMove) return state;

  const newBoard = addRandomTile(moved);
  const won = newBoard.flat().includes(2048);
  const over = !won && getEmptyCells(newBoard).length === 0;
  return { board: newBoard, score: score + gained, won, over };
}
