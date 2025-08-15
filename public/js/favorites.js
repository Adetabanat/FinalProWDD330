import { loadHeaderFooter, getLocalStorage, setLocalStorage, setupSearchHandler } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  setupSearchHandler();
  renderFavorites();
});

function renderFavorites() {
  const container = document.getElementById("favorites-container");
  const favorites = getLocalStorage("favorites");

  if (!favorites || favorites.length === 0) {
    container.innerHTML = "<p>No favorite books yet.</p>";
    return;
  }

  container.innerHTML = favorites.map(book => {
    return `
      <div class="book-card">
        <a href="../book-detail.html?id=${book.id}">
          <img src="${book.image}" alt="${book.title}">
          <h4>${book.title}</h4>
          <p>${book.author}</p>
        </a>
        <button class="remove-favorite" data-id="${book.id}">Remove ❤️</button>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".remove-favorite").forEach(btn => {
    btn.addEventListener("click", () => {
      const updatedFavorites = favorites.filter(f => f.id !== btn.dataset.id);
      setLocalStorage("favorites", updatedFavorites);
      renderFavorites();
      updateHeaderCount();
    });
  });
}

function updateHeaderCount() {
  const countEl = document.querySelector(".favorites-count");
  if (countEl) countEl.textContent = getLocalStorage("favorites").length;
}
