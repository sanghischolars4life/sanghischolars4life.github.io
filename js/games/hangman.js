document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("mount");
  const MAX_WRONG = 6;

  const PARTS = ["gallows", "head", "body", "armL", "armR", "legL", "legR"];

  let words = [];
  let word;
  let hint;
  let guessed;
  let wrong;

  function pick() {
    const item = words[Math.floor(Math.random() * words.length)];
    word = item.word.toUpperCase();
    hint = item.hint;
    guessed = new Set();
    wrong = 0;
  }

  function displayWord() {
    return word
      .split("")
      .map((ch) => {
        if (ch === " ") return `<span class="hang-letter" style="border:none">&nbsp;</span>`;
        return `<span class="hang-letter">${guessed.has(ch) ? ch : ""}</span>`;
      })
      .join("");
  }

  function won() {
    return word.split("").every((ch) => ch === " " || guessed.has(ch));
  }

  function hangmanSvg() {
    const show = (part) => {
      if (part === "gallows") return true;
      const idx = PARTS.indexOf(part);
      return wrong >= idx;
    };
    return `
      <svg class="hang-figure" viewBox="0 0 200 220" aria-hidden="true">
        <g class="hang-gallows" opacity="${show("gallows") ? 1 : 0}">
          <line x1="20" y1="210" x2="120" y2="210" />
          <line x1="40" y1="210" x2="40" y2="20" />
          <line x1="40" y1="20" x2="110" y2="20" />
          <line x1="110" y1="20" x2="110" y2="45" />
        </g>
        <circle class="hang-part hang-head" cx="110" cy="62" r="16" opacity="${show("head") ? 1 : 0}" />
        <line class="hang-part hang-body" x1="110" y1="78" x2="110" y2="130" opacity="${show("body") ? 1 : 0}" />
        <line class="hang-part hang-armL" x1="110" y1="95" x2="85" y2="115" opacity="${show("armL") ? 1 : 0}" />
        <line class="hang-part hang-armR" x1="110" y1="95" x2="135" y2="115" opacity="${show("armR") ? 1 : 0}" />
        <line class="hang-part hang-legL" x1="110" y1="130" x2="90" y2="170" opacity="${show("legL") ? 1 : 0}" />
        <line class="hang-part hang-legR" x1="110" y1="130" x2="130" y2="170" opacity="${show("legR") ? 1 : 0}" />
      </svg>
    `;
  }

  function guess(letter) {
    if (guessed.has(letter) || wrong >= MAX_WRONG || won()) return;
    guessed.add(letter);
    if (!word.includes(letter)) wrong += 1;
    render();
  }

  function render() {
    const done = won() || wrong >= MAX_WRONG;
    const status = won()
      ? `Solved — ${word}. Love you, Pandu.`
      : wrong >= MAX_WRONG
        ? `Out of guesses. It was ${word}.`
        : `Hint: ${hint}`;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    mount.innerHTML = `
      <div class="game-toolbar">
        <span class="game-stats">Wrong: <strong>${wrong}</strong> / ${MAX_WRONG}</span>
        <button type="button" class="btn btn-ghost" id="restart">New word</button>
      </div>
      <p class="status-banner">${status}</p>
      <div class="hang-stage">
        ${hangmanSvg()}
        <div class="hang-word">${displayWord()}</div>
      </div>
      <div class="hang-keys" id="keys"></div>
    `;
    const keys = mount.querySelector("#keys");
    alphabet.forEach((letter) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = letter;
      btn.disabled = guessed.has(letter) || done;
      if (guessed.has(letter)) {
        btn.classList.add(word.includes(letter) ? "is-hit" : "is-miss");
      }
      btn.addEventListener("click", () => guess(letter));
      keys.appendChild(btn);
    });
    mount.querySelector("#restart").addEventListener("click", () => {
      pick();
      render();
    });
  }

  window.LDR.whenReady(() => {
    fetch("../data/hangman.json")
      .then((r) => r.json())
      .then((data) => {
        words = data;
        pick();
        render();
      })
      .catch(() => {
        mount.innerHTML = "<p>Could not load hangman words.</p>";
      });
  });
});
