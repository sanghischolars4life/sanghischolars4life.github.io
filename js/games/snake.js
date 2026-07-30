document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("mount");
  const CELL = 20;
  const COUNT = 20;
  let canvas;
  let ctx;
  let snake;
  let dir;
  let nextDir;
  let food;
  let score;
  let timer;
  let dead;

  function reset() {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dir = { x: 1, y: 0 };
    nextDir = { ...dir };
    score = 0;
    dead = false;
    placeFood();
  }

  function placeFood() {
    do {
      food = {
        x: Math.floor(Math.random() * COUNT),
        y: Math.floor(Math.random() * COUNT),
      };
    } while (snake.some((s) => s.x === food.x && s.y === food.y));
  }

  function setDir(x, y) {
    if (dead) return;
    if (dir.x + x === 0 && dir.y + y === 0) return;
    nextDir = { x, y };
  }

  function tick() {
    if (dead) return;
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.y < 0 || head.x >= COUNT || head.y >= COUNT || snake.some((s) => s.x === head.x && s.y === head.y)) {
      dead = true;
      const best = Number(localStorage.getItem("ldr_snake_best") || 0);
      if (score > best) localStorage.setItem("ldr_snake_best", String(score));
      draw();
      status();
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      placeFood();
    } else {
      snake.pop();
    }
    draw();
    status();
  }

  function draw() {
    ctx.fillStyle = "#1a1f3a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#d4a84b";
    ctx.fillRect(food.x * CELL, food.y * CELL, CELL - 1, CELL - 1);
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#e8c97a" : "#7eb6ff";
      ctx.fillRect(s.x * CELL, s.y * CELL, CELL - 1, CELL - 1);
    });
  }

  function status() {
    const el = mount.querySelector("#status");
    if (!el) return;
    el.textContent = dead ? `Game over — score ${score}. Press New game.` : `Score ${score}`;
  }

  function render() {
    mount.innerHTML = `
      <div class="game-toolbar">
        <span class="game-stats" id="status">Score 0</span>
        <button type="button" class="btn btn-ghost" id="restart">New game</button>
      </div>
      <div class="snake-wrap">
        <canvas class="snake-canvas" id="canvas" width="400" height="400"></canvas>
        <div class="snake-pad">
          <span></span>
          <button type="button" data-d="0,-1">↑</button>
          <span></span>
          <button type="button" data-d="-1,0">←</button>
          <button type="button" data-d="0,1">↓</button>
          <button type="button" data-d="1,0">→</button>
        </div>
      </div>
    `;
    canvas = mount.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    mount.querySelectorAll("[data-d]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const [x, y] = btn.dataset.d.split(",").map(Number);
        setDir(x, y);
      });
    });
    mount.querySelector("#restart").addEventListener("click", () => {
      clearInterval(timer);
      reset();
      draw();
      status();
      timer = setInterval(tick, 120);
    });
    window.addEventListener("keydown", onKey);
    reset();
    draw();
    status();
    clearInterval(timer);
    timer = setInterval(tick, 120);
  }

  function onKey(e) {
    const map = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      w: [0, -1],
      s: [0, 1],
      a: [-1, 0],
      d: [1, 0],
    };
    const v = map[e.key] || map[e.key.toLowerCase()];
    if (v) {
      e.preventDefault();
      setDir(v[0], v[1]);
    }
  }

  window.LDR.whenReady(render);
});
