import express from "express";
import { getBooks, getQuote } from "../controllers/apiController.js";

const router = express.Router();

router.get("/books", getBooks);
router.get("/quote", getQuote);

export default router;
