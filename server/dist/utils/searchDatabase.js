"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFromDatabase = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function searchFromDatabase(fitting_frameworks = ["43108390"]) {
    const allItems = [];
    // Create a new client instance
    const client = new pg_1.Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: process.env.DB_PASSWORD,
        database: 'aifabase',
    });
    // Connect to the database
    await client.connect();
    // Loop through each framework in fitting_frameworks
    for (const framework of fitting_frameworks) {
        console.log('\nsearchDatabase: Querying database for framework:', framework.trim());
        // Construct the SQL query to join detaileddata and metadata tables
        const query = `
            SELECT * FROM detaileddata d
            JOIN metadata m ON d.metadata_id = m.id
            WHERE m.frameworkprogramme IN ('${framework.trim()}');
        `;
        // Execute the query
        const response = await client.query(query);
        const items = response.rows.map(row => ({
            metadata: {
                identifier: row.identifier,
                caName: row.caname,
                es_ContentType: row.es_contenttype,
                keywords: row.keywords,
                programmePeriod: row.programmeperiod,
                esDA_IngestDate: row.esda_ingestdate,
                type: row.type,
                title: row.metadata_title,
                esST_URL: row.esst_url,
                esDA_QueueDate: row.esda_queuedate,
                esST_FileName: row.esst_filename,
                callIdentifier: row.callidentifier,
                frameworkProgramme: row.frameworkprogramme,
                startDate: row.startdate,
                deadlineDate: row.deadlinedate,
            },
            scrapedContent: row.scrapedcontent,
            title: row.detailed_title,
            language: row.language,
            content: row.content,
            score: row.score
        }));
        console.log("Results found from this framework:", items.length);
        allItems.push(...items); // Combine the results with the allItems list
    }
    // Close the database connection
    await client.end();
    return allItems;
}
exports.searchFromDatabase = searchFromDatabase;
