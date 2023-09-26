"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeywords = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function getKeywords(researchIdea) {
    console.log("\nGenerating keywords...");
    try {
        const response = await axios_1.default.post('http://localhost:8000/query', {
            prompt: `Provide keywords for R&D: ${researchIdea} in tags like this <keywords>keywords go in here</keywords>. Keywords are: <keywords>`
        });
        const result = response.data.response.replace(`Provide keywords for R&D: ${researchIdea} in tags like this <keywords>keywords go in here</keywords>. Keywords are:`, "");
        console.log("\n\n\n\x1B[34m", result, "\x1B[0m\n\n\n");
        //console.log(response.data.response);
        const matches = [...result.matchAll(/<keywords>(.*?)<\/keywords>/g)];
        const keywordMatch = matches.map(match => match[1]).join(', ');
        // If keywords are found, remove any numbers or commas and return the result
        let keywords = keywordMatch ? keywordMatch.replace(/\b\d+\.?\b/g, "").replace(/,/g, '') : "NO-KEYWORDS-GENERATED";
        if (keywords.length === 0)
            keywords = "NO-KEYWORDS-GENERATED";
        console.log("Keywords generated:\n", keywords);
        return keywords;
    }
    catch (error) {
        console.error("Error making request:", error);
        return "ERROR-IN-GENERATING-KEYWORDS";
    }
}
exports.getKeywords = getKeywords;
