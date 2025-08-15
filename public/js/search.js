// src/js/search.js
import { loadHeaderFooter } from "./utils.mjs";
import { searchBooks } from "./api.mjs";
import { addToCart, addToFavorites, initHeaderCounts } from "./cart.js";

async function initSearch() {
	await loadHeaderFooter();
	initHeaderCounts();

	const params = new URLSearchParams(window.location.search);
	const query = params.get("q") || "";
	const container = document.getElementById("search-results");

	const results = await searchBooks(query, 10);
	results.forEach((item) => {
		const book = item.volumeInfo;
		const card = document.createElement("div");
		card.className = "card";
		card.innerHTML = `
      <img class="book-img" src="${
				book.imageLinks?.thumbnail || "/images/placeholder.png"
			}" alt="${book.title}">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-authors">${book.authors?.join(", ") || "Unknown"}</p>
      <button class="btn add-cart">Add to Cart</button>
      <button class="btn add-fav">❤</button>
    `;

		card
			.querySelector(".add-cart")
			.addEventListener("click", () => addToCart(book));
		card
			.querySelector(".add-fav")
			.addEventListener("click", () => addToFavorites(book));
		container.appendChild(card);
	});
}

initSearch();
