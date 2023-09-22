import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getKeywords(researchIdea: string): Promise<string> {
  console.log("\nGenerating keywords...")
  const chatCompletion_keywords = await openai.chat.completions.create({
    messages: [{ role: "user", content: `Give ten to fifteen single-word keywords that thematically best describe the following research, developement or innovation idea (just keywords no numbers or commas). Give the keywords in a xml tag <keywords>insert keywords here</keywords> This is the research idea: ${researchIdea}` }],
    model: "gpt-3.5-turbo",
  });

  // Extracting the content between the <keywords> tags
  const keywordMatch = chatCompletion_keywords.choices[0].message.content?.match(/<keywords>(.*?)<\/keywords>/);

  // If keywords are found, remove any numbers or commas and return the result
  const keywords = keywordMatch ? keywordMatch[1].replace(/\b\d+\.?\b/g, "").replace(/,/g, '') : "";

  console.log("Keywords generated:\n", keywords);
  return keywords;
}
