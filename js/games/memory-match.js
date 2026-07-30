document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const movesEl = document.getElementById("moves");
  const pairsEl = document.getElementById("pairs");
  const pairTotalEl = document.getElementById("pair-total");
  const statusEl = document.getElementById("status");
  const restart = document.getElementById("restart");

  const PAIR_COUNT = 6;
  pairTotalEl.textContent = String(PAIR_COUNT);

  let moves = 0;
  let pairs = 0;
  let lock = false;
  let first = null;

  function start() {
    moves = 0;
    pairs = 0;
    lock = false;
    first = null;
    movesEl.textContent = "0";
    pairsEl.textContent = "0";
    statusEl.textContent = "";
    board.innerHTML = "";

    const photos = window.LDR.pickImages(PAIR_COUNT);
    const cards = window.LDR.shuffle(
      photos.flatMap((src, i) => [
        { id: i, src },
        { id: i, src },
      ])
    );

    cards.forEach((card, index) => {
      const el = document.createElement("div");
      el.className = "match-card";
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", `Card ${index + 1}`);
      el.dataset.id = String(card.id);
      el.innerHTML = `
        <div class="match-inner">
          <div class="match-face match-back">♥</div>
          <div class="match-face match-front"><img src="${card.src}" alt="" draggable="false" /></div>
        </div>
      `;
      el.addEventListener("click", () => onFlip(el));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFlip(el);
        }
      });
      board.appendChild(el);
    });
  }

  function onFlip(card) {
    if (lock || card.classList.contains("is-flipped") || card.classList.contains("is-matched")) {
      return;
    }
    card.classList.add("is-flipped");

    if (!first) {
      first = card;
      return;
    }

    moves += 1;
    movesEl.textContent = String(moves);
    lock = true;

    const match = first.dataset.id === card.dataset.id;
    if (match) {
      first.classList.add("is-matched");
      card.classList.add("is-matched");
      pairs += 1;
      pairsEl.textContent = String(pairs);
      first = null;
      lock = false;
      if (pairs === PAIR_COUNT) {
        statusEl.textContent = `You found us — ${moves} moves. Love you, Pandu.`;
        const best = localStorage.getItem("ldr_match_best");
        if (!best || moves < Number(best)) {
          localStorage.setItem("ldr_match_best", String(moves));
        }
      }
    } else {
      const a = first;
      const b = card;
      setTimeout(() => {
        a.classList.remove("is-flipped");
        b.classList.remove("is-flipped");
        first = null;
        lock = false;
      }, 700);
    }
  }

  restart.addEventListener("click", start);
  window.LDR.whenReady(start);
});
