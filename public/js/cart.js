import { loadHeaderFooter, getLocalStorage, setLocalStorage, setupSearchHandler } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  setupSearchHandler();
  renderCart();
});

function renderCart() {
  const container = document.getElementById("cart-container");
  const cart = getLocalStorage("cart");

  if (!cart || cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    updateCartCount();
    return;
  }

  container.innerHTML = cart.map(book => {
    const quantity = book.quantity || 1;
    return `
      <div class="book-card">
        <a href="../book-detail.html?id=${book.id}">
          <img src="${book.image}" alt="${book.title}">
          <h4>${book.title}</h4>
          <p>${book.author}</p>
        </a>
        <div class="cart-controls">
          <button class="decrease-qty" data-id="${book.id}">-</button>
          <span class="qty">${quantity}</span>
          <button class="increase-qty" data-id="${book.id}">+</button>
        </div>
        <button class="remove-cart" data-id="${book.id}">Remove 🛒</button>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".remove-cart").forEach(btn => btn.addEventListener("click", () => {
    const updatedCart = cart.filter(c => c.id !== btn.dataset.id);
    setLocalStorage("cart", updatedCart);
    renderCart();
    updateCartCount();
  }));

  container.querySelectorAll(".increase-qty").forEach(btn => btn.addEventListener("click", () => {
    const updatedCart = cart.map(item => {
      if (item.id === btn.dataset.id) item.quantity = (item.quantity || 1) + 1;
      return item;
    });
    setLocalStorage("cart", updatedCart);
    renderCart();
    updateCartCount();
  }));

  container.querySelectorAll(".decrease-qty").forEach(btn => btn.addEventListener("click", () => {
    const updatedCart = cart.map(item => {
      if (item.id === btn.dataset.id) item.quantity = Math.max((item.quantity || 1) - 1, 1);
      return item;
    });
    setLocalStorage("cart", updatedCart);
    renderCart();
    updateCartCount();
  }));

  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  const cart = getLocalStorage("cart");
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (countEl) countEl.textContent = totalItems;
}
