const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const movesChip = document.getElementById("movesChip");
const timeChip = document.getElementById("timeChip");
const levelValue = document.getElementById("levelValue");
const hintValue = document.getElementById("hintValue");
const newBtn = document.getElementById("newBtn");
const hintBtn = document.getElementById("hintBtn");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const overlayBtn = document.getElementById("overlayBtn");

const state = {
  cols: 18,
  rows: 18,
  grid: [],
  stack: [],
  cellSize: 0,
  player: { x: 0, y: 0 },
  exit: { x: 0, y: 0 },
  moves: 0,
  startTime: null,
  elapsed: 0,
  hint: false,
  solution: [],
};

const levelLabels = {
  12: "Kolay",
  18: "Orta",
  26: "Zor",
};

function initGrid() {
  state.grid = Array.from({ length: state.rows }, (_, y) =>
    Array.from({ length: state.cols }, (_, x) => ({
      x,
      y,
      visited: false,
      walls: { top: true, right: true, bottom: true, left: true },
    }))
  );
}

function cellAt(x, y) {
  if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) return null;
  return state.grid[y][x];
}

function neighbors(cell) {
  const dirs = [
    { dx: 0, dy: -1, side: "top", opposite: "bottom" },
    { dx: 1, dy: 0, side: "right", opposite: "left" },
    { dx: 0, dy: 1, side: "bottom", opposite: "top" },
    { dx: -1, dy: 0, side: "left", opposite: "right" },
  ];

  return dirs
    .map((d) => ({
      dir: d,
      cell: cellAt(cell.x + d.dx, cell.y + d.dy),
    }))
    .filter((n) => n.cell && !n.cell.visited);
}

function carveMaze() {
  initGrid();
  const start = cellAt(0, 0);
  start.visited = true;
  state.stack = [start];

  while (state.stack.length) {
    const current = state.stack[state.stack.length - 1];
    const available = neighbors(current);

    if (!available.length) {
      state.stack.pop();
      continue;
    }

    const next = available[Math.floor(Math.random() * available.length)];
    current.walls[next.dir.side] = false;
    next.cell.walls[next.dir.opposite] = false;
    next.cell.visited = true;
    state.stack.push(next.cell);
  }
}

function computeSolution() {
  const queue = [{ x: 0, y: 0 }];
  const visited = new Set(["0,0"]);
  const parent = new Map();

  while (queue.length) {
    const node = queue.shift();
    if (node.x === state.exit.x && node.y === state.exit.y) break;

    const cell = cellAt(node.x, node.y);
    const steps = [
      { dx: 0, dy: -1, wall: "top" },
      { dx: 1, dy: 0, wall: "right" },
      { dx: 0, dy: 1, wall: "bottom" },
      { dx: -1, dy: 0, wall: "left" },
    ];

    for (const step of steps) {
      if (cell.walls[step.wall]) continue;
      const nx = node.x + step.dx;
      const ny = node.y + step.dy;
      const key = `${nx},${ny}`;
      if (visited.has(key)) continue;
      visited.add(key);
      parent.set(key, node);
      queue.push({ x: nx, y: ny });
    }
  }

  const path = [];
  let cursor = state.exit;
  while (cursor) {
    path.push({ x: cursor.x, y: cursor.y });
    const key = `${cursor.x},${cursor.y}`;
    cursor = parent.get(key);
  }
  state.solution = path.reverse();
}

function resize() {
  const size = Math.min(canvas.parentElement.clientWidth, 720);
  canvas.width = size;
  canvas.height = size;
  state.cellSize = size / state.cols;
  draw();
}

function resetGame() {
  state.moves = 0;
  state.elapsed = 0;
  state.startTime = performance.now();
  state.player = { x: 0, y: 0 };
  state.exit = { x: state.cols - 1, y: state.rows - 1 };
  state.hint = false;
  hintValue.textContent = "Kapalı";
  carveMaze();
  computeSolution();
  updateHud();
  draw();
}

function updateHud() {
  movesChip.textContent = `Hamle: ${state.moves}`;
  const minutes = Math.floor(state.elapsed / 60);
  const seconds = Math.floor(state.elapsed % 60);
  timeChip.textContent = `Süre: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimer() {
  if (!state.startTime) return;
  const now = performance.now();
  state.elapsed = (now - state.startTime) / 1000;
  updateHud();
}

function drawCell(cell) {
  const x = cell.x * state.cellSize;
  const y = cell.y * state.cellSize;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = Math.max(2, state.cellSize * 0.08);

  if (cell.walls.top) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + state.cellSize, y);
    ctx.stroke();
  }
  if (cell.walls.right) {
    ctx.beginPath();
    ctx.moveTo(x + state.cellSize, y);
    ctx.lineTo(x + state.cellSize, y + state.cellSize);
    ctx.stroke();
  }
  if (cell.walls.bottom) {
    ctx.beginPath();
    ctx.moveTo(x, y + state.cellSize);
    ctx.lineTo(x + state.cellSize, y + state.cellSize);
    ctx.stroke();
  }
  if (cell.walls.left) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + state.cellSize);
    ctx.stroke();
  }
}

function drawSolution() {
  if (!state.hint || !state.solution.length) return;
  ctx.strokeStyle = "rgba(94, 228, 255, 0.7)";
  ctx.lineWidth = Math.max(2, state.cellSize * 0.25);
  ctx.beginPath();
  for (let i = 0; i < state.solution.length; i++) {
    const node = state.solution[i];
    const cx = node.x * state.cellSize + state.cellSize / 2;
    const cy = node.y * state.cellSize + state.cellSize / 2;
    if (i === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
}

function drawPlayer() {
  const px = state.player.x * state.cellSize + state.cellSize / 2;
  const py = state.player.y * state.cellSize + state.cellSize / 2;
  ctx.fillStyle = "#ff8b3d";
  ctx.shadowColor = "rgba(255, 139, 61, 0.7)";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(px, py, state.cellSize * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawExit() {
  const ex = state.exit.x * state.cellSize + state.cellSize / 2;
  const ey = state.exit.y * state.cellSize + state.cellSize / 2;
  ctx.fillStyle = "#5ee4ff";
  ctx.beginPath();
  ctx.rect(ex - state.cellSize * 0.25, ey - state.cellSize * 0.25, state.cellSize * 0.5, state.cellSize * 0.5);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(6, 9, 18, 0.95)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const row of state.grid) {
    for (const cell of row) {
      drawCell(cell);
    }
  }

  drawSolution();
  drawExit();
  drawPlayer();
}

function movePlayer(dx, dy) {
  const cell = cellAt(state.player.x, state.player.y);
  if (dx === 0 && dy === -1 && cell.walls.top) return;
  if (dx === 1 && dy === 0 && cell.walls.right) return;
  if (dx === 0 && dy === 1 && cell.walls.bottom) return;
  if (dx === -1 && dy === 0 && cell.walls.left) return;

  state.player.x += dx;
  state.player.y += dy;
  state.moves += 1;
  updateHud();
  draw();

  if (state.player.x === state.exit.x && state.player.y === state.exit.y) {
    overlayTitle.textContent = "Tebrikler!";
    overlayText.textContent = `Labirenti ${state.moves} hamlede çözdün.`;
    overlay.classList.add("visible");
  }
}

function bindControls() {
  window.addEventListener("keydown", (event) => {
    if (overlay.classList.contains("visible")) return;
    if (["ArrowUp", "w", "W"].includes(event.key)) movePlayer(0, -1);
    if (["ArrowRight", "d", "D"].includes(event.key)) movePlayer(1, 0);
    if (["ArrowDown", "s", "S"].includes(event.key)) movePlayer(0, 1);
    if (["ArrowLeft", "a", "A"].includes(event.key)) movePlayer(-1, 0);
  });
}

function setLevel(size) {
  state.cols = size;
  state.rows = size;
  levelValue.textContent = levelLabels[size] || "Özel";
  resize();
  resetGame();
}

function toggleHint() {
  state.hint = !state.hint;
  hintValue.textContent = state.hint ? "Açık" : "Kapalı";
  draw();
}

function loop() {
  updateTimer();
  requestAnimationFrame(loop);
}

newBtn.addEventListener("click", () => {
  overlay.classList.remove("visible");
  resetGame();
});

hintBtn.addEventListener("click", toggleHint);

overlayBtn.addEventListener("click", () => {
  overlay.classList.remove("visible");
  resetGame();
});

for (const btn of document.querySelectorAll(".levels button")) {
  btn.addEventListener("click", () => setLevel(Number(btn.dataset.size)));
}

bindControls();
setLevel(state.cols);
resize();
window.addEventListener("resize", resize);
loop();
