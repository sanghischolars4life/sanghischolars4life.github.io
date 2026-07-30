document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("mount");
  let cards = [];
  let index = 0;
  let pick = null;

  function show() {
    pick = null;
    render();
  }

  function choose(side) {
    pick = side;
    render();
  }

  function render() {
    const card = cards[index];
    mount.innerHTML = `
      <div class="game-toolbar">
        <span class="game-stats">Card <strong>${index + 1}</strong> / ${cards.length}</span>
        <button type="button" class="btn btn-ghost" id="shuffle">Shuffle deck</button>
      </div>
      <p class="status-banner">${pick ? "Nice pick — talk about why, then next." : "Pandu picks left or Pando picks right — or switch off."}</p>
      <div class="wyr-card">
        <h2 style="font-family:var(--font-display);margin:0">Would you rather…</h2>
        <div class="wyr-choices">
          <button type="button" class="${pick === "a" ? "is-pick" : ""}" id="a">${card.a}</button>
          <div class="wyr-or">or</div>
          <button type="button" class="${pick === "b" ? "is-pick" : ""}" id="b">${card.b}</button>
        </div>
        <div style="margin-top:1.25rem;display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap">
          <button type="button" class="btn" id="next" ${pick ? "" : "disabled"}>Next</button>
        </div>
      </div>
    `;
    mount.querySelector("#a").addEventListener("click", () => choose("a"));
    mount.querySelector("#b").addEventListener("click", () => choose("b"));
    mount.querySelector("#next").addEventListener("click", () => {
      index = (index + 1) % cards.length;
      show();
    });
    mount.querySelector("#shuffle").addEventListener("click", () => {
      cards = window.LDR.shuffle(cards);
      index = 0;
      show();
    });
  }

  window.LDR.whenReady(() => {
    fetch("../data/wyr.json")
      .then((r) => r.json())
      .then((data) => {
        cards = window.LDR.shuffle(data);
        show();
      })
      .catch(() => {
        mount.innerHTML = "<p>Could not load would-you-rather cards.</p>";
      });
  });
});
