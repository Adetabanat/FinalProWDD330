export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function setClick(id, callback) {
  document.getElementById(id)?.addEventListener("click", callback);
}

export async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}
