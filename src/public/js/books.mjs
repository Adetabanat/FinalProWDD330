import { apiBookDetails } from "./api.mjs";
import { qs, getLocalStorage, setLocalStorage, isFavorite, toggleFavorite, updateCartCount } from "./utils.mjs";

const params = new URLSearchParams(location.search);
const source = params.get("source");
const id = params.get("id");
const container = qs("#book-details");

(async () => {
  if (!source || !id) {
    container.innerHTML = `<p role="alert">Missing book parameters.</p>`;
    return;
  }

  container.innerHTML = `<div class="loader" aria-hidden="true"></div>`;

  try {
    const b = await apiBookDetails(source, id);
    renderDetails(b);
  } catch {
    container.innerHTML = `<p role="alert">Failed to load book details.</p>`;
  }
})();

function renderDetails(b) {
  const img = b.thumbnail || "/images/placeholder.png";
  const authors = b.authors?.join(", ") || "Unknown author";

  const favActive = isFavorite(`${b.source}:${b.id}`) ? "active" : "";

  container.innerHTML = `
    <div class="details-card fade-in">
      <img src="${img}" alt="Cover of ${b.title}" class="cover"/>
      <div class="details-body">
        <h1>${b.title}</h1>
        <p class="muted">by ${authors}</p>
        <p>${b.description || "No description available."}</p>
        <p class="meta">
          <strong>Source:</strong> ${b.source}
          ${b.publisher ? ` • <strong>Publisher:</strong> ${b.publisher}` : ""}
          ${b.published ? ` • <strong>Published:</strong> ${b.published}` : ""}
        </p>

        ${b.source === "gutendex" && b.links?.length ? `
          <div class="links">
            <h3>Read / Download</h3>
            <ul>
              ${b.links.map(l => `<li><a href="${l.href}" target="_blank" rel="noopener">Link</a></li>`).join("")}
            </ul>
          </div>
        ` : ""}

        <div class="actions">
          <button id="fav-btn" class="icon-btn ${favActive}" aria-pressed="${favActive ? "true" : "false"}" title="Toggle Favorite">❤️</button>
          <button id="add-cart" class="primary">Add to Cart</button>
        </div>
      </div>
    </div>
  `;

  // Wire favorites
  qs("#fav-btn").addEventListener("click", () => {
    const key = `${b.source}:${b.id}`;
    const minimal = {
      id: key,
      title: b.title,
      authors: b.authors,
      thumbnail: b.thumbnail,
      detailsHref: `/book.html?source=${b.source}&id=${encodeURIComponent(b.id)}`
    };
    toggleFavorite(minimal);
    const active = isFavorite(key);
    qs("#fav-btn").classList.toggle("active", active);
    qs("#fav-btn").setAttribute("aria-pressed", active ? "true" : "false");
  });

  // Wire cart
  qs("#add-cart").addEventListener("click", () => {
    const cart = getLocalStorage("cart");
    const key = `${b.source}:${b.id}`;
    if (!cart.find(i => i.id === key)) {
      cart.push({
        id: key,
        title: b.title,
        authors: b.authors,
        thumbnail: b.thumbnail,
        qty: 1,
        href: `/book.html?source=${b.source}&id=${encodeURIComponent(b.id)}`
      });
      setLocalStorage("cart", cart);
      updateCartCount();
    }
  });
}
