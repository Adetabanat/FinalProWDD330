import express from "express";
import {
  searchBooks,
  getBookDetails,
  getCategoryBooks
} from "../controllers/apiController.js";

const router = express.Router();

// Search across Google Books + Gutendex
router.get("/books", searchBooks);

// Single book details
router.get("/book", getBookDetails);

// Category listing (convenience wrapper)
router.get("/categories", getCategoryBooks);

// Quote


export default router;
