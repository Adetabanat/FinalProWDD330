import { fetchJSON } from "./utils.mjs";

export function apiSearch(q) {
  return fetchJSON(`/api/books?q=${encodeURIComponent(q)}`);
}

export function apiCategory(name) {
  return fetchJSON(`/api/categories?name=${encodeURIComponent(name)}`);
}

export function apiBookDetails(source, id) {
  return fetchJSON(`/api/book?source=${encodeURIComponent(source)}&id=${encodeURIComponent(id)}`);
}

