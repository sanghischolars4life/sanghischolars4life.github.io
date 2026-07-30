document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("mount");
  let levels = [];
  let levelIndex = 0;
  let found;

  const PALETTE = [
    "#d4a84b",
    "#7eb6ff",
    "#e88a9a",
    "#8fd4a0",
    "#c9a0ff",
    "#ffb86c",
    "#6ee7d8",
    "#f0e68c",
  ];

  function loadLevel() {
    found = new Set();
    render();
  }

  function mark(i) {
    if (found.has(i)) return;
    found.add(i);
    if (found.size === levels[levelIndex].extra.length) {
      render("You found every circle — Pandu & Pando eyes.");
      return;
    }
    render();
  }

  function circleEl(c, isExtra, index) {
    const el = document.createElement(isExtra ? "button" : "div");
    if (isExtra) {
      el.type = "button";
      el.className = "spot-circle spot-extra" + (found.has(index) ? " found" : "");
      el.setAttribute("aria-label", found.has(index) ? "Found" : "Spot difference");
      el.addEventListener("click", () => mark(index));
    } else {
      el.className = "spot-circle";
    }
    el.style.left = c.x + "%";
    el.style.top = c.y + "%";
    el.style.width = c.size + "px";
    el.style.height = c.size + "px";
    el.style.background = c.color;
    el.style.transform = "translate(-50%, -50%)";
    return el;
  }

  function buildPanel(frame, level, side) {
    level.base.forEach((c) => frame.appendChild(circleEl(c, false)));
    if (side === "right") {
      level.extra.forEach((c, i) => frame.appendChild(circleEl(c, true, i)));
    }
  }

  function render(status) {
    const level = levels[levelIndex];
    mount.innerHTML = `
      <div class="game-toolbar">
        <span class="game-stats">Found <strong>${found.size}</strong> / ${level.extra.length}</span>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
          <button type="button" class="btn btn-ghost" id="next">Next round</button>
          <button type="button" class="btn btn-ghost" id="restart">Reset</button>
        </div>
      </div>
      <p class="status-banner">${status || "Left is the original. Right has extra circles — tap each one."}</p>
      <div class="spot-pair">
        <div>
          <p class="spot-label">Original</p>
          <div class="spot-frame spot-circles" id="left"></div>
        </div>
        <div>
          <p class="spot-label">Find the extras →</p>
          <div class="spot-frame spot-circles" id="right"></div>
        </div>
      </div>
    `;
    buildPanel(mount.querySelector("#left"), level, "left");
    buildPanel(mount.querySelector("#right"), level, "right");
    mount.querySelector("#restart").addEventListener("click", loadLevel);
    mount.querySelector("#next").addEventListener("click", () => {
      levelIndex = (levelIndex + 1) % levels.length;
      loadLevel();
    });
  }

  function makeLevel(seed) {
    const rng = (n) => ((seed * 9301 + 49297) % 233280) / 233280 * n;
    const base = [];
    const count = 8 + Math.floor(rng(5));
    for (let i = 0; i < count; i++) {
      const s = 28 + Math.floor(rng(22));
      base.push({
        x: 12 + rng(76),
        y: 12 + rng(76),
        size: s,
        color: PALETTE[Math.floor(rng(PALETTE.length))],
      });
    }
    const extraCount = 3 + Math.floor(rng(3));
    const extra = [];
    for (let i = 0; i < extraCount; i++) {
      let x;
      let y;
      let tries = 0;
      do {
        x = 10 + rng(80);
        y = 10 + rng(80);
        tries += 1;
      } while (
        tries < 20 &&
        base.some((b) => Math.hypot(b.x - x, b.y - y) < 12) &&
        extra.some((e) => Math.hypot(e.x - x, e.y - y) < 10)
      );
      extra.push({
        x,
        y,
        size: 24 + Math.floor(rng(18)),
        color: PALETTE[Math.floor(rng(PALETTE.length))],
      });
    }
    return { base, extra };
  }

  window.LDR.whenReady(() => {
    fetch("../data/spot-difference.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.length && data[0].base) {
          levels = data;
        } else {
          levels = [makeLevel(1), makeLevel(7), makeLevel(13), makeLevel(21)];
        }
        loadLevel();
      })
      .catch(() => {
        levels = [makeLevel(1), makeLevel(7), makeLevel(13)];
        loadLevel();
      });
  });
});
