import dotenv from 'dotenv';
import puppeteer, { Browser } from 'puppeteer';
import { Request, Response } from 'express';

dotenv.config();



const scrapeContent = async (url: string, browser: Browser): Promise<string> => {
    
    if (!url) {
        return "No url provided!";
    }

    try {

        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('.addListStyling p');

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
        await page.close();

        return content.join(' ');

    } catch (error: any) {
        console.log("Error:", error.message);
        return "Error";
    }
};

export { scrapeContent };