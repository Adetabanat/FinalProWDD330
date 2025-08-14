import { qs, getLocalStorage, setLocalStorage } from "./utils.mjs";

const container = qs("#favorites-list");
render();

function render() {
  const favs = getLocalStorage("favorites");
  if (!favs.length) {
    container.innerHTML = `<p role="status">No favorites yet.</p>`;
    return;
  }
  container.innerHTML = favs.map(renderCard).join("");
  container.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove");
      const next = favs.filter(f => f.id !== id);
      setLocalStorage("favorites", next);
      render();
    });
  });
}

function renderCard(b) {
  const img = b.thumbnail || "/images/placeholder.png";
  const authors = b.authors?.join(", ") || "Unknown author";
  return `
    <div class="card row fade-in">
      <a class="media" href="${b.detailsHref}" aria-label="${b.title}">
        <img src="${img}" alt="Cover of ${b.title}" loading="lazy"/>
      </a>
      <div class="content">
        <h3><a href="${b.detailsHref}">${b.title}</a></h3>
        <p class="muted">${authors}</p>
        <button class="secondary" data-remove="${b.id}">Remove</button>
      </div>
    </div>
  `;
}
