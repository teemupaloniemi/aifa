"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareResearchDescriptions = void 0;
/**
 * Utility functions for assessment of items.
 */
// Function to compare two descriptions
const compareResearchDescriptions = (keywords, researchInstrument) => {
    // Convert both descriptions to lowercase and split them into arrays of words
    let ideaWords = ["No research idea"];
    let instrumentWords = ["No instrument"];
    if (keywords)
        ideaWords = keywords.toLowerCase().replace(',', '').split(/\s+/);
    else {
        console.log(ideaWords);
        return 0;
    }
    if (researchInstrument)
        instrumentWords = researchInstrument.toLowerCase().replace(',', '').split(/\s+/);
    else {
        console.log(instrumentWords);
        return 0;
    }
    for (let i = 0; i < ideaWords.length; i++) {
        ideaWords[i] = ideaWords[i].replace(",", "").trim();
    }
    for (let i = 0; i < instrumentWords.length; i++) {
        instrumentWords[i] = instrumentWords[i].replace(",", "").trim();
    }
    // Remove duplicates from both arrays
    const uniqueIdeaWords = Array.from(new Set(ideaWords));
    const uniqueInstrumentWords = Array.from(new Set(instrumentWords));
    // Count the number of matching words
    let matchingWordsCount = 0;
    for (const word of uniqueIdeaWords) {
        //console.log("matching: ", "-"+word+"-")
        if (uniqueInstrumentWords.includes(word)) {
            matchingWordsCount++;
        }
    }
    // Calculate the score out of 100
    const totalUniqueWords = uniqueIdeaWords.length;
    const score = (matchingWordsCount / totalUniqueWords) * 100;
    return score;
};
exports.compareResearchDescriptions = compareResearchDescriptions;
