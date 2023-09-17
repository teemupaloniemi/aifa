import dotenv from 'dotenv';
import { Browser } from 'puppeteer';


dotenv.config();

const scrapeContent = async (url: string, browser: Browser): Promise<string> => {
    
    if (!url) {
        return "No url provided!";
    }

    try {

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120000);
        await page.goto(url);
        await page.waitForSelector('.addListStyling p', {timeout: 120000});

        // Fetch only the paragraphs inside the scrapedContent
        const content = await page.$$eval('.addListStyling', elements => {
            return elements.map(el => {
                // Extract the label from the ux-panel attribute
                const label = el.closest('ux-panel')?.getAttribute('label') || 'Unknown';
                const spanText = el.querySelector('.topicdescriptionkind')?.textContent || '';

                let combinedText = `${label} - ${spanText}:\n\n`;

                // Process child nodes in order
                el.childNodes.forEach(node => {
                    if (node instanceof Element) {
                        if (node.nodeName === 'P') {
                            combinedText += node.textContent + '\n\n';
                        } else if (node.nodeName === 'UL') {
                            combinedText += Array.from(node.querySelectorAll('li')).map(li => `• ${li.textContent?.trim()}`).join('\n') + '\n\n';
                        } else if (node.nodeName === 'TABLE') {
                            const headerRows = Array.from(node.querySelectorAll('thead tr')).map(row => {
                                return Array.from(row.querySelectorAll('td, th')).map(cell => {
                                    const pTexts = Array.from(cell.querySelectorAll('p')).map(p => p.textContent?.trim());
                                    return pTexts.length > 0 ? pTexts.join(' ') : cell.textContent?.trim();
                                }).join(' - ');
                            }).join('\n');
                            const bodyRows = Array.from(node.querySelectorAll('tbody tr')).map(row => {
                                return Array.from(row.querySelectorAll('td, th')).map(cell => {
                                    const pTexts = Array.from(cell.querySelectorAll('p')).map(p => p.textContent?.trim());
                                    return pTexts.length > 0 ? pTexts.join(' ') : cell.textContent?.trim();
                                }).join(' - ');
                            }).join('\n');
                            combinedText += `${headerRows}\n${bodyRows}\n\n`;
                        }
                    }
                });

                return combinedText.trim();
            });
        });

        console.log("Closing the browser...");
        await page.close();

        return content.join("\n\n");

    } catch (error: any) {
        console.log("Error:", error.message);
        return "Error";
    }
};

export { scrapeContent };
