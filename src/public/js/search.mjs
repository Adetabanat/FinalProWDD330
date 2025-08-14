import { apiSearch } from "./api.mjs";
import { qs } from "./utils.mjs";

const params = new URLSearchParams(location.search);
const query = params.get("q") || "";
const summary = qs("#search-summary");
const results = qs("#search-results");

(async () => {
  summary.textContent = query ? `Results for “${query}”` : "Please enter a search in the header.";
  if (!query) return;

  results.innerHTML = `<div class="loader" aria-hidden="true"></div>`;

  try {
    const data = await apiSearch(query);
    const items = [...data.google, ...data.gutendex];

    if (!items.length) {
      results.innerHTML = `<p role="status">No results found.</p>`;
      return;
    }

    results.innerHTML = items.map(renderCard).join("");
  } catch {
    results.innerHTML = `<p role="status">Failed to load results.</p>`;
  }
})();

function renderCard(b) {
  const img = b.thumbnail || "/images/placeholder.png";
  const authors = b.authors?.join(", ") || "Unknown author";
  return `
    <a class="card fade-in" href="${b.detailsHref}" aria-label="${b.title}">
      <img src="${img}" alt="Cover of ${b.title}" loading="lazy"/>
      <h3>${b.title}</h3>
      <p class="muted">${authors}</p>
      <span class="tag">${b.source}</span>
    </a>
  `;
}
