"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingController = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const ParameterController_1 = require("./ParameterController");
class FundingController {
    static async searchTenders(req, res) {
        const framework = req.query.framework;
        try {
            console.log('searchTenders: Preparing query data');
            const formData = new form_data_1.default();
            formData.append('query', Buffer.from(JSON.stringify({
                "bool": {
                    "must": [
                        { "terms": { "type": ["1", "2", "8"] } },
                        { "terms": { "status": ["31094501", "31094502"] } },
                        { "term": { "programmePeriod": "2021 - 2027" } },
                        { "terms": { "frameworkProgramme": [framework] } }
                    ]
                }
            }), 'utf-8'), { contentType: 'application/json' });
            formData.append('languages', Buffer.from(JSON.stringify(["en"]), 'utf-8'), { contentType: 'application/json' });
            formData.append('sort', Buffer.from(JSON.stringify({ "field": "sortStatus", "order": "DESC" }), 'utf-8'), { contentType: 'application/json' });
            console.log('searchTenders: Sending request to API');
            const response = await axios_1.default.post('https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=SEDIA&text=***&pageSize=50&pageNumber=1', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            const items = response.data.results; // Assuming the items are stored in a 'results' field
            console.log(items[0]);
            // Loop through each item and fetch the scraped content
            const updatedItems = await Promise.all(items.map(async (item) => {
                const identifier = item.metadata.identifier[0];
                console.log(identifier);
                const url = `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${identifier.toLowerCase()}`;
                const scrapedContent = await (0, ParameterController_1.scrapeContent)(url);
                return {
                    ...item,
                    scrapedContent // Add the scraped content as a new field
                };
            }));
            res.json({ results: updatedItems });
        }
        catch (error) {
            console.log('searchTenders: Error occurred', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
exports.FundingController = FundingController;
