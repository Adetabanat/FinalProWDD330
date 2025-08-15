// src/js/api.mjs

const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";
const GUTENDEX_URL = "https://gutendex.com/books/";

// Search books via Google API
export async function searchBooks(query, maxResults = 12) {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
    const data = await response.json();
    return data.items || [];
  } catch (err) {
    console.error("searchBooks error:", err);
    return [];
  }
}

// Fetch book by Google ID
export async function fetchBookById(id) {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_URL}/${id}`);
    return await response.json();
  } catch (err) {
    console.error("fetchBookById error:", err);
    return null;
  }
}

// Fetch Gutendex books by category/subject
export async function fetchGutendexBooks(subject, limit = 5) {
  try {
    const response = await fetch(`${GUTENDEX_URL}?topic=${encodeURIComponent(subject)}&page_size=${limit}`);
    const data = await response.json();
    return (data.results || []).map(book => ({
      id: book.id,
      title: book.title,
      authors: book.authors.map(a => a.name).join(", ") || "Unknown",
      image: book.formats["image/jpeg"] || "https://via.placeholder.com/128x195",
      download: book.formats["text/plain; charset=utf-8"] || null,
      subjects: book.subjects.join(", ") || "N/A",
    }));
  } catch (err) {
    console.error("fetchGutendexBooks error:", err);
    return [];
  }
}

// Fetch single Gutendex book by ID
export async function fetchGutendexBookById(id) {
  try {
    const response = await fetch(`${GUTENDEX_URL}${id}`);
    const data = await response.json();
    return {
      id: data.id,
      title: data.title,
      authors: data.authors.map(a => a.name).join(", ") || "Unknown",
      image: data.formats["image/jpeg"] || "https://via.placeholder.com/128x195",
      download: data.formats["text/plain; charset=utf-8"] || null,
      subjects: data.subjects.join(", ") || "N/A",
    };
  } catch (err) {
    console.error("fetchGutendexBookById error:", err);
    return null;
  }
}

// Optional: Fetch random quote
export async function fetchRandomQuote() {
  try {
    const res = await fetch("https://api.quotable.io/random");
    return await res.json();
  } catch (err) {
    console.error("fetchRandomQuote error:", err);
    return { content: "Keep reading!", author: "BookHub" };
  }
}
