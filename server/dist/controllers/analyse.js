"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyse = exports.processBatch = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const scrape_1 = require("./scrape"); // Assuming scrape.ts is in the same directory
const suitability_1 = require("../utils/suitability"); // Adjust the path based on your directory structure
async function processBatch(items, start, end, browser, keywords) {
    const batch = items.slice(start, end);
    return await Promise.all(batch.map(async (item) => {
        const identifier = item.metadata.identifier[0];
        const url = `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${identifier.toLowerCase()}`;
        const scrapedContent = await (0, scrape_1.scrapeContent)(url, browser);
        const score = (0, suitability_1.compareResearchDescriptions)(keywords, scrapedContent);
        return {
            ...item,
            scrapedContent,
            score
        };
    }));
}
exports.processBatch = processBatch;
async function analyse(allItems, keywords) {
    // Initialize the browser
    const browser = await puppeteer_1.default.launch({
        executablePath: puppeteer_1.default.executablePath(),
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const updatedItems = [];
    // Define batch size
    const batchSize = 50;
    for (let i = 0; i < allItems.length; i += batchSize) {
        console.log(`Analyzing batch: ${i}-${Math.min(i + batchSize, allItems.length)}`);
        const endIndex = Math.min(i + batchSize, allItems.length);
        const batchResult = await processBatch(allItems, i, endIndex, browser, keywords);
        updatedItems.push(...batchResult);
    }
    // Close the browser after the loop
    await browser.close();
    return updatedItems;
}
exports.analyse = analyse;
