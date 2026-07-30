document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const movesEl = document.getElementById("moves");
  const timerEl = document.getElementById("timer");
  const statusEl = document.getElementById("status");
  const sizeSelect = document.getElementById("size");
  const restart = document.getElementById("restart");
  const newPhoto = document.getElementById("new-photo");

  let size = 3;
  let tiles = [];
  let emptyIndex = 0;
  let moves = 0;
  let seconds = 0;
  let timerId = null;
  let photo = window.LDR.imagePath(Math.floor(Math.random() * 105));
  let solved = false;

  function startTimer() {
    stopTimer();
    timerId = setInterval(() => {
      seconds += 1;
      timerEl.textContent = String(seconds);
    }, 1000);
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function resetStats() {
    moves = 0;
    seconds = 0;
    solved = false;
    movesEl.textContent = "0";
    timerEl.textContent = "0";
    statusEl.textContent = "";
  }

  function isSolved(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] !== i) return false;
    }
    return arr[arr.length - 1] === null;
  }

  function inversionCount(arr) {
    const flat = arr.filter((v) => v !== null);
    let inv = 0;
    for (let i = 0; i < flat.length; i++) {
      for (let j = i + 1; j < flat.length; j++) {
        if (flat[i] > flat[j]) inv += 1;
      }
    }
    return inv;
  }

  function solvable(arr, n) {
    const inv = inversionCount(arr);
    if (n % 2 === 1) return inv % 2 === 0;
    const emptyRowFromBottom = n - Math.floor(arr.indexOf(null) / n);
    if (emptyRowFromBottom % 2 === 0) return inv % 2 === 1;
    return inv % 2 === 0;
  }

  function shuffledBoard(n) {
    const total = n * n;
    let arr;
    do {
      const values = Array.from({ length: total - 1 }, (_, i) => i);
      arr = window.LDR.shuffle(values).concat([null]);
    } while (!solvable(arr, n) || isSolved(arr));
    return arr;
  }

  function posPercent(index, n) {
    if (n <= 1) return 0;
    return (index / (n - 1)) * 100;
  }

  function render() {
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    board.innerHTML = "";

    tiles.forEach((value, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "puzzle-tile" + (value === null ? " is-empty" : "");
      btn.setAttribute("aria-label", value === null ? "Empty tile" : `Tile ${value + 1}`);
      if (value !== null) {
        const row = Math.floor(value / size);
        const col = value % size;
        btn.style.backgroundImage = `url("${photo}")`;
        btn.style.backgroundSize = `${size * 100}% ${size * 100}%`;
        btn.style.backgroundPosition = `${posPercent(col, size)}% ${posPercent(row, size)}%`;
      }
      btn.addEventListener("click", () => tryMove(index));
      board.appendChild(btn);
    });
  }

  function tryMove(index) {
    if (solved) return;
    const empty = emptyIndex;
    const er = Math.floor(empty / size);
    const ec = empty % size;
    const r = Math.floor(index / size);
    const c = index % size;
    const adjacent =
      (Math.abs(er - r) === 1 && ec === c) || (Math.abs(ec - c) === 1 && er === r);
    if (!adjacent) return;

    if (moves === 0 && seconds === 0) startTimer();

    [tiles[empty], tiles[index]] = [tiles[index], tiles[empty]];
    emptyIndex = index;
    moves += 1;
    movesEl.textContent = String(moves);
    render();

    if (isSolved(tiles)) {
      solved = true;
      stopTimer();
      statusEl.textContent = `Solved in ${moves} moves and ${seconds}s. Beautiful, Pando.`;
      const best = localStorage.getItem("ldr_puzzle_best");
      if (!best || seconds < Number(best)) {
        localStorage.setItem("ldr_puzzle_best", String(seconds));
      }
    }
  }

  function newGame(changePhoto) {
    size = Number(sizeSelect.value) || 3;
    if (changePhoto) {
      photo = window.LDR.imagePath(Math.floor(Math.random() * 105));
    }
    stopTimer();
    resetStats();
    tiles = shuffledBoard(size);
    emptyIndex = tiles.indexOf(null);
    render();
  }

  sizeSelect.addEventListener("change", () => newGame(false));
  restart.addEventListener("click", () => newGame(false));
  newPhoto.addEventListener("click", () => newGame(true));
  window.LDR.whenReady(() => newGame(false));
});
