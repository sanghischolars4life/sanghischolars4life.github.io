document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("mount");
  const N = 8;
  let board;
  let turn; // 0 pandu (gold, moves up from bottom), 1 pando (blue, moves down)
  let selected = null;
  let over = false;

  function reset() {
    board = Array.from({ length: N }, () => Array(N).fill(null));
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < N; c++) {
        if ((r + c) % 2 === 1) board[r][c] = { side: "pando", king: false };
      }
    }
    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < N; c++) {
        if ((r + c) % 2 === 1) board[r][c] = { side: "pandu", king: false };
      }
    }
    turn = 0;
    selected = null;
    over = false;
  }

  function side() {
    return turn === 0 ? "pandu" : "pando";
  }

  function name() {
    return turn === 0 ? "Pandu" : "Pando";
  }

  function dirs(piece) {
    if (piece.king) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    return piece.side === "pandu" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  }

  function onBoard(r, c) {
    return r >= 0 && r < N && c >= 0 && c < N;
  }

  function movesFrom(r, c) {
    const piece = board[r][c];
    if (!piece) return [];
    const jumps = [];
    const steps = [];
    for (const [dr, dc] of dirs(piece)) {
      const r1 = r + dr;
      const c1 = c + dc;
      const r2 = r + dr * 2;
      const c2 = c + dc * 2;
      if (onBoard(r1, c1) && board[r1][c1] && board[r1][c1].side !== piece.side && onBoard(r2, c2) && !board[r2][c2]) {
        jumps.push({ r: r2, c: c2, capture: { r: r1, c: c1 } });
      } else if (onBoard(r1, c1) && !board[r1][c1]) {
        steps.push({ r: r1, c: c1 });
      }
    }
    return jumps.length ? jumps : steps;
  }

  function allMoves(forSide) {
    const list = [];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (board[r][c] && board[r][c].side === forSide) {
          const m = movesFrom(r, c);
          m.forEach((mv) => list.push({ from: { r, c }, ...mv }));
        }
      }
    }
    const jumps = list.filter((m) => m.capture);
    return jumps.length ? jumps : list;
  }

  function clickCell(r, c) {
    if (over) return;
    const piece = board[r][c];
    const legal = allMoves(side());
    if (selected) {
      const mv = legal.find(
        (m) => m.from.r === selected.r && m.from.c === selected.c && m.r === r && m.c === c
      );
      if (mv) {
        board[mv.r][mv.c] = board[selected.r][selected.c];
        board[selected.r][selected.c] = null;
        if (mv.capture) board[mv.capture.r][mv.capture.c] = null;
        const landed = board[mv.r][mv.c];
        if ((landed.side === "pandu" && mv.r === 0) || (landed.side === "pando" && mv.r === N - 1)) {
          landed.king = true;
        }
        selected = null;
        const enemy = side() === "pandu" ? "pando" : "pandu";
        if (!allMoves(enemy).length) {
          over = true;
          render(`${name()} wins!`);
          return;
        }
        turn = 1 - turn;
        render();
        return;
      }
    }
    if (piece && piece.side === side() && legal.some((m) => m.from.r === r && m.from.c === c)) {
      selected = { r, c };
      render();
      return;
    }
    selected = null;
    render();
  }

  function render(status) {
    const legal = over ? [] : allMoves(side());
    const dests = selected
      ? legal.filter((m) => m.from.r === selected.r && m.from.c === selected.c)
      : [];
    mount.innerHTML = `
      <div class="game-toolbar">
        <span class="turn-chip"><span class="dot ${side() === "pandu" ? "dot-pandu" : "dot-pando"}"></span> ${over ? "Done" : `${name()}'s turn`}</span>
        <button type="button" class="btn btn-ghost" id="restart">New game</button>
      </div>
      <p class="status-banner">${status || "Select a piece, then a highlighted square."}</p>
      <div class="chk-board" id="board"></div>
    `;
    const el = mount.querySelector("#board");
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chk-cell " + ((r + c) % 2 === 0 ? "light" : "dark");
        if (selected && selected.r === r && selected.c === c) btn.classList.add("selected");
        if (dests.some((d) => d.r === r && d.c === c)) btn.classList.add("dest");
        if (board[r][c]) {
          const p = document.createElement("div");
          p.className = "chk-piece " + board[r][c].side + (board[r][c].king ? " king" : "");
          btn.appendChild(p);
        }
        btn.addEventListener("click", () => clickCell(r, c));
        el.appendChild(btn);
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
