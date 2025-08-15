// src/js/cartPage.js
import { loadHeaderFooter } from "./utils.mjs";
import { getCart, setLocalStorage, initHeaderCounts } from "./cart.js";

async function initCart() {
	await loadHeaderFooter();
	initHeaderCounts();

	const cart = getCart();
	const container = document.getElementById("cart-container");
	const emptyMsg = document.getElementById("empty-cart");

	if (!cart.length) {
		emptyMsg.style.display = "block";
		return;
	} else {
		emptyMsg.style.display = "none";
	}

	cart.forEach((book, index) => {
		const card = document.createElement("div");
		card.className = "card";
		card.innerHTML = `
      <img class="book-img" src="${book.image}" alt="${book.title}">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-authors">${book.authors}</p>
      <button class="btn remove-cart">Remove</button>
    `;
		card.querySelector(".remove-cart").addEventListener("click", () => {
			cart.splice(index, 1);
			setLocalStorage("cart", cart);
			window.location.reload();
		});
		container.appendChild(card);
	});
}

initCart();
