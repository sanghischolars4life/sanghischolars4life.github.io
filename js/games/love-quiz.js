document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("quiz-root");
  const scoreEl = document.getElementById("score");
  const progressEl = document.getElementById("progress");
  const statusEl = document.getElementById("status");
  const restart = document.getElementById("restart");

  let questions = [];
  let index = 0;
  let score = 0;

  function showQuestion() {
    restart.hidden = true;
    const q = questions[index];
    progressEl.textContent = `Question ${index + 1} of ${questions.length}`;
    statusEl.textContent = "";
    root.innerHTML = `
      <div class="quiz-card">
        <h2>${escapeHtml(q.question)}</h2>
        <div class="quiz-options" id="options"></div>
      </div>
    `;
    const options = root.querySelector("#options");
    q.options.forEach((label, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.addEventListener("click", () => choose(i, btn, options));
      options.appendChild(btn);
    });
  }

  function choose(choice, btn, options) {
    const q = questions[index];
    Array.from(options.children).forEach((el) => {
      el.disabled = true;
    });
    if (choice === q.answer) {
      btn.classList.add("is-correct");
      score += 1;
      scoreEl.textContent = String(score);
      statusEl.textContent = "Yes — that's us.";
    } else {
      btn.classList.add("is-wrong");
      options.children[q.answer].classList.add("is-correct");
      statusEl.textContent = "Almost — Pandu remembers differently.";
    }
    setTimeout(() => {
      index += 1;
      if (index >= questions.length) {
        finish();
      } else {
        showQuestion();
      }
    }, 900);
  }

  function finish() {
    restart.hidden = false;
    progressEl.textContent = "Done";
    statusEl.textContent = "";
    const total = questions.length;
    root.innerHTML = `
      <div class="quiz-result">
        <h2>${score} / ${total}</h2>
        <p>${
          score === total
            ? "Perfect — Anjali & Vivek level."
            : score >= Math.ceil(total * 0.6)
              ? "Solid, Pandu & Pando. Rematch anytime."
              : "Cute try. Rewrite the questions or play again."
        }</p>
      </div>
    `;
    const best = localStorage.getItem("ldr_quiz_best");
    const label = `${score}/${total}`;
    if (!best || score > Number(String(best).split("/")[0])) {
      localStorage.setItem("ldr_quiz_best", label);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function start() {
    index = 0;
    score = 0;
    scoreEl.textContent = "0";
    showQuestion();
  }

  restart.addEventListener("click", start);

  window.LDR.whenReady(() => {
    fetch("../data/quiz.json")
      .then((res) => res.json())
      .then((data) => {
        questions = data;
        start();
      })
      .catch(() => {
        root.innerHTML = "<p>Could not load <code>data/quiz.json</code>.</p>";
      });
  });
});
