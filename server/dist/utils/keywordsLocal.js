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
    var _a;
    console.log("\nGenerating keywords...");
    try {
        const response = await axios_1.default.post('http://localhost:8000/query', {
            researchIdea: `Give thematically accurate keywords for the following R&D description: ${researchIdea}. Give the keywords in these xml tags in comma separated list <keywords></keywords>. The keywords are`
        });
        console.log(response.data.response);
        const keywordMatch = (_a = response.data.response) === null || _a === void 0 ? void 0 : _a.match(/<keywords>(.*?)<\/keywords>/);
        // If keywords are found, remove any numbers or commas and return the result
        const keywords = keywordMatch ? keywordMatch[1].replace(/\b\d+\.?\b/g, "").replace(/,/g, '') : "NO-KEYWORDS-GENERATED";
        console.log("Keywords generated:\n", keywords);
        return keywords;
    }
    catch (error) {
        console.error("Error making request:", error);
        return "ERROR-IN-GENERATING-KEYWORDS";
    }
}
exports.getKeywords = getKeywords;
