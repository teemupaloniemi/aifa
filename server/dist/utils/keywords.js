"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeywordsOpenAI = void 0;
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
async function getKeywordsOpenAI(researchIdea) {
    console.log("\nGenerating keywords...");
    const chatCompletion_keywords = await openai.chat.completions.create({
        messages: [{ role: "user", content: `Provide keywords that could be relevat for this R&D: ${researchIdea}. \n Give the keywords in tags like this <keywords>keyword1, keyword2, keyword3</keywords>.` }],
        model: "gpt-3.5-turbo",
    });
    const content = chatCompletion_keywords.choices[0].message.content;
    console.log("GPT response: ", content);
    // Extracting the content between the <keywords> tags
    const keywordMatch = content === null || content === void 0 ? void 0 : content.match(/<keywords>(.*?)<\/keywords>/);
    // If keywords are found, remove any numbers or commas and return the result
    const keywords = keywordMatch ? keywordMatch[1].replace(/\b\d+\.?\b/g, "").replace(/,/g, '') : "";
    console.log("Keywords generated:\n", keywords);
    return keywords;
}
exports.getKeywordsOpenAI = getKeywordsOpenAI;
