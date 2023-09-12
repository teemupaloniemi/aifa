"use strict";
// utility.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareResearchDescriptions = void 0;
/**
 * Utility functions for assessment of items.
 */
// Function to compare two research descriptions
const compareResearchDescriptions = (researchIdea, researchInstrument) => {
    // Convert both descriptions to lowercase and split them into arrays of words
    const ideaWords = researchIdea.toLowerCase().split(/\s+/);
    const instrumentWords = researchInstrument.toLowerCase().split(/\s+/);
    // Remove duplicates from both arrays
    const uniqueIdeaWords = Array.from(new Set(ideaWords));
    const uniqueInstrumentWords = Array.from(new Set(instrumentWords));
    // Count the number of matching words
    let matchingWordsCount = 0;
    for (const word of uniqueIdeaWords) {
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
// Additional utility functions can be added below
// export const anotherFunction = (param1: Type, param2: Type): ReturnType => {
//   // Logic goes here
// };