document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("mount");
  const ROWS = 6;
  const COLS = 7;
  let board;
  let turn; // 0 pandu, 1 pando
  let over;

  function empty() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    turn = 0;
    over = false;
  }

  function player() {
    return turn === 0 ? "pandu" : "pando";
  }

  function name() {
    return turn === 0 ? "Pandu" : "Pando";
  }

  function drop(col) {
    if (over) return;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][col]) {
        board[r][col] = player();
        if (winner(r, col)) {
          over = true;
          render(`${name()} connects four!`);
          return;
        }
        if (board.every((row) => row.every(Boolean))) {
          over = true;
          render("Draw — rematch?");
          return;
        }
        turn = 1 - turn;
        render();
        return;
      }
    }
  }

  function winner(r, c) {
    const who = board[r][c];
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    for (const [dr, dc] of dirs) {
      let n = 1;
      for (const sign of [-1, 1]) {
        let rr = r + dr * sign;
        let cc = c + dc * sign;
        while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === who) {
          n += 1;
          rr += dr * sign;
          cc += dc * sign;
        }
      }
      if (n >= 4) return true;
    }
    return false;
  }

  function render(status) {
    mount.innerHTML = `
      <div class="game-toolbar">
        <span class="turn-chip"><span class="dot ${player() === "pandu" ? "dot-pandu" : "dot-pando"}"></span> ${over ? "Game over" : `${name()}'s turn`}</span>
        <button type="button" class="btn btn-ghost" id="restart">New game</button>
      </div>
      <p class="status-banner">${status || (over ? "" : "Tap a column to drop.")}</p>
      <div class="c4-board" id="board"></div>
    `;
    const el = mount.querySelector("#board");
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "c4-cell" + (board[r][c] ? " " + board[r][c] : "");
        btn.disabled = over || Boolean(board[0][c]);
        btn.addEventListener("click", () => drop(c));
        el.appendChild(btn);
      }
    }
    mount.querySelector("#restart").addEventListener("click", () => {
      empty();
      render();
    });
  }

  window.LDR.whenReady(() => {
    empty();
    render();
  });
});
