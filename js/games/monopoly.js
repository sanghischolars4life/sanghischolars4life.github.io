document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("mount");

  const SPACES = [
    { name: "GO", type: "go" },
    { name: "Cafe", type: "prop", price: 60, rent: 12 },
    { name: "Chance", type: "chance" },
    { name: "Park Bench", type: "prop", price: 80, rent: 16 },
    { name: "Snack Tax", type: "tax", amount: 50 },
    { name: "Library", type: "prop", price: 100, rent: 20 },
    { name: "Chance", type: "chance" },
    { name: "Beach Walk", type: "prop", price: 120, rent: 24 },
    { name: "Free Hug", type: "free" },
    { name: "Cinema", type: "prop", price: 140, rent: 28 },
    { name: "Chance", type: "chance" },
    { name: "Garden", type: "prop", price: 160, rent: 32 },
    { name: "Just Visiting", type: "free" },
    { name: "Market", type: "prop", price: 180, rent: 36 },
    { name: "Chance", type: "chance" },
    { name: "Home Sweet", type: "prop", price: 220, rent: 44 },
  ];

  const CHANCE = [
    { text: "Surprise call — collect 50.", money: 50 },
    { text: "Forgot the charger — pay 30.", money: -30 },
    { text: "Shared dessert — collect 40.", money: 40 },
    { text: "Late night snacks — pay 20.", money: -20 },
    { text: "Anniversary bonus — collect 80.", money: 80 },
    { text: "Parking ticket on date night — pay 40.", money: -40 },
  ];

  const players = [
    { id: "pandu", name: "Pandu", money: 800, pos: 0, bankrupt: false },
    { id: "pando", name: "Pando", money: 800, pos: 0, bankrupt: false },
  ];
  const owners = Array(SPACES.length).fill(null);
  let turn = 0;
  let pending = null;
  let log = [];
  let over = false;

  function addLog(msg) {
    log.unshift(msg);
    log = log.slice(0, 12);
  }

  function current() {
    return players[turn];
  }

  function other() {
    return players[1 - turn];
  }

  function nextTurn() {
    pending = null;
    for (let i = 0; i < 2; i++) {
      turn = 1 - turn;
      if (!players[turn].bankrupt) return;
    }
  }

  function checkEnd() {
    const alive = players.filter((p) => !p.bankrupt);
    if (alive.length === 1) {
      over = true;
      addLog(`${alive[0].name} wins the board.`);
    }
  }

  function bankrupt(p) {
    p.bankrupt = true;
    p.money = 0;
    owners.forEach((o, i) => {
      if (o === p.id) owners[i] = null;
    });
    addLog(`${p.name} is out.`);
    checkEnd();
  }

  function pay(from, to, amount) {
    from.money -= amount;
    if (to) to.money += amount;
    if (from.money < 0) bankrupt(from);
  }

  function land(p) {
    const space = SPACES[p.pos];
    if (space.type === "tax") {
      pay(p, null, space.amount);
      addLog(`${p.name} paid snack tax (${space.amount}).`);
      nextTurn();
      return;
    }
    if (space.type === "chance") {
      const card = CHANCE[Math.floor(Math.random() * CHANCE.length)];
      pay(p, null, card.money < 0 ? -card.money : 0);
      if (card.money > 0) p.money += card.money;
      if (p.money < 0) bankrupt(p);
      addLog(`Chance for ${p.name}: ${card.text}`);
      nextTurn();
      return;
    }
    if (space.type === "prop") {
      const ownerId = owners[p.pos];
      if (!ownerId) {
        pending = { kind: "buy", index: p.pos };
        addLog(`${p.name} landed on ${space.name}. Buy for ${space.price}?`);
        return;
      }
      if (ownerId !== p.id) {
        const owner = players.find((x) => x.id === ownerId);
        pay(p, owner, space.rent);
        addLog(`${p.name} paid ${space.rent} rent to ${owner.name}.`);
      } else {
        addLog(`${p.name} visited their own ${space.name}.`);
      }
    } else {
      addLog(`${p.name} is on ${space.name}.`);
    }
    nextTurn();
  }

  function roll() {
    if (over || pending) return;
    const p = current();
    if (p.bankrupt) {
      nextTurn();
      render();
      return;
    }
    const d = 1 + Math.floor(Math.random() * 6);
    p.pos = (p.pos + d) % SPACES.length;
    if (p.pos < d) {
      p.money += 100;
      addLog(`${p.name} passed GO (+100).`);
    }
    addLog(`${p.name} rolled ${d}.`);
    land(p);
    render();
  }

  function buy() {
    if (!pending || pending.kind !== "buy") return;
    const p = current();
    const space = SPACES[pending.index];
    if (p.money < space.price) {
      addLog(`${p.name} can't afford ${space.name}.`);
      pending = null;
      nextTurn();
      render();
      return;
    }
    p.money -= space.price;
    owners[pending.index] = p.id;
    addLog(`${p.name} bought ${space.name}.`);
    pending = null;
    nextTurn();
    render();
  }

  function skipBuy() {
    if (!pending || pending.kind !== "buy") return;
    addLog(`${current().name} passed on ${SPACES[pending.index].name}.`);
    pending = null;
    nextTurn();
    render();
  }

  function render() {
    const p = current();
    mount.innerHTML = `
      <div class="game-toolbar">
        <span class="turn-chip"><span class="dot ${p.id === "pandu" ? "dot-pandu" : "dot-pando"}"></span> Turn: <strong>${p.name}</strong></span>
        <button type="button" class="btn btn-ghost" id="restart">New game</button>
      </div>
      <p class="status-banner" id="status">${over ? log[0] : pending ? "Decide: buy or pass." : "Roll the dice."}</p>
      <div class="mono-layout">
        <div class="mono-board" id="board"></div>
        <aside class="mono-panel">
          ${players
            .map(
              (pl) => `
            <h3>${pl.name}</h3>
            <p>${pl.bankrupt ? "Bankrupt" : `$${pl.money}`} · space ${pl.pos}</p>
          `
            )
            .join("")}
          <div class="mono-actions">
            <button type="button" class="btn" id="roll" ${over || pending ? "disabled" : ""}>Roll dice</button>
            <button type="button" class="btn btn-ghost" id="buy" ${pending ? "" : "disabled"}>Buy</button>
            <button type="button" class="btn btn-ghost" id="pass" ${pending ? "" : "disabled"}>Pass</button>
          </div>
          <div class="mono-log">${log.map((l) => `<div>${l}</div>`).join("")}</div>
        </aside>
      </div>
    `;

    const board = mount.querySelector("#board");
    SPACES.forEach((space, i) => {
      const el = document.createElement("div");
      el.className = "mono-space" + (players.some((pl) => !pl.bankrupt && pl.pos === i) ? " is-here" : "");
      const owner = owners[i] ? players.find((x) => x.id === owners[i]).name : "";
      el.innerHTML = `
        <strong>${space.name}</strong>
        <div>${space.type === "prop" ? `$${space.price}` : space.type}</div>
        ${owner ? `<div>Owned: ${owner}</div>` : ""}
        <div class="tokens">${players
          .filter((pl) => !pl.bankrupt && pl.pos === i)
          .map((pl) => `<span class="mono-token ${pl.id}" title="${pl.name}"></span>`)
          .join("")}</div>
      `;
      board.appendChild(el);
    });

    mount.querySelector("#roll").addEventListener("click", roll);
    mount.querySelector("#buy").addEventListener("click", buy);
    mount.querySelector("#pass").addEventListener("click", skipBuy);
    mount.querySelector("#restart").addEventListener("click", () => location.reload());
  }

  window.LDR.whenReady(() => {
    addLog("Welcome to Monopoly Lite — first to not go broke wins.");
    render();
  });
});
