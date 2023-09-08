import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import puppeteer from 'puppeteer';
import { Request, Response } from 'express';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const params = async (req: Request, res: Response) => {
    const url = req.body.url || req.query.url; // Assuming URL comes from request body or query

    if (!url) {
        return "No url provided!";
    }
    let contentPrompt = "";
    try {
        console.log("Launching the browser...");
        const browser = await puppeteer.launch({
            executablePath: puppeteer.executablePath(),
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        console.log("Opening a new page...");
        const page = await browser.newPage();

        console.log(`Navigating to URL: ${url}...`);
        await page.goto(url);

        console.log("Waiting for the main content to load...");
        await page.waitForSelector('#main-content'); // Wait for the element with id="main-content" to appear in the DOM

        console.log("Scraping content after the specified class...");
        const scrapedContent = await page.$$eval('body .ux-panel-content.ux-panel-content--fixed-height + *', elements => elements.map(el => el.outerHTML).join('\n'));

        console.log(`Snippet of scraped content: ${scrapedContent.slice(0, 500)}...`); // Displaying the first 500 characters as a snippet

        console.log("Fetching paragraphs...");
        const paragraphs = await page.$$eval('p', elements => elements.map(item => item.textContent));

        console.log("Closing the browser...");
        await browser.close();

        let textContent = paragraphs.join(' ');

        console.log(`Combined content length: ${textContent.length}`);
        console.log(`Snippet of content: ${textContent}`); // Displaying the first 100 characters as a snippet

        contentPrompt = textContent.length > 30000 ? textContent.slice(0, 30000) : textContent;

    } catch (error: any) {
        console.log("Error:", error.message);
        return res.status(500).send("Error occurred"); // Sending response
    }

    const combinedPrompt = `I want to analyze this research fund. Can you give me a structured list of key points like, budget, focus areas, organization type, and others that are relevant and summarize that fund. For example things like this
1. Name of the fund: 
2. Organization type: (government agency, non-profit organization, private foundation, etc.)
3. Budget: Total funding available for research projects.
4. Funding duration: (annual, multi-year, etc.)
5. Focus areas: Specific research areas the fund supports.
6. Research priorities: Key issues or topics the fund aims to address.
7. Eligibility criteria: Who can apply for funding (individual researchers, institutions, etc.)
8. Funding mechanisms: (grants, scholarships, fellowships, contracts, etc.)
9. Review process: How proposals are evaluated and awarded.
10. Funding restrictions: Any limitations on the usage of funds (e.g., human cloning, military research, etc.)
11. Reporting requirements: Obligations for project reporting and dissemination of research outcomes.
12. Collaboration opportunities: Encouragement or requirements for partnerships or collaborations.
13. Awarded projects: Examples of previous projects funded by the research fund.
14. Research impact: Any notable achievements or impact resulting from the funded projects.
15. Success indicators: Metrics used to measure the success or impact of past projects.
16. Geographic scope: Any restrictions or preferences for research based on location.
17. Sustainability or renewal options: Potential for the fund to continue or renew funding in subsequent years.
18. Application deadlines: Dates and frequency of proposal submissions.
19. Contact information: How to reach out to the fund for more information or support.

If some information is not specified leave it blank. By covering these key points, you should have a comprehensive summary of the research fund.

` + contentPrompt.replace(/\s+/g, ' ').trim();

    let summaryResult: string = "";
    try {
        console.log('\x1b[32m%s\x1b[0m', "\nOpening GPT connection");

        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: combinedPrompt }],
            model: "gpt-3.5-turbo-16k",
        });

        if (chatCompletion) {
            console.log('\x1b[32m%s\x1b[0m', "\nResponse received");
            summaryResult = chatCompletion.choices[0].message.content as string;
        }
    } catch (error: any) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
        }
    }
    console.log('\x1b[32m%s\x1b[0m', "\nReturning to caller");
    return res.send(summaryResult); // Sending response
};


export { params };