import { loadHeaderFooter, qs, updateCartCount } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  wireSearchForm();
  updateCartCount();
});

function wireSearchForm() {
  const form = document.getElementById("search-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("search-input");
    const q = input?.value?.trim();
    if (!q) return;
    window.location.href = `/search.html?q=${encodeURIComponent(q)}`;
  });
}
