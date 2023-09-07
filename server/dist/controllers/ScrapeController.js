"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrape = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
let visitedLinks = [];
let pageCount = 0;
let linkQueue = [];
async function scrapeFunds(page) {
    const funds = [];
    // Wait for the section to be visible
    await page.waitForSelector('section.ux-u-bg-primary.px-5.py-2');
    // Get all the divs that contain the funds
    const fundDivs = await page.$$('section.ux-u-bg-primary.px-5.py-2 div.top-border');
    for (const fundDiv of fundDivs) {
        // Focus on the div (simulate mouse over)
        await fundDiv.hover();
        // Get the text content of the p element within the div
        const fundName = await fundDiv.$eval('p', (el) => el.textContent);
        if (fundName) {
            funds.push(fundName);
        }
    }
    return funds;
}
async function scrapePage(browser, maxPages) {
    console.log("Entering scrapePage function");
    while (linkQueue.length > 0 && pageCount < maxPages) {
        console.log("Inside while loop");
        const url = linkQueue.shift();
        console.log(`Processing URL: ${url}`);
        if (visitedLinks.some((linkObj) => linkObj.link === url)) {
            console.log(`URL already visited: ${url}`);
            continue;
        }
        const page = await browser.newPage();
        console.log(`Opened new page for URL: ${url}`);
        try {
            await page.goto(url, { waitUntil: 'load', timeout: 60000 });
            // Scrape the list of EU Programmes (funds) if the URL matches
            if (url === 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home') {
                const funds = await scrapeFunds(page);
                console.log('Scraped Funds:', funds);
            }
        }
        catch (error) {
            console.error(`Failed to navigate to ${url}: ${error}`);
            await page.close();
            continue;
        }
        // Summarize the page (this is a placeholder; you'd use a real summarization algorithm)
        const summary = await page.title();
        console.log(`\n\nSummarized ${url}: ${summary}`);
        visitedLinks.push({ link: url, summary });
        pageCount++;
        console.log(`Page count: ${pageCount}`);
        // Find new links
        const newLinks = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.startsWith('http')); // Filter out invalid URLs
        });
        console.log(`Found new links: ${newLinks.length}`);
        await page.close();
        console.log(`Closed page for URL: ${url}`);
        linkQueue.push(...newLinks);
        console.log(`Updated link queue: ${linkQueue.length}`);
    }
}
const scrape = async (req, res) => {
    try {
        console.log("Received GET /scrape request");
        const maxPages = parseInt(req.query.maxPages) || 10;
        const browser = await puppeteer_1.default.launch({ headless: "new" });
        console.log("Launched browser");
        linkQueue.push('https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home');
        console.log("Initial link added to queue");
        await scrapePage(browser, maxPages);
        console.log("Scraping completed");
        await browser.close();
        console.log("Closed browser");
        res.status(200).json(visitedLinks); // HTTP 200 OK
        console.log("Sent response");
    }
    catch (error) {
        console.error(`An error occurred: ${error}`);
        res.status(500).json({ message: 'Internal Server Error' }); // HTTP 500 Internal Server Error
    }
};
exports.scrape = scrape;
