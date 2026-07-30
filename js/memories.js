document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.getElementById("timeline");
  const galleryImage = document.getElementById("gallery-image");
  const nextPhoto = document.getElementById("next-photo");
  const galleryCount = document.getElementById("gallery-count");

  const imageList = [];
  for (let i = 0; i <= 104; i++) {
    imageList.push(`images/img${i}.jpg`);
  }
  let deck = window.LDR.shuffle(imageList);
  let index = 0;

  function showGalleryPhoto() {
    galleryImage.src = deck[index];
    galleryCount.textContent = `${index + 1} / ${deck.length}`;
  }

  nextPhoto.addEventListener("click", () => {
    index += 1;
    if (index >= deck.length) {
      deck = window.LDR.shuffle(imageList);
      index = 0;
    }
    showGalleryPhoto();
  });

  showGalleryPhoto();

  fetch("data/memories.json")
    .then((res) => res.json())
    .then((memories) => {
      timeline.innerHTML = memories
        .map((m) => {
          const link = m.link
            ? `<p><a href="${m.link}">${m.linkLabel || "Open"}</a></p>`
            : "";
          return `
            <article class="memory">
              <time datetime="${m.date}">${m.date}</time>
              <h2>${escapeHtml(m.title)}</h2>
              <p>${escapeHtml(m.caption)}</p>
              <figure>
                <img src="${m.image}" alt="${escapeHtml(m.title)}" loading="lazy" />
              </figure>
              ${link}
            </article>
          `;
        })
        .join("");
    })
    .catch(() => {
      timeline.innerHTML =
        "<p>Could not load memories. Check <code>data/memories.json</code>.</p>";
    });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
});
