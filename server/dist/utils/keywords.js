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
    var _a;
    console.log("\nGenerating keywords...");
    const chatCompletion_keywords = await openai.chat.completions.create({
        messages: [{ role: "user", content: `Give five to ten single-word keywords that thematically best describe the following research, developement or innovation idea (just keywords no numbers or commas). Give the keywords in a xml tag <keywords>insert keywords here</keywords> This is the research idea: ${researchIdea}` }],
        model: "gpt-3.5-turbo",
    });
    // Extracting the content between the <keywords> tags
    const keywordMatch = (_a = chatCompletion_keywords.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.match(/<keywords>(.*?)<\/keywords>/);
    // If keywords are found, remove any numbers or commas and return the result
    const keywords = keywordMatch ? keywordMatch[1].replace(/\b\d+\.?\b/g, "").replace(/,/g, '') : "";
    console.log("Keywords generated:\n", keywords);
    return keywords;
}
exports.getKeywords = getKeywords;
