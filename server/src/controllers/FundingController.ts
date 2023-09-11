import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import { scrapeContent } from './scrape';
import { compareResearchDescriptions } from '../utils/suitability';
import puppeteer, { Browser } from 'puppeteer';

class FundingController {
  static async searchTenders(req: Request, res: Response): Promise<void> {
    const framework = req.query.framework as string;
    const researchIdea = req.body.researchIdea as string;

    try {
      console.log('searchTenders: Preparing query data');

      const formData = new FormData();

      formData.append('query', Buffer.from(JSON.stringify({
        "bool": {
          "must": [
            { "terms": { "type": ["1", "2", "8"] } },
            { "terms": { "status": ["31094501","31094502","31094503"] } }, //["31094501", "31094502"]
            { "term": { "programmePeriod": "2021 - 2027" } },
            { "terms": { "frameworkProgramme": [framework] } }
          ]
        }
      }), 'utf-8'), { contentType: 'application/json' });

      formData.append('languages', Buffer.from(JSON.stringify(["en"]), 'utf-8'), { contentType: 'application/json' });
      formData.append('sort', Buffer.from(JSON.stringify({ "field": "sortStatus", "order": "DESC" }), 'utf-8'), { contentType: 'application/json' });

      console.log('searchTenders: Sending request to API');

      const response = await axios.post(
        'https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=SEDIA&text=***&pageSize=50&pageNumber=1',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const items = response.data.results.length > 10 ? response.data.results.slice(10) : response.data.results;  // Assuming the items are stored in a 'results' field

      // Initialize the browser outside the loop
      const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(),
        headless: "new",  // Use the new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const updatedItems = await Promise.all(items.map(async (item: any) => {
        const identifier = item.metadata.identifier[0] as string;
        console.log(identifier);
        const url = `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${identifier.toLowerCase()}`;
        const scrapedContent = await scrapeContent(url, browser);  // Pass the browser instance
        const score = compareResearchDescriptions(researchIdea, scrapedContent);
        return {
          ...item,
          scrapedContent,
          score
        };
      }));

      // Close the browser after the loop
      await browser.close();

      res.json({ results: updatedItems });

    } catch (error) {
      console.log('searchTenders: Error occurred', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export { FundingController };
