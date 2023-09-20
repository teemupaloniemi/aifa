"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFromFrameworks = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
async function searchFromFrameworks(fitting_frameworks = ["43108390"]) {
    const allItems = [];
    // Loop through each framework in fitting_frameworks
    for (const framework of fitting_frameworks) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 5 seconds
        const formData = new form_data_1.default();
        formData.append('query', Buffer.from(JSON.stringify({
            "bool": {
                "must": [
                    { "terms": { "type": ["1", "2", "8"] } },
                    { "terms": { "status": ["31094501", "31094502"] } },
                    { "term": { "programmePeriod": "2021 - 2027" } },
                    { "terms": { "frameworkProgramme": [framework.trim()] } } // Set the frameworkProgramme field
                ]
            }
        }), 'utf-8'), { contentType: 'application/json' });
        formData.append('languages', Buffer.from(JSON.stringify(["en"]), 'utf-8'), { contentType: 'application/json' });
        formData.append('sort', Buffer.from(JSON.stringify({ "field": "sortStatus", "order": "DESC" }), 'utf-8'), { contentType: 'application/json' });
        console.log('\nsearchTenders: Sending request to API:', framework.trim());
        const response = await axios_1.default.post('https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=SEDIA&text=*&pageSize=500&pageNumber=1', formData, {
            headers: {
                ...formData.getHeaders(),
                'Content-Type': 'multipart/form-data'
            },
            timeout: 300000
        });
        const items = response.data.results;
        console.log("Results found from this framework:", items.length);
        allItems.push(...items); // Combine the results with the allItems list
    }
    return allItems;
}
exports.searchFromFrameworks = searchFromFrameworks;
