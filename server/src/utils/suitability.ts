/**
 * Utility functions for assessment of items.
 */
// Function to compare two descriptions
export const compareResearchDescriptions = (researchIdea: string, researchInstrument: string): number => {
  // Convert both descriptions to lowercase and split them into arrays of words
  let ideaWords = ["No research idea"];
  let instrumentWords = ["No instrument"];
  if (researchIdea) ideaWords = researchIdea.toLowerCase().replace(',', '').split(/\s+/);
  else {
    console.log(ideaWords);
    return 0;
  }
  if (researchInstrument) instrumentWords = researchInstrument.toLowerCase().replace(',', '').split(/\s+/);
  else {
    console.log(instrumentWords);
    return 0;
  }
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