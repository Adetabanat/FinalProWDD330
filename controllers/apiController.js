import fetch from "node-fetch";

/**
 * Normalize Google Books item into a common shape
 */
function normalizeGoogleItem(item) {
  const v = item.volumeInfo || {};
  return {
    id: item.id,
    source: "google",
    title: v.title || "Untitled",
    authors: v.authors || [],
    thumbnail: v.imageLinks?.thumbnail || null,
    description: v.description || "",
    published: v.publishedDate || "",
    publisher: v.publisher || "",
    categories: v.categories || [],
    // For details page deep-link
    detailsHref: `/book.html?source=google&id=${encodeURIComponent(item.id)}`
  };
}

/**
 * Normalize Gutendex item into a common shape
 */
function normalizeGutenItem(item) {
  // Cover image is usually formats["image/jpeg"]
  const img = item.formats?.["image/jpeg"] || null;
  return {
    id: String(item.id),
    source: "gutendex",
    title: item.title || "Untitled",
    authors: (item.authors || []).map(a => a.name),
    thumbnail: img,
    description: "", // Gutendex generally doesn't include long descriptions
    published: "",
    publisher: "Project Gutenberg",
    categories: item.subjects || [],
    detailsHref: `/book.html?source=gutendex&id=${encodeURIComponent(item.id)}`
  };
}

export async function searchBooks(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "Missing search query (q)" });

  try {
    const [gRes, guRes] = await Promise.all([
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20`),
      fetch(`https://gutendex.com/books?search=${encodeURIComponent(q)}`)
    ]);

    const [gJson, guJson] = await Promise.all([gRes.json(), guRes.json()]);
    const googleItems = (gJson.items || []).map(normalizeGoogleItem);
    const gutenItems = (guJson.results || []).map(normalizeGutenItem);

    res.json({ google: googleItems, gutendex: gutenItems });
  } catch (err) {
    console.error("searchBooks error:", err);
    // Fallback sample so UI still renders
    res.json({
      google: [{
        id: "sample-google-1",
        source: "google",
        title: "Sample Google Book",
        authors: ["Jane Doe"],
        thumbnail: null,
        description: "",
        published: "",
        publisher: "",
        categories: [],
        detailsHref: "/book.html?source=google&id=sample-google-1"
      }],
      gutendex: [{
        id: "123",
        source: "gutendex",
        title: "Sample Gutendex Book",
        authors: ["John Gutenberg"],
        thumbnail: null,
        description: "",
        published: "",
        publisher: "Project Gutenberg",
        categories: [],
        detailsHref: "/book.html?source=gutendex&id=123"
      }]
    });
  }
}

export async function getBookDetails(req, res) {
  const source = (req.query.source || "").toLowerCase();
  const id = req.query.id;
  if (!source || !id) return res.status(400).json({ error: "Missing source or id" });

  try {
    if (source === "google") {
      const r = await fetch(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`);
      const j = await r.json();
      const v = j.volumeInfo || {};
      return res.json({
        id: j.id,
        source: "google",
        title: v.title || "Untitled",
        authors: v.authors || [],
        thumbnail: v.imageLinks?.thumbnail || null,
        description: v.description || "",
        published: v.publishedDate || "",
        publisher: v.publisher || "",
        categories: v.categories || [],
        links: [], // No direct ebook links from Google metadata here
      });
    }

    if (source === "gutendex") {
      const r = await fetch(`https://gutendex.com/books/${encodeURIComponent(id)}`);
      const j = await r.json();
      // Extract ebook links
      const f = j.formats || {};
      const links = [
        f["text/html; charset=utf-8"] || f["text/html"],
        f["application/epub+zip"],
        f["application/x-mobipocket-ebook"],
        f["application/pdf"]
      ].filter(Boolean).map((href) => ({ href }));

      return res.json({
        id: String(j.id),
        source: "gutendex",
        title: j.title || "Untitled",
        authors: (j.authors || []).map(a => a.name),
        thumbnail: f["image/jpeg"] || null,
        description: "",
        published: "",
        publisher: "Project Gutenberg",
        categories: j.subjects || [],
        links
      });
    }

    return res.status(400).json({ error: "Unknown source" });
  } catch (err) {
    console.error("getBookDetails error:", err);
    res.status(500).json({ error: "Failed to load details" });
  }
}

export async function getCategoryBooks(req, res) {
  // Very simple category approach: use subject query for Google; search for Gutendex
  const name = (req.query.name || "fiction").trim();
  try {
    const [gRes, guRes] = await Promise.all([
      fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(name)}&maxResults=20`),
      fetch(`https://gutendex.com/books?search=${encodeURIComponent(name)}`)
    ]);

    const [gJson, guJson] = await Promise.all([gRes.json(), guRes.json()]);
    const googleItems = (gJson.items || []).map(normalizeGoogleItem);
    const gutenItems = (guJson.results || []).map(normalizeGutenItem);

    res.json({ google: googleItems, gutendex: gutenItems });
  } catch (err) {
    console.error("getCategoryBooks error:", err);
    res.json({ google: [], gutendex: [] });
  }
}


