"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = void 0;
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
async function translateText(researchIdea) {
    console.log("\nTranslating...");
    const chatCompletion_translate = await openai.chat.completions.create({
        messages: [{ role: "user", content: `Translate this text to english. If its already in english leave it in english. \n\n${researchIdea}` }],
        model: "gpt-3.5-turbo",
    });
    console.log("Translated");
    return chatCompletion_translate.choices[0].message.content;
}
exports.translateText = translateText;
