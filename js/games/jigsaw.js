document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("mount");
  const SIZE = 3;
  let photo;
  let placed; // slot index -> piece id or null
  let tray; // piece ids not placed
  let dragId = null;

  function posPercent(i, n) {
    return n <= 1 ? 0 : (i / (n - 1)) * 100;
  }

  function reset(newPhoto) {
    if (newPhoto || !photo) photo = window.LDR.imagePath(Math.floor(Math.random() * 105));
    placed = Array(SIZE * SIZE).fill(null);
    tray = window.LDR.shuffle(Array.from({ length: SIZE * SIZE }, (_, i) => i));
    dragId = null;
  }

  function pieceStyle(id) {
    const row = Math.floor(id / SIZE);
    const col = id % SIZE;
    return `background-image:url("${photo}");background-size:${SIZE * 100}% ${SIZE * 100}%;background-position:${posPercent(col, SIZE)}% ${posPercent(row, SIZE)}%`;
  }

  function tryPlace(slot, id) {
    if (placed[slot] !== null) return;
    placed[slot] = id;
    tray = tray.filter((x) => x !== id);
    if (placed.every((v, i) => v === i)) {
      render("You put us back together.");
      return;
    }
    render();
  }

  function returnToTray(slot) {
    const id = placed[slot];
    if (id === null) return;
    placed[slot] = null;
    tray.push(id);
    render();
  }

  function render(status) {
    mount.innerHTML = `
      <div class="game-toolbar">
        <span class="game-stats">Pieces left: <strong>${tray.length}</strong></span>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
          <button type="button" class="btn btn-ghost" id="new-photo">New photo</button>
          <button type="button" class="btn btn-ghost" id="restart">Shuffle</button>
        </div>
      </div>
      <p class="status-banner">${status || "Drag a piece onto the board (or tap piece, then tap a slot)."}</p>
      <div class="jigsaw-wrap">
        <div>
          <h3 style="font-family:var(--font-display);margin:0 0 0.5rem">Board</h3>
          <div class="jigsaw-board" id="board"></div>
        </div>
        <div>
          <h3 style="font-family:var(--font-display);margin:0 0 0.5rem">Tray</h3>
          <div class="jigsaw-tray" id="tray"></div>
        </div>
      </div>
    `;

    const board = mount.querySelector("#board");
    placed.forEach((id, slot) => {
      const slotEl = document.createElement("div");
      slotEl.className = "jigsaw-slot";
      slotEl.dataset.slot = String(slot);
      slotEl.addEventListener("dragover", (e) => e.preventDefault());
      slotEl.addEventListener("drop", (e) => {
        e.preventDefault();
        const pid = Number(e.dataTransfer.getData("text/plain"));
        if (!Number.isNaN(pid)) tryPlace(slot, pid);
      });
      slotEl.addEventListener("click", () => {
        if (dragId !== null && placed[slot] === null) {
          tryPlace(slot, dragId);
          dragId = null;
        } else if (placed[slot] !== null) {
          returnToTray(slot);
        }
      });
      if (id !== null) {
        const piece = document.createElement("div");
        piece.className = "jigsaw-piece";
        piece.draggable = true;
        piece.style.cssText = pieceStyle(id);
        piece.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", String(id));
          // pull back to tray conceptually on failed drop — keep on board until drop
        });
        slotEl.appendChild(piece);
      }
      board.appendChild(slotEl);
    });

    const trayEl = mount.querySelector("#tray");
    tray.forEach((id) => {
      const piece = document.createElement("div");
      piece.className = "jigsaw-piece" + (dragId === id ? " selected" : "");
      piece.draggable = true;
      piece.style.cssText = pieceStyle(id);
      if (dragId === id) piece.style.outline = "2px solid var(--gold)";
      piece.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", String(id)));
      piece.addEventListener("click", () => {
        dragId = dragId === id ? null : id;
        render();
      });
      trayEl.appendChild(piece);
    });

    mount.querySelector("#restart").addEventListener("click", () => {
      reset(false);
      render();
    });
    mount.querySelector("#new-photo").addEventListener("click", () => {
      reset(true);
      render();
    });
  }

  window.LDR.whenReady(() => {
    reset(true);
    render();
  });
});
