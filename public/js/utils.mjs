// src/js/utils.mjs

// Load header & footer dynamically
export async function loadHeaderFooter() {
  const header = document.getElementById("header-placeholder");
  const footer = document.getElementById("footer-placeholder");

  if (header) {
    const headerHTML = await fetch("../partials/header.html").then(res => res.text());
    header.innerHTML = headerHTML;
  }

  if (footer) {
    const footerHTML = await fetch("../partials/footer.html").then(res => res.text());
    footer.innerHTML = footerHTML;
  }

  updateHeaderCounts();
}

// Local Storage Helpers
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Search bar handler
export function setupSearchHandler() {
  const searchForm = document.querySelector("form.search-form");
  if (!searchForm) return;

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchForm.querySelector("input[name='q']").value.trim();
    if (query) {
      window.location.href = `../search.html?q=${encodeURIComponent(query)}`;
    }
  });
}

// Update header counts for favorites & cart
export function updateHeaderCounts() {
  const favoritesEl = document.querySelector(".favorites-count");
  const cartEl = document.getElementById("cart-count");

  if (favoritesEl) favoritesEl.textContent = getLocalStorage("favorites").length;
  if (cartEl) {
    const cart = getLocalStorage("cart");
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartEl.textContent = total;
  }
}
