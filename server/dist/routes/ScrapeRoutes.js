"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const ScrapeController_1 = require("../controllers/ScrapeController");
const router = express.Router();
// Define your routes here and point them to the controller
router.get("/scrape", ScrapeController_1.scrape);
exports.default = router;
