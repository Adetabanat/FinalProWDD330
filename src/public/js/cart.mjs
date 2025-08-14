import { qs, getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

const container = qs("#cart-items");
render();

function render() {
  const cart = getLocalStorage("cart");
  if (!cart.length) {
    container.innerHTML = `<p role="status">Your cart is empty.</p>`;
    updateCartCount();
    return;
  }

  container.innerHTML = cart.map(renderRow).join("");

  container.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove");
      const next = cart.filter(i => i.id !== id);
      setLocalStorage("cart", next);
      render();
    });
  });
}

function renderRow(b) {
  const img = b.thumbnail || "/images/placeholder.png";
  const authors = b.authors?.join(", ") || "Unknown author";
  return `
    <div class="card row fade-in">
      <a class="media" href="${b.href}" aria-label="${b.title}">
        <img src="${img}" alt="Cover of ${b.title}" loading="lazy"/>
      </a>
      <div class="content">
        <h3><a href="${b.href}">${b.title}</a></h3>
        <p class="muted">${authors}</p>
        <button class="secondary" data-remove="${b.id}">Remove</button>
      </div>
    </div>
  `;
}
