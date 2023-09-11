"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const scrape_1 = require("./scrape");
const params = async (req, res) => {
    const url = req.body.url || req.query.url;
    if (!url) {
        return res.status(400).send("No url provided!");
    }
    // Initialize the browser outside the loop
    const browser = await puppeteer_1.default.launch({
        executablePath: puppeteer_1.default.executablePath(),
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
        const contentPrompt = await (0, scrape_1.scrapeContent)(url, browser);
        await browser.close();
        return res.send(contentPrompt);
    }
    catch (error) {
        console.log("Error:", error.message);
        return res.status(500).send("Error occurred");
    }
};
exports.params = params;
