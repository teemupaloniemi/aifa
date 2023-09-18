"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeywords = void 0;
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
async function getKeywords(researchIdea) {
    console.log("\nGenerating keywords...");
    const chatCompletion_keywords = await openai.chat.completions.create({
        messages: [{ role: "user", content: `I want to generate a list of keywords in english that best describe this research idea. Keywords should be relevant for funding instrument search ${researchIdea}` }],
        model: "gpt-3.5-turbo",
    });
    console.log("Keywords generated:\n", chatCompletion_keywords.choices[0].message.content);
    return chatCompletion_keywords.choices[0].message.content;
}
exports.getKeywords = getKeywords;
