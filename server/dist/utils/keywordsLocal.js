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
        const ip = process.env.LLM_IP;
        const response = await axios_1.default.post(`http://${ip}/query`, {
            prompt: `Provide keywords that could be relevat for R&D: ${researchIdea} in tags like this <keywords>keywords go in here</keywords>. Keywords that fit your idea are: <keywords> `
        }, {
            timeout: 300000 // 5 minutes timeout
        });
        const result = response.data.response.replace(`Provide keywords that could be relevat for R&D: ${researchIdea} in tags like this <keywords>keywords go in here</keywords>. Keywords that fit your idea are:`, "");
        console.log("\n\x1B[34m", result, "\x1B[0m\n");
        //console.log(response.data.response);
        const matches = [...result.matchAll(/<keywords>(.*?)<\/keywords>/g)];
        const keywordMatch = matches.map(match => match[1]).join(', ');
        // If keywords are found, remove any numbers or commas and return the result
        let keywords = keywordMatch ? keywordMatch.split(',').map(keyword => keyword.trim().replace(/"/g, '')).join(', ') : "NO-KEYWORDS-GENERATED";
        //let keywords = keywordMatch ? keywordMatch.replace(/\b\d+\.?\b/g, "").replace(/,/g, '').replace('"', '') : "NO-KEYWORDS-GENERATED";
        if (keywords.length === 0)
            keywords = "NO-KEYWORDS-GENERATED";
        console.log("Keywords generated:\n");
        console.log("\u001b[35m" + keywords + "\u001b[0m");
        return keywords;
    }
    catch (error) {
        console.error("Error making request:", error);
        return "ERROR-IN-GENERATING-KEYWORDS";
    }
}
exports.getKeywords = getKeywords;
