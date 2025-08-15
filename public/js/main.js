import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
  updateHeaderCounts,
  setupSearchHandler,
} from "./utils.mjs";

import {
  fetchRandomQuote,
  searchBooks,
  fetchGutendexBooks,
} from "./api.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  setupSearchHandler();

  // Render scrolling quote
  const quote = await fetchRandomQuote();
  const quoteContainer = document.getElementById("quote-container");
  if (quoteContainer) {
    quoteContainer.innerHTML = `<span class="scrolling-quote">"${quote.content}" - ${quote.author}</span>`;
  }

  // Render book sections (limit 4 books per section)
  await renderBooksSection("recommended-books", "bestsellers", 4);
  await renderBooksSection("trending-books", "technology", 4);
  await renderGutendexSection("gutendex-books", "fiction", 4);

  // Update header counts
  updateHeaderCounts();
});

// --- Functions ---

async function renderBooksSection(containerId, query, limit = 4) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const books = await searchBooks(query, limit);
  container.innerHTML = books
    .map(book => {
      const bookId = book.id;
      const title = book.volumeInfo.title || "No Title";
      const authors = book.volumeInfo.authors?.join(", ") || "Unknown";
      const thumbnail = book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x195";

      return `
        <div class="book-card">
          <a href="../book-detail.html?id=${bookId}">
            <img src="${thumbnail}" alt="${title}">
            <h4>${title}</h4>
            <p>${authors}</p>
          </a>
          <button class="add-favorite"
                  data-id="${bookId}"
                  data-title="${title}"
                  data-author="${authors}"
                  data-image="${thumbnail}">
            ❤️ Add to Favorites
          </button>
        </div>
      `;
    })
    .join("");

  addFavoritesButtons(container);
}

async function renderGutendexSection(containerId, subject, limit = 4) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const books = await fetchGutendexBooks(subject, limit);
  if (!books || books.length === 0) {
    container.innerHTML = "<p>No free eBooks found.</p>";
    return;
  }

  container.innerHTML = books
    .map(book => `
      <div class="book-card">
        <a href="../book-detail.html?id=${book.id}">
          <img src="${book.image}" alt="${book.title}">
          <h4>${book.title}</h4>
          <p>${book.authors}</p>
        </a>
        <button class="add-favorite"
                data-id="${book.id}"
                data-title="${book.title}"
                data-author="${book.authors}"
                data-image="${book.image}">
          ❤️ Add to Favorites
        </button>
      </div>
    `)
    .join("");

  addFavoritesButtons(container);
}

function addFavoritesButtons(container) {
  container.querySelectorAll(".add-favorite").forEach(btn => {
    btn.addEventListener("click", () => {
      const favorites = getLocalStorage("favorites");
      const id = btn.dataset.id;

      if (!favorites.some(f => f.id === id)) {
        favorites.push({
          id,
          title: btn.dataset.title,
          author: btn.dataset.author,
          image: btn.dataset.image,
        });
        setLocalStorage("favorites", favorites);
        alert("Book added to favorites!");
        updateHeaderCounts();
      } else {
        alert("Book already in favorites.");
      }
    });
  });
}
