import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function getKeywords(researchIdea: string): Promise<string> {
  console.log("\nGenerating keywords...")

  try {
    const response = await axios.post('http://localhost:8000/query', { 
      prompt: `Provide keywords for R&D: ${researchIdea} in tags like this <keywords>keywords go in here</keywords>. Keywords are: <keywords>`
    });

    const result = response.data.response.replace(`Provide keywords for R&D: ${researchIdea} in tags like this <keywords>keywords go in here</keywords>. Keywords are:`,"");

    console.log("\n\n\n\x1B[34m", result, "\x1B[0m\n\n\n");

    //console.log(response.data.response);
    const matches = [...result.matchAll(/<keywords>(.*?)<\/keywords>/g)];

    const keywordMatch = matches.map(match => match[1]).join(', ');    
    
    // If keywords are found, remove any numbers or commas and return the result
    let keywords = keywordMatch ? keywordMatch.replace(/\b\d+\.?\b/g, "").replace(/,/g, '') : "NO-KEYWORDS-GENERATED";
    if (keywords.length === 0) keywords = "NO-KEYWORDS-GENERATED";
    console.log("Keywords generated:\n", keywords);
    return keywords;
  } catch (error) {
    console.error("Error making request:", error);
    return "ERROR-IN-GENERATING-KEYWORDS";
  }
}
