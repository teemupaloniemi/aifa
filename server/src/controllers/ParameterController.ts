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

        console.log(`Navigating to URL: ${url}`);
        await page.goto(url);

        console.log("Waiting for the main content to load...");
        await page.waitForSelector('.addListStyling p')

        console.log("Fetching paragraphs...");
        // Fetch only the paragraphs inside the scrapedContent
        const content = await page.$$eval('.addListStyling', elements => {
            return elements.map(el => {
                const spanText = el.querySelector('.topicdescriptionkind')?.textContent || '';
                
                // Extract paragraphs
                const pTexts = Array.from(el.querySelectorAll('p')).map(p => p.textContent).join('\n');
                
                // Extract lists and convert them to coherent strings
                const listTexts = Array.from(el.querySelectorAll('ul')).map(ul => {
                    return Array.from(ul.querySelectorAll('li')).map(li => {
                        return `• ${li.textContent?.trim()}`;
                    }).join('\n');
                }).join('\n\n'); // Separate lists with two newlines
                
                // Extract tables and convert them to coherent strings
                const tableTexts = Array.from(el.querySelectorAll('table')).map(table => {
                    const headerRows = Array.from(table.querySelectorAll('thead tr')).map(row => {
                        const cells = Array.from(row.querySelectorAll('td, th')).map(cell => {
                            // Extract text from <p> elements inside the cell, if they exist
                            const pTexts = Array.from(cell.querySelectorAll('p')).map(p => p.textContent?.trim());
                            // If there are <p> elements, join their texts, otherwise use the cell's text content
                            return pTexts.length > 0 ? pTexts.join(' ') : cell.textContent?.trim();
                        }).join(' - ');
                        return cells;
                    }).join('\n');
                    
                    const bodyRows = Array.from(table.querySelectorAll('tbody tr')).map(row => {
                        const cells = Array.from(row.querySelectorAll('td, th')).map(cell => {
                            // Extract text from <p> elements inside the cell, if they exist
                            const pTexts = Array.from(cell.querySelectorAll('p')).map(p => p.textContent?.trim());
                            // If there are <p> elements, join their texts, otherwise use the cell's text content
                            return pTexts.length > 0 ? pTexts.join(' ') : cell.textContent?.trim();
                        }).join(' - ');
                        return cells;
                    }).join('\n');
                    
                    return `${headerRows}\n${bodyRows}`;
                }).join('\n\n'); // Separate tables with two newlines
                
                // Combine title, paragraph texts, list texts, and table texts
                const combinedText = `${spanText}:\n${pTexts}\n${listTexts}\n${tableTexts}`;
                return combinedText;
            });
        });


        console.log("Closing the browser...");
        await browser.close();

        let textContent = content.join(' ');

        const lines = textContent.split('\n'); // Split the content by lines
        const filteredLines = lines.filter(line => !line.startsWith('@')); // Filter out lines with '@'
        textContent = filteredLines.join('\n'); // Join the filtered lines back into a single string
        contentPrompt = textContent;
        console.log(`Combined content length: ${textContent.length}`);

    } catch (error: any) {
        console.log("Error:", error.message);
        return res.status(500).send("Error occurred"); // Sending response
    }

    console.log(`Snippet of content: ${contentPrompt}`); // Displaying the first 100 characters as a snippet

    console.log('\x1b[32m%s\x1b[0m', "\nReturning to caller");

    return res.send(contentPrompt);
};


export { params };