import { generate } from './generate'


export async function getKeywords(researchIdea: string): Promise<string> {
  console.log("\nGenerating keywords...")

  try {
    let result = await generate(`Provide keywords that could be relevat for R&D: ${researchIdea} in tags like this <keywords>keywords go in here</keywords>. Keywords that fit your idea are: <keywords> `);

    result = "<keywords>"+result 
    console.log("\n\x1B[34m", result, "\x1B[0m\n");

    //console.log(response.data.response);
    const matches = [...result.matchAll(/<keywords>(.*?)<\/keywords>/g)];

    const keywordMatch = matches.map(match => match[1]).join(', ');    
    
    // If keywords are found, remove any numbers or commas and return the result
    let keywords = keywordMatch ? keywordMatch.split(',').map(keyword => keyword.trim().replace(/"/g, '')).join(', ') : "NO-KEYWORDS-GENERATED";
    //let keywords = keywordMatch ? keywordMatch.replace(/\b\d+\.?\b/g, "").replace(/,/g, '').replace('"', '') : "NO-KEYWORDS-GENERATED";
    if (keywords.length === 0) keywords = "NO-KEYWORDS-GENERATED";
    console.log("Keywords generated:\n")
    console.log("\u001b[35m" + keywords + "\u001b[0m");
    return keywords;
  } catch (error) {
    console.error("Error making request:", error);
    return "ERROR-IN-GENERATING-KEYWORDS";
  }
}
