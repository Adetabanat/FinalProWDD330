import { qs, fetchJSON } from "./utils.mjs";

async function loadBooks() {
  const container = qs("#book-list");
  container.innerHTML = `<div class="loader"></div>`;
  console.log("Loading books...");

  try {
    const data = await fetchJSON("/api/books?q=harry+potter");
    console.log("Books data:", data);

    container.innerHTML = data.items.map(book => `
      <div class="book-card fade-in">
        <img src="${book.volumeInfo.imageLinks?.thumbnail || 'images/placeholder.png'}" alt="${book.volumeInfo.title}">
        <h3>${book.volumeInfo.title}</h3>
        <p>${book.volumeInfo.authors?.join(", ") || "Unknown author"}</p>
      </div>
    `).join("");
  } catch (err) {
    console.error("Book load error:", err);
    container.innerHTML = `<p>Failed to load books.</p>`;
  }
}

async function loadQuote() {
  console.log("Loading quote...");
  try {
    const data = await fetchJSON("/api/quote");
    console.log("Quote data:", data);
    qs("#quote").textContent = `"${data.content}" — ${data.author}`;
  } catch (err) {
    console.error("Quote load error:", err);
    qs("#quote").textContent = "Couldn't load quote.";
  }
}

loadBooks();
loadQuote();
