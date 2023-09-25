import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function getKeywords(researchIdea: string): Promise<string> {
  console.log("\nGenerating keywords...")

  try {
    const response = await axios.post('http://localhost:8000/query', {
      researchIdea: `Give thematically accurate keywords for the following R&D description: ${researchIdea}. Give the keywords in these xml tags in comma separated list <keywords></keywords>. The keywords are`
    });
    console.log(response.data.response);
    const keywordMatch = response.data.response?.match(/<keywords>(.*?)<\/keywords>/);
    
    // If keywords are found, remove any numbers or commas and return the result
    const keywords = keywordMatch ? keywordMatch[1].replace(/\b\d+\.?\b/g, "").replace(/,/g, '') : "NO-KEYWORDS-GENERATED";

    console.log("Keywords generated:\n", keywords);
    return keywords;
  } catch (error) {
    console.error("Error making request:", error);
    return "ERROR-IN-GENERATING-KEYWORDS";
  }
}
