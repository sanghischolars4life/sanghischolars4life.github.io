(function () {
  const GATE_KEY = "ldr_unlocked";

  function hashPassphrase(phrase) {
    const str = phrase.trim().toLowerCase();
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
  }

  // Default shared passphrase: pandupando
  const EXPECTED = hashPassphrase("pandupando");

  function isUnlocked() {
    return sessionStorage.getItem(GATE_KEY) === "1";
  }

  function unlock() {
    sessionStorage.setItem(GATE_KEY, "1");
  }

  function mountGate() {
    if (isUnlocked()) return;

    const gate = document.createElement("div");
    gate.className = "gate";
    gate.id = "soft-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "gate-title");
    gate.innerHTML = `
      <form class="gate-panel" id="gate-form" autocomplete="off">
        <h1 id="gate-title">Anjali &amp; Vivek</h1>
        <p>For Pandu &amp; Pando — enter our shared phrase.</p>
        <label for="gate-pass" style="position:absolute;left:-9999px">Passphrase</label>
        <input id="gate-pass" name="pass" type="password" placeholder="Shared passphrase" required autofocus />
        <button class="btn" type="submit">Enter</button>
        <p class="gate-error" id="gate-error" aria-live="polite"></p>
      </form>
    `;
    document.body.appendChild(gate);

    const form = gate.querySelector("#gate-form");
    const input = gate.querySelector("#gate-pass");
    const error = gate.querySelector("#gate-error");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (hashPassphrase(input.value || "") === EXPECTED) {
        unlock();
        gate.remove();
        document.dispatchEvent(new CustomEvent("ldr:unlocked"));
      } else {
        error.textContent = "Not quite — try again, Pandu.";
        input.select();
      }
    });
  }

  function assetBase() {
    const path = window.location.pathname.replace(/\\/g, "/");
    if (path.includes("/games/")) return "../";
    if (path.includes("/archive/")) return "../../";
    return "./";
  }

  function imagePath(index) {
    return `${assetBase()}images/img${index}.jpg`;
  }

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickImages(count, maxIndex) {
    const max = maxIndex ?? 104;
    const indices = Array.from({ length: max + 1 }, (_, i) => i);
    return shuffle(indices)
      .slice(0, count)
      .map(imagePath);
  }

  function markCurrentNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll(".nav-links a[data-nav]").forEach((link) => {
      if (link.dataset.nav === page) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function whenReady(fn) {
    if (isUnlocked()) {
      fn();
      return;
    }
    document.addEventListener("ldr:unlocked", fn, { once: true });
  }

  window.LDR = {
    isUnlocked,
    unlock,
    mountGate,
    whenReady,
    assetBase,
    imagePath,
    shuffle,
    pickImages,
    hashPassphrase,
  };

  document.addEventListener("DOMContentLoaded", () => {
    mountGate();
    markCurrentNav();
  });
})();
