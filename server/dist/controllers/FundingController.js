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
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
dotenv_1.default.config();
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const frameworks = [
    { id: "43108390", name: "Horizon Europe (HORIZON)", keywords: "Research, Innovation, Science, Technology" },
    { id: "44181033", name: "European Defence Fund (EDF)", keywords: "Defense, Security, Military, Technology" },
    { id: "111111", name: "EU External Action (RELEX)", keywords: "Foreign Policy, Diplomacy, International Relations" },
    { id: "43152860", name: "Digital Europe Programme (DIGITAL)", keywords: "Digitalization, Technology, Internet, Cybersecurity" },
    { id: "43252405", name: "Programme for the Environment and Climate Action (LIFE)", keywords: "Environment, Climate Change, Sustainability" },
    { id: "43332642", name: "EU4Health Programme (EU4H)", keywords: "Healthcare, Public Health, Medical Research" },
    { id: "43298916", name: "Euratom Research and Training Programme (EURATOM)", keywords: "Nuclear Energy, Research, Safety" },
    { id: "43251567", name: "Connecting Europe Facility (CEF)", keywords: "Infrastructure, Transport, Energy, Digital" },
    { id: "43252449", name: "Research Fund for Coal & Steel (RFCS)", keywords: "Coal, Steel, Industrial Research" },
    { id: "45532249", name: "EU Bodies and Agencies (EUBA)", keywords: "EU Institutions, Governance, Regulatory Bodies" },
    { id: "43353764", name: "Erasmus+ (ERASMUS+)", keywords: "Education, Student Exchange, Training" },
    { id: "43637601", name: "Pilot Projects & Preparation Actions (PPPA)", keywords: "Pilot Projects, Innovation, Development" },
    { id: "43252476", name: "Single Market Programme (SMP)", keywords: "Economic Integration, Trade, Single Market" },
    { id: "43697167", name: "European Parliament (EP)", keywords: "Legislation, Governance, Democracy" },
    { id: "44416173", name: "Interregional Innovation Investments Instrument (I3)", keywords: "Regional Development, Innovation, Investment" },
    { id: "44773066", name: "Just Transition Mechanism (JTM)", keywords: "Social Justice, Economic Transition, Sustainability" },
    { id: "43089234", name: "Innovation Fund (INNOVFUND)", keywords: "Innovation, Technology, Startups" },
    { id: "43251589", name: "Citizens, Equality, Rights and Values Programme (CERV)", keywords: "Human Rights, Equality, Citizenship" },
    { id: "43252386", name: "Justice Programme (JUST)", keywords: "Legal Systems, Justice, Rule of Law" },
    { id: "43252433", name: "Programme for the Protection of the Euro against Counterfeiting (PERICLES IV)", keywords: "Currency, Counterfeiting, Security" },
    { id: "43253967", name: "Renewable Energy Financing Mechanism (RENEWFM)", keywords: "Renewable Energy, Finance, Sustainability" },
    { id: "43254037", name: "European Solidarity Corps (ESC)", keywords: "Volunteering, Solidarity, Community Service" },
    { id: "43392145", name: "European Maritime, Fisheries and Aquaculture Fund (EMFAF)", keywords: "Maritime, Fisheries, Aquaculture, Sustainability" },
    { id: "43254019", name: "European Social Fund + (ESF)", keywords: "Employment, Social Inclusion, Education" }
];
class FundingController {
    static async searchTenders(req, res) {
        var _a;
        const researchIdea = req.body.researchIdea;
        let framework = "43108390"; //use horizon as default
        let keywords = researchIdea;
        try {
            console.log('searchTenders: Preparing query data');
            try {
                // Generate chat completion using OpenAI API
                const chatCompletion = await openai.chat.completions.create({
                    messages: [{ role: "user", content: `I want to compare European Commission funding opportunities. Tell me which one of the following framework ids is a good fit for this idea\n${researchIdea}\n\nThese are the possible funds\n\n${JSON.stringify(frameworks)}.\n\nGive the best fitting fund ID in xml tags <id>the id goes here</id>` }],
                    model: "gpt-3.5-turbo",
                });
                // Log the generated completion for debugging
                console.log("\n\nFund ID: ", chatCompletion.choices[0].message.content);
                const match = (_a = chatCompletion.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.match(/<id>(\d+)<\/id>/);
                framework = match ? match[1] : "43108390"; //use horizon as default
                // Generate chat completion using OpenAI API this is for matching
                const chatCompletion_keywords = await openai.chat.completions.create({
                    messages: [{ role: "user", content: `I want to gnerate a list of keywords that best describe this research idea ${researchIdea}` }],
                    model: "gpt-3.5-turbo",
                });
                console.log("\n\nKeywords from research idea: ", chatCompletion_keywords.choices[0].message.content);
                keywords = chatCompletion_keywords.choices[0].message.content ? chatCompletion_keywords.choices[0].message.content : keywords;
            }
            catch (error) {
                if (error.response) {
                    console.error(error.response.status, error.response.data);
                    res.status(error.response.status).json(error.response.data);
                }
                else {
                    console.error(`Error with OpenAI API request: ${error.message}`);
                    res.status(500).json({
                        error: {
                            message: 'An error occurred during your request.',
                        }
                    });
                }
            }
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
            console.log('\n\nsearchTenders: Sending request to API');
            const response = await axios_1.default.post('https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=SEDIA&text=***&pageSize=50&pageNumber=1', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 300000 // 5 minutes in milliseconds
            });
            const items = response.data.results; // Assuming the items are stored in a 'results' field
            // Initialize the browser outside the loop
            const browser = await puppeteer_1.default.launch({
                executablePath: puppeteer_1.default.executablePath(),
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            console.log("\n\nsearching from these funds\n\n");
            const updatedItems = await Promise.all(items.map(async (item) => {
                const identifier = item.metadata.identifier[0];
                console.log(identifier);
                const url = `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${identifier.toLowerCase()}`;
                const scrapedContent = await (0, scrape_1.scrapeContent)(url, browser); // Pass the browser instance
                const score = (0, suitability_1.compareResearchDescriptions)(keywords, scrapedContent);
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
