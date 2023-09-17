import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function translateText(researchIdea: string): Promise<string> {
  console.log("\nTranslating...");
  const chatCompletion_translate = await openai.chat.completions.create({
    messages: [{ role: "user", content: `Translate this text to english. If its already in english leave it in english. \n\n${researchIdea}` }],
    model: "gpt-3.5-turbo",
  });
  console.log("Translated");
  return chatCompletion_translate.choices[0].message.content as string;
}
