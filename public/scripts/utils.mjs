export async function loadHeaderFooter() {
  const headerEl = document.querySelector("header");
  const footerEl = document.querySelector("footer");

  const headerHTML = await fetch("/header.html").then(res => res.text());
  const footerHTML = await fetch("/footer.html").then(res => res.text());

  if (headerEl) {
    headerEl.innerHTML = headerHTML;

    // Add search form listener
    const searchForm = headerEl.querySelector("#searchForm");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchForm.q.value.trim();
        if (query) {
          window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
        }
      });
    }
  }

  if (footerEl) {
    footerEl.innerHTML = footerHTML;
  }
}
