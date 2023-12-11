const { Client } = require('pg');
const axios = require('axios');
const FormData = require('form-data');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

dotenv.config();

const frameworks = [
  { id: "43108390", name: "Horizon Europe (HORIZON)", keywords: "Research, Innovation, Science, Technology" },
  { id: "44181033", name: "European Defence Fund (EDF)", keywords: "Defense, Security, Military, Technology" }, 
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
  { id: "43254019", name: "European Social Fund + (ESF)", keywords: "Employment, Social Inclusion, Education" },
  { id: "43298664", name: "Promotion of Agricultural Products (AGRIP)", keywords: "Agriculture, Farming, Production, Sustainability, Agri-tech" },
  { id: "43251814", name: "Creative Europe Programme (CREA)", keywords: "Culture, Arts, Media, Audiovisual" },
  { id: "43251842", name: "Union Anti-fraud Programme (EUAF)", keywords: "Anti-fraud, Security, Integrity, Governance" },
  { id: "43252368", name: "Internal Security Fund (ISF)", keywords: "Security, Law Enforcement, Border Control" },
  { id: "43298203", name: "Union Civil Protection Mechanism (UCPM)", keywords: "Civil Protection, Disaster Response, Emergency Management" },
  { id: "43252517", name: "Social Prerogative and Specific Competencies Lines (SOCPL)", keywords: "Social Rights, Competencies, Governance" },
  { id: "43251447", name: "Asylum, Migration and Integration Fund (AMIF)", keywords: "Asylum, Migration, Integration, Refugees" },
  { id: "43251530", name: "Border Management and Visa Policy Instrument (BMVI)", keywords: "Borders, Visa Policy, Immigration, Security" },
  { id: "43251882", name: "Support for information measures relating to the common agricultural policy (IMCAP)", keywords: "Agriculture, Information, Policy, Farming" },
  { id: "44773133", name: "Information Measures for the EU Cohesion policy (IMREG)", keywords: "EU Cohesion, Information, Regional Development" },
  { id: "45876777", name: "Neighbourhood, Development and International Cooperation Instrument Global Europe (NDICI)", keywords: "Neighbourhood, Development, International Cooperation, Global Relations" }
];


async function searchFromFrameworks(fitting_frameworks) {
    const allItems = [];

    try {
    // Loop through each framework in fitting_frameworks
    for (const framework of fitting_frameworks) {
        await new Promise(resolve => setTimeout(resolve, 5000));  // Delay for 5 seconds
        const formData = new FormData();
        formData.append('query', Buffer.from(JSON.stringify({
            "bool": {
                "must": [
                    { "terms": { "type": ["1", "2", "8"] } },
                    { "terms": { "status": ["31094501", "31094502"] } }, // "31094501" forthcoming, "31094502" open, "31094503" closed
                    { "term": { "programmePeriod": "2021 - 2027" } },
                    { "terms": { "frameworkProgramme": [framework.trim()] } }  // Set the frameworkProgramme field
                ]
            }
        }), 'utf-8'), { contentType: 'application/json' });

        formData.append('languages', Buffer.from(JSON.stringify(["en"]), 'utf-8'), { contentType: 'application/json' });
        formData.append('sort', Buffer.from(JSON.stringify({ "field": "sortStatus", "order": "DESC" }), 'utf-8'), { contentType: 'application/json' });

        console.log('\nsearchTenders: Sending request to API:', framework.trim());

        const response = await axios.post(
            'https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=SEDIA&text=*&pageSize=600&pageNumber=1',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 300000
            }
        );
        const items = response.data.results;
        console.log("Results found from this framework:", items.length);
        allItems.push(...items);  // Combine the results with the allItems list
    } } catch (Error) {
        console.error("Error", Error.message);
    }

    return allItems;
}


const scrapeContent = async (url, browser) => {
    try {
        const page = await browser.newPage();
        await page.goto(url);

        // Wait for the iframe to load
        const iframeSelector = 'body > app-root > ng-component > eui-app > div > div > mywp-route-element-loader > mywp-element-loader > div > iframe';
        await page.waitForSelector(iframeSelector, {timeout: 300000});

        // Get the iframe's content frame
        const iframeElement = await page.$(iframeSelector);
        const iframeContent = await iframeElement.contentFrame();

        // Wait for a specific element inside the iframe
        await iframeContent.waitForSelector('eui-page.eui-page--with-columns', {timeout: 300000});

        // Now you can use iframeContent just like you'd use the main page object to scrape content
        const iframeText = await iframeContent.evaluate(() => document.body.innerText);

        console.log("Iframe text length:", iframeText.length);
        return iframeText;

    } catch (error) {
        console.log("Error:", error.message);
        return "Error";
    }
};





async function processBatch(items, start, end, browser) {
    const batch = items.slice(start, end);
    return await Promise.all(batch.map(async (item) => {
        const identifier = item.metadata.identifier[0];
        console.log(identifier.toLowerCase())
        const url = `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${identifier.toLowerCase()}`;
        const scrapedContent = await scrapeContent(url, browser);
        return {
            ...item,
            scrapedContent
        };
    }));
}

async function analyse(allItems) {
    // Initialize the browser
    const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(),
        headless: "new",  // Use the headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const updatedItems = [];

    // Define batch size
    const batchSize = 50;

    for (let i = 0; i < allItems.length; i += batchSize) {
        console.log(`\nAnalyzing batch: ${i}-${Math.min(i + batchSize, allItems.length)}`)
        const endIndex = Math.min(i + batchSize, allItems.length);
        const batchResult = await processBatch(allItems, i, endIndex, browser);
        updatedItems.push(...batchResult);
    }

    // Close the browser after the loop
    await browser.close();

    return updatedItems;
}


class database_f {
    async processFrameworks() {
        let savedCount = 0; // Initialize the saved count

        try {
            await client.connect();
            // Extract all the framework IDs
            const frameworkIds = frameworks.map(f => f.id);

            for (const frameworkId of frameworkIds) {
                console.log(`Processing framework: ${frameworkId}`);

                // Call searchFromFrameworks with the current framework ID
                const allItems = await searchFromFrameworks([frameworkId]);

                // Call analyse with all the results
                const analyzedItems = await analyse(allItems);

                // Save the results to the database for the current framework
                const savedThisBatch = await saveData(analyzedItems);
                savedCount += savedThisBatch; // Update the saved count

                console.log(`Framework ${frameworkId} processed and saved. Total saved so far: ${savedCount}`);
            }

            console.log("All frameworks processed and saved. Total items saved:", savedCount);
            await client.end();
        } catch (error) {
            console.error("Error in processFrameworks:", error);
            await client.end();
        }       
    }
}


const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'aifadmin',
    password: 'binaryblaze',
    database: 'aifabase',
});

const saveData = async (dataList) => {

    for (const data of dataList) {
        // Null checks and default values
        const identifier = (data.metadata.identifier && data.metadata.identifier[0]) || '';
        const caName = (data.metadata.caName && data.metadata.caName[0]) || '';
        const es_ContentType = (data.metadata.es_ContentType && data.metadata.es_ContentType[0]) || '';
        const keywords = data.metadata.keywords && data.metadata.keywords.length > 1 ? (data.metadata.keywords.join(',') && data.metadata.keywords.join(',')[0]) : 'empty';
        const programmePeriod = (data.metadata.programmePeriod && data.metadata.programmePeriod[0]) || '';
        const esDA_IngestDate = (data.metadata.esDA_IngestDate && data.metadata.esDA_IngestDate[0]) || '';
        const type = (data.metadata.type && data.metadata.type[0]) || '';
        const title = (data.metadata.title && data.metadata.title[0]) || '';
        const esST_URL = (data.metadata.esST_URL && data.metadata.esST_URL[0]) || '';
        const esDA_QueueDate = (data.metadata.esDA_QueueDate && data.metadata.esDA_QueueDate[0]) || '';
        const esST_FileName = (data.metadata.esST_FileName && data.metadata.esST_FileName[0]) || '';
        const callIdentifier = (data.metadata.callIdentifier && data.metadata.callIdentifier[0]) || '';
        const frameworkProgramme = (data.metadata.frameworkProgramme && data.metadata.frameworkProgramme[0]) || '';
        const startDate = (data.metadata.startDate && data.metadata.startDate[0]) || '';
        const deadlineDate = (data.metadata.deadlineDate && data.metadata.deadlineDate[0]) || '';
        
    
        // Insert into metadata table using parameterized query
        const metadataQuery = `
        INSERT INTO metadata(identifier, caName, es_ContentType, keywords, programmePeriod, esDA_IngestDate, type, title, esST_URL, esDA_QueueDate, esST_FileName, callIdentifier, frameworkProgramme, startDate, deadlineDate)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (identifier) 
        DO UPDATE SET 
            caName = EXCLUDED.caName,
            es_ContentType = EXCLUDED.es_ContentType,
            keywords = EXCLUDED.keywords,
            programmePeriod = EXCLUDED.programmePeriod,
            esDA_IngestDate = EXCLUDED.esDA_IngestDate,
            type = EXCLUDED.type,
            title = EXCLUDED.title,
            esST_URL = EXCLUDED.esST_URL,
            esDA_QueueDate = EXCLUDED.esDA_QueueDate,
            esST_FileName = EXCLUDED.esST_FileName,
            callIdentifier = EXCLUDED.callIdentifier,
            frameworkProgramme = EXCLUDED.frameworkProgramme,
            startDate = EXCLUDED.startDate,
            deadlineDate = EXCLUDED.deadlineDate
        RETURNING identifier;`;    
        const metadataValues = [identifier, caName, es_ContentType, keywords, programmePeriod, esDA_IngestDate, type, title, esST_URL, esDA_QueueDate, esST_FileName, callIdentifier, frameworkProgramme, startDate, deadlineDate];
        const metadataRes = await client.query(metadataQuery, metadataValues);
        console.log(metadataRes)
        const metadataId = metadataRes.rows[0].identifier;
     
        if (metadataRes.rowCount === 0) {
            console.log(`Conflict detected for identifier ${identifier}. No update needed.`);
        } else {
            console.log(`Inserted or updated identifier ${identifier}.`);
        }
    
        const detailedDataQuery = `
        INSERT INTO detaileddata(metadata_id, scrapedContent, title, language, content)
        VALUES($1, $2, $3, $4, $5)
        ON CONFLICT (metadata_id) 
        DO UPDATE SET 
            scrapedContent = EXCLUDED.scrapedContent,
            title = EXCLUDED.title,
            language = EXCLUDED.language,
            content = EXCLUDED.content;`;
        const detailedDataValues = [metadataId, data.scrapedContent || '', data.title || '', data.language || '', data.content || ''];
        const detailedDataRes = await client.query(detailedDataQuery, detailedDataValues);

        if (detailedDataRes.rowCount === 0) {
            console.log(`Conflict detected for metadata_id ${metadataId}. No update needed.`);
        } else {
            console.log(`Inserted or updated metadata_id ${metadataId}.`);
        }
    }

    return dataList.length;
};

// Create an instance of the database_f class
const db = new database_f();

// Call the processFrameworks function to process and save each framework's data
db.processFrameworks().catch(error => {
    console.error("Error processing frameworks:", error.message);
});
