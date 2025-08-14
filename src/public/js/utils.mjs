export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

export async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function renderWithTemplate(path, target) {
  const res = await fetch(path);
  const html = await res.text();
  target.innerHTML = html;
}

export async function loadHeaderFooter() {
  await Promise.all([
    renderWithTemplate("/header.html", qs("header")),
    renderWithTemplate("/footer.html", qs("footer"))
  ]);
}

export function updateCartCount() {
  const count = getLocalStorage("cart").length;
  const badge = qs("#cart-count");
  if (badge) badge.textContent = count;
}

export function isFavorite(bookId) {
  return getLocalStorage("favorites").some(b => b.id === bookId);
}

export function toggleFavorite(book) {
  let favs = getLocalStorage("favorites");
  if (isFavorite(book.id)) {
    favs = favs.filter(b => b.id !== book.id);
  } else {
    favs.push(book);
  }
  setLocalStorage("favorites", favs);
}
