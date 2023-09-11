import dotenv from 'dotenv';
import puppeteer, { Browser } from 'puppeteer';
import { Request, Response } from 'express';
import { scrapeContent } from './scrape';

const params = async (req: Request, res: Response) => {
    const url = req.body.url || req.query.url;

    if (!url) {
        return res.status(400).send("No url provided!");
    }

    // Initialize the browser outside the loop
    const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(),
        headless: "new",  // Use the new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const contentPrompt = await scrapeContent(url, browser);
        await browser.close();
        return res.send(contentPrompt);
    } catch (error: any) {
        console.log("Error:", error.message);
        return res.status(500).send("Error occurred");
    }
};

export { params };