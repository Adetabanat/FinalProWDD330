import fetch from "node-fetch";

export async function getBooks(req, res) {
  try {
    const query = req.query.q || "fiction";
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data.items) throw new Error("No books found");
    res.json(data);
  } catch (err) {
    console.error("Book API error:", err);
    res.json({
      items: [
        {
          volumeInfo: {
            title: "Sample Book",
            authors: ["John Doe"],
            imageLinks: { thumbnail: "images/placeholder.png" }
          }
        },
        {
          volumeInfo: {
            title: "Another Sample Book",
            authors: ["Jane Smith"],
            imageLinks: { thumbnail: "images/placeholder.png" }
          }
        }
      ]
    });
  }
}

export async function getQuote(req, res) {
  try {
    const response = await fetch("https://api.quotable.io/random?tags=books");
    const data = await response.json();
    if (!data.content) throw new Error("No quote found");
    res.json(data);
  } catch (err) {
    console.error("Quote API error:", err);
    res.json({
      content: "A room without books is like a body without a soul.",
      author: "Marcus Tullius Cicero"
    });
  }
}
