"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectFramework = void 0;
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
async function selectFramework(researchIdea, frameworks) {
    var _a;
    console.log("Selecting frameworks...");
    const chatCompletion_framework = await openai.chat.completions.create({
        messages: [{ role: "user", content: `I want to compare European Commission funding opportunities. Tell me which ones of the following framework ids are a good fit for this idea\n${researchIdea}\n\nHere are the possible funds\n\n${JSON.stringify(frameworks)}. You can give multiple ids if appropriate but give the ids in comma separated list inside the xml. \n\nGive the best fitting fund IDs in xml tags <ids>the ids go here in comma separated form</ids>` }],
        model: "gpt-3.5-turbo",
    });
    const match = (_a = chatCompletion_framework.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.match(/<ids>([\d,\s]+)<\/ids>/);
    console.log("Frameworks selected:\n", match ? match[1].split(',') : ["43108390"]);
    return match ? match[1].split(',') : ["43108390"];
}
exports.selectFramework = selectFramework;
