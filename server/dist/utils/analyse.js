"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyse = exports.processBatch = void 0;
const suitability_1 = require("./suitability"); // Adjust the path based on your directory structure
async function processBatch(items, start, end, keywords) {
    const batch = items.slice(start, end);
    return await Promise.all(batch.map(async (item) => {
        const score = (0, suitability_1.compareResearchDescriptions)(keywords, item.scrapedContent);
        return {
            ...item,
            score
        };
    }));
}
exports.processBatch = processBatch;
async function analyse(allItems, keywords) {
    const updatedItems = [];
    // Define batch size
    const batchSize = 50;
    console.log("All items length:, ", allItems.length);
    for (let i = 0; i < allItems.length; i += batchSize) {
        console.log(`\nAnalyzing batch: ${i}-${Math.min(i + batchSize, allItems.length)}`);
        const endIndex = Math.min(i + batchSize, allItems.length);
        const batchResult = await processBatch(allItems, i, endIndex, keywords);
        updatedItems.push(...batchResult);
    }
    return updatedItems;
}
exports.analyse = analyse;
