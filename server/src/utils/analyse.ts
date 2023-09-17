import puppeteer, { Browser } from 'puppeteer';
import { scrapeContent } from './scrape';  // Assuming scrape.ts is in the same directory
import { compareResearchDescriptions } from './suitability';  // Adjust the path based on your directory structure

export async function processBatch(items: any[], start: number, end: number, browser: Browser, keywords: string): Promise<any[]> {
    const batch = items.slice(start, end);
    return await Promise.all(batch.map(async (item: any) => {
        const identifier = item.metadata.identifier[0] as string;
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

export async function analyse(allItems: any[], keywords: string): Promise<any[]> {
    // Initialize the browser
    const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(),
        headless: "new",  // Use the headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const updatedItems: any[] = [];

    // Define batch size
    const batchSize = 50;

    for (let i = 0; i < allItems.length; i += batchSize) {
        console.log(`\nAnalyzing batch: ${i}-${Math.min(i + batchSize, allItems.length)}`)
        const endIndex = Math.min(i + batchSize, allItems.length);
        const batchResult = await processBatch(allItems, i, endIndex, browser, keywords);
        updatedItems.push(...batchResult);
    }

    // Close the browser after the loop
    await browser.close();

    return updatedItems;
}
