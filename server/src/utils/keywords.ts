import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getKeywords(researchIdea: string): Promise<string> {
  console.log("\nGenerating keywords...")
  const chatCompletion_keywords = await openai.chat.completions.create({
    messages: [{ role: "user", content: `I want to generate a list of keywords in english that best describe this research idea. Keywords should be relevant for funding instrument search ${researchIdea}` }],
    model: "gpt-3.5-turbo",
  });
  console.log("Keywords generated:\n", chatCompletion_keywords.choices[0].message.content as string)
  return chatCompletion_keywords.choices[0].message.content as string;
}
