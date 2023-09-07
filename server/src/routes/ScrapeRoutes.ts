const express = require("express");
import { scrape } from "../controllers/ScrapeController"; 

const router = express.Router();

// Define your routes here and point them to the controller
router.get("/scrape", scrape);

export default router;
