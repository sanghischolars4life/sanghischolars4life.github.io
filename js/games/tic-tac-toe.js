document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("mount");
  let cells;
  let turn;
  let over;

  function reset() {
    cells = Array(9).fill(null);
    turn = 0;
    over = false;
  }

  function mark() {
    return turn === 0 ? "X" : "O";
  }

  function who() {
    return turn === 0 ? "Pandu" : "Pando";
  }

  function play(i) {
    if (over || cells[i]) return;
    cells[i] = mark();
    if (win()) {
      over = true;
      render(`${who()} wins!`);
      return;
    }
    if (cells.every(Boolean)) {
      over = true;
      render("Draw.");
      return;
    }
    turn = 1 - turn;
    render();
  }

  function win() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return lines.some(([a, b, c]) => cells[a] && cells[a] === cells[b] && cells[a] === cells[c]);
  }

  function render(status) {
    mount.innerHTML = `
      <div class="game-toolbar">
        <span class="turn-chip"><span class="dot ${turn === 0 ? "dot-pandu" : "dot-pando"}"></span> ${over ? "Done" : `${who()} (${mark()})`}</span>
        <button type="button" class="btn btn-ghost" id="restart">New game</button>
      </div>
      <p class="status-banner">${status || ""}</p>
      <div class="ttt-board" id="board"></div>
    `;
    const board = mount.querySelector("#board");
    cells.forEach((v, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ttt-cell";
      btn.textContent = v || "";
      btn.disabled = over || Boolean(v);
      btn.addEventListener("click", () => play(i));
      board.appendChild(btn);
    });
    mount.querySelector("#restart").addEventListener("click", () => {
      reset();
      render();
    });
  }

  window.LDR.whenReady(() => {
    reset();
    render();
  });
});
