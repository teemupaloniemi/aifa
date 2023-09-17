import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import { scrapeContent } from './scrape';
import { compareResearchDescriptions } from '../utils/suitability';
import puppeteer, { Browser } from 'puppeteer';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Framework {
  id: string;
  name: string;
  keywords?: string;
}

const frameworks: Framework[] = [
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

// Function to process a batch of items
async function processBatch(items: any[], start: number, end: number, browser: Browser, keywords: string): Promise<any[]> {
  const batch = items.slice(start, end);
  return await Promise.all(batch.map(async (item: any) => {
    const identifier = item.metadata.identifier[0] as string;
    //console.log(identifier);
    const url = `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${identifier.toLowerCase()}`;
    const scrapedContent = await scrapeContent(url, browser);
    const score = compareResearchDescriptions(keywords, scrapedContent);
    return {
      ...item,
      scrapedContent,
      score
    };
  }));
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class FundingController {
  static async searchTenders(req: Request, res: Response): Promise<void> {
    let researchIdea = req.body.researchIdea as string;
    let fitting_frameworks = ["431083909"]; //use horizon as default
    let keywords = researchIdea;

    try {
      console.log('searchTenders: Preparing query data');

      try {

        // Generate chat completion using OpenAI API this is for matching
        const chatCompletion_translate = await openai.chat.completions.create({
          messages: [{ role: "user", content: `Translate this text to english. If its already in english leave it in english. \n\n${researchIdea}` }],
          model: "gpt-3.5-turbo",
        });

        researchIdea = chatCompletion_translate.choices[0].message.content as string;
        console.log("\n\nTranslated: ", researchIdea);

        // Generate chat completion using OpenAI API
        const chatCompletion_framework = await openai.chat.completions.create({
          messages: [{ role: "user", content: `I want to compare European Commission funding opportunities. Tell me which ones of the following framework ids are a good fit for this idea\n${researchIdea}\n\nHere are the possible funds\n\n${JSON.stringify(frameworks)}. You can give multiple ids if appropriate but give the ids in comma separated list inside the xml. \n\nGive the best fitting fund IDs in xml tags <ids>the ids go here in comma separated form</ids>` }],
          model: "gpt-3.5-turbo",
        });

        // Log the generated completion for debugging
        console.log("\n\nFund ID: ", chatCompletion_framework.choices[0].message.content);

        const match = chatCompletion_framework.choices[0].message.content?.match(/<ids>([\d,\s]+)<\/ids>/);
        fitting_frameworks = match ? match[1].split(',') : ["43108390"];  //use horizon as default
        console.log(fitting_frameworks)
        // Generate chat completion using OpenAI API this is for matching
        const chatCompletion_keywords = await openai.chat.completions.create({
          messages: [{ role: "user", content: `I want to generate a list of keywords in english that best describe this research idea. Keywords should be relevant for funding instrument search ${researchIdea}` }],
          model: "gpt-3.5-turbo",
        });

        console.log("\n\nKeywords from research idea: ", chatCompletion_keywords.choices[0].message.content)
        keywords = chatCompletion_keywords.choices[0].message.content ? chatCompletion_keywords.choices[0].message.content : keywords;

      } catch (error: any) {
        if (error.response) {
          console.error(error.response.status, error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
          res.status(500).json({
            error: {
              message: 'An error occurred during your request.',
            }
          });
        }
      }

      const allItems: any[] = [];

      // Loop through each framework in fitting_frameworks
      for (const framework of fitting_frameworks) {
        await delay(5000);
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

        console.log('\n\nsearchTenders: Sending request to API');
        console.log('This is the framework:', framework.trim())

        const response = await axios.post(
          'https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=SEDIA&text=*&pageSize=500&pageNumber=1',
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'Content-Type': 'multipart/form-data'
            },
            timeout: 300000
          }
        );
        //console.log(response.data)
        const items = response.data.results;
        console.log("Results found from this framework:", items.length);
        allItems.push(...items);  // Combine the results with the allItems list
      }
      console.log("\n\nResults found from API:", allItems.length);
      // Initialize the browser outside the loop
      const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(),
        headless: "new",  // Use the new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const updatedItems: any[] = [];

      // Define batch size
      const batchSize = 50;
      console.log("\nBatch size:", batchSize);

      for (let i = 0; i < allItems.length; i += batchSize) {
        console.log(`Analyzing batch: ${i}-${Math.min(i + batchSize, allItems.length)}`)
        const endIndex = Math.min(i + batchSize, allItems.length);
        const batchResult = await processBatch(allItems, i, endIndex, browser, keywords);
        updatedItems.push(...batchResult);
      }

      // Close the browser after the loop
      await browser.close();
      console.log("\n\nResults analyzed:", updatedItems.length);
      res.json({ results: updatedItems });

    } catch (error) {
      console.log('searchTenders: Error occurred', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export { FundingController };
