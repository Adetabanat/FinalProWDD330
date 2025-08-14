import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/apiRoutes.js";
import logger from "./middleware/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logging
app.use(logger);

// Static files
app.use(express.static(path.join(__dirname, "src/public")));

// API routes
app.use("/api", apiRoutes);

// SPA-like fallback for direct navigation of static pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
