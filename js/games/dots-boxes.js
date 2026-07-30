document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("mount");
  const SIZE = 3; // 3x3 boxes => 4x4 dots
  let hLines;
  let vLines;
  let boxes;
  let turn;
  let scores;

  function reset() {
    hLines = Array.from({ length: SIZE + 1 }, () => Array(SIZE).fill(null));
    vLines = Array.from({ length: SIZE }, () => Array(SIZE + 1).fill(null));
    boxes = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    turn = 0;
    scores = { pandu: 0, pando: 0 };
  }

  function player() {
    return turn === 0 ? "pandu" : "pando";
  }

  function name() {
    return turn === 0 ? "Pandu" : "Pando";
  }

  function claimH(r, c) {
    if (hLines[r][c]) return;
    hLines[r][c] = player();
    afterLine();
  }

  function claimV(r, c) {
    if (vLines[r][c]) return;
    vLines[r][c] = player();
    afterLine();
  }

  function afterLine() {
    let gained = 0;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (boxes[r][c]) continue;
        if (hLines[r][c] && hLines[r + 1][c] && vLines[r][c] && vLines[r][c + 1]) {
          boxes[r][c] = player();
          scores[player()] += 1;
          gained += 1;
        }
      }
    }
    const total = SIZE * SIZE;
    if (scores.pandu + scores.pando === total) {
      const msg =
        scores.pandu === scores.pando
          ? "Draw!"
          : scores.pandu > scores.pando
            ? "Pandu wins!"
            : "Pando wins!";
      render(msg, true);
      return;
    }
    if (!gained) turn = 1 - turn;
    render();
  }

  function render(status, done) {
    const cols = [];
    for (let i = 0; i < SIZE * 2 + 1; i++) cols.push(i % 2 === 0 ? "10px" : "1fr");
    mount.innerHTML = `
      <div class="game-toolbar">
        <span class="turn-chip"><span class="dot ${player() === "pandu" ? "dot-pandu" : "dot-pando"}"></span> ${done ? "Done" : `${name()}'s turn`} · Pandu ${scores.pandu} · Pando ${scores.pando}</span>
        <button type="button" class="btn btn-ghost" id="restart">New game</button>
      </div>
      <p class="status-banner">${status || "Tap a line between dots."}</p>
      <div class="dab-board" id="board" style="grid-template-columns:${cols.join(" ")}"></div>
    `;
    const board = mount.querySelector("#board");
    const rows = SIZE * 2 + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < rows; c++) {
        if (r % 2 === 0 && c % 2 === 0) {
          const d = document.createElement("div");
          d.className = "dab-dot";
          board.appendChild(d);
        } else if (r % 2 === 0 && c % 2 === 1) {
          const hr = r / 2;
          const hc = (c - 1) / 2;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "dab-h" + (hLines[hr][hc] ? ` taken ${hLines[hr][hc]}` : "");
          btn.disabled = Boolean(hLines[hr][hc]) || done;
          btn.addEventListener("click", () => claimH(hr, hc));
          board.appendChild(btn);
        } else if (r % 2 === 1 && c % 2 === 0) {
          const vr = (r - 1) / 2;
          const vc = c / 2;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "dab-v" + (vLines[vr][vc] ? ` taken ${vLines[vr][vc]}` : "");
          btn.disabled = Boolean(vLines[vr][vc]) || done;
          btn.addEventListener("click", () => claimV(vr, vc));
          board.appendChild(btn);
        } else {
          const br = (r - 1) / 2;
          const bc = (c - 1) / 2;
          const box = document.createElement("div");
          box.className = "dab-box" + (boxes[br][bc] ? " " + boxes[br][bc] : "");
          box.textContent = boxes[br][bc] === "pandu" ? "Pandu" : boxes[br][bc] === "pando" ? "Pando" : "";
          board.appendChild(box);
        }
      }
    }
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
