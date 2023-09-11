"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingController = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const scrape_1 = require("./scrape");
const suitability_1 = require("../utils/suitability");
const puppeteer_1 = __importDefault(require("puppeteer"));
class FundingController {
    static async searchTenders(req, res) {
        const framework = req.query.framework;
        const researchIdea = req.body.researchIdea;
        try {
            console.log('searchTenders: Preparing query data');
            const formData = new form_data_1.default();
            formData.append('query', Buffer.from(JSON.stringify({
                "bool": {
                    "must": [
                        { "terms": { "type": ["1", "2", "8"] } },
                        { "terms": { "status": ["31094501", "31094502", "31094503"] } },
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
            const items = response.data.results.length > 10 ? response.data.results.slice(10) : response.data.results; // Assuming the items are stored in a 'results' field
            // Initialize the browser outside the loop
            const browser = await puppeteer_1.default.launch({
                executablePath: puppeteer_1.default.executablePath(),
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const updatedItems = await Promise.all(items.map(async (item) => {
                const identifier = item.metadata.identifier[0];
                console.log(identifier);
                const url = `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${identifier.toLowerCase()}`;
                const scrapedContent = await (0, scrape_1.scrapeContent)(url, browser); // Pass the browser instance
                const score = (0, suitability_1.compareResearchDescriptions)(researchIdea, scrapedContent);
                return {
                    ...item,
                    scrapedContent,
                    score
                };
            }));
            // Close the browser after the loop
            await browser.close();
            res.json({ results: updatedItems });
        }
        catch (error) {
            console.log('searchTenders: Error occurred', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
exports.FundingController = FundingController;
