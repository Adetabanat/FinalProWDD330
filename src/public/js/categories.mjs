import { apiCategory } from "./api.mjs";
import { qs } from "./utils.mjs";

const categories = ["Fiction", "Science", "History", "Romance", "Horror", "Mystery", "Poetry", "Biography"];

const chips = qs("#cat-chips");
const results = qs("#category-results");

// Render chips
chips.innerHTML = categories.map(c => `<button class="chip" data-cat="${c}">${c}</button>`).join("");

chips.addEventListener("click", async (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  const cat = btn.dataset.cat;
  await loadCategory(cat);
});

// Auto load first
loadCategory(categories[0]);

async function loadCategory(name) {
  results.innerHTML = `<div class="loader" aria-hidden="true"></div>`;
  try {
    const data = await apiCategory(name);
    const items = [...data.google, ...data.gutendex].slice(0, 24);
    results.innerHTML = items.map(renderCard).join("");
  } catch {
    results.innerHTML = `<p role="status">Failed to load ${name} books.</p>`;
  }
}

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
