export async function loadHeaderFooter() {
  const header = await fetch("/partials/header.html").then(res => res.text());
  const footer = await fetch("/partials/footer.html").then(res => res.text());

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);
}
