import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

interface Framework {
    id: string;
    name: string;
    keywords?: string;
  }

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function selectFramework(researchIdea: string, frameworks: Framework[]): Promise<string[]> {
  console.log("\nSelecting frameworks...")
  const chatCompletion_framework = await openai.chat.completions.create({
    messages: [{ role: "user", content: `I want to compare European Commission funding opportunities. Tell me which ones of the following framework ids are a good fit for this idea\n${researchIdea}\n\nHere are the possible funds\n\n${JSON.stringify(frameworks)}. You can give multiple ids if appropriate but give the ids in comma separated list inside the xml. \n\nGive the best fitting fund IDs in xml tags <ids>the ids go here in comma separated form</ids>` }],
    model: "gpt-3.5-turbo",
  });
  const match = chatCompletion_framework.choices[0].message.content?.match(/<ids>([\d,\s]+)<\/ids>/);
  const selectedIds = match ? match[1].split(',').map(id => id.trim()) : ["43108390"];

  console.log("Frameworks selected:");
  for (const id of selectedIds) {
    const framework = frameworks.find(f => f.id === id);
    if (framework) {
      console.log(`ID: ${framework.id}, Name: ${framework.name}`);
    }
  }

  return selectedIds;
}
