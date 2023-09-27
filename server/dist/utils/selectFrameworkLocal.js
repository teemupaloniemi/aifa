"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectFramework = void 0;
const axios_1 = __importDefault(require("axios")); // We'll use axios to make HTTP requests
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function selectFramework(researchIdea, frameworks) {
    console.log("\nSelecting frameworks...");
    // Convert frameworks to condensed id-name pairs
    const condensedFrameworks = frameworks.map(f => `${f.id}:${f.name}`).join(',');
    // Use axios to send a POST request to our LLM API endpoint
    const response = await axios_1.default.post('http://localhost:8000/query', {
        prompt: `For idea ${researchIdea}, which European Commission funds from [${condensedFrameworks}] are best suitable? Reply with tags like this <ids>suitable ids here</ids>. Best fitting fund ids are: <ids>`
    });
    const result = response.data.response.replace(`For idea ${researchIdea}, which European Commission funds from [${condensedFrameworks}] are best suitable? Reply with tags like this <ids>suitable ids here</ids>. Best fitting fund ids are:`, "");
    console.log("\n\x1B[34m", result, "\x1B[0m\n");
    // Parse the response
    const matches = [...result.matchAll(/<ids>(.*?)<\/ids>/g)];
    const match = matches.map(match => match[1]).join(', ');
    const selectedIds = match
        ? match.split(',')
            .map((id) => id.replace(/[^0-9]/g, '').trim())
            .flatMap((id) => {
            let specialIdMatch = id.match(/111111/);
            let otherIds = id.replace(/111111/g, '').match(/\d{1,8}/g) || [];
            if (specialIdMatch) {
                return [specialIdMatch[0], ...otherIds];
            }
            else {
                return otherIds;
            }
        })
        : ["43108390"];
    console.log("Frameworks selected:\n");
    for (const id of selectedIds) {
        const framework = frameworks.find(f => f.id === id);
        if (framework) {
            console.log("\u001b[35m" + `ID: ${framework.id}, Name: ${framework.name}` + "\x1B[0m");
        }
    }
    return selectedIds;
}
exports.selectFramework = selectFramework;
