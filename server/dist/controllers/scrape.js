"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeContent = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const scrapeContent = async (url, browser) => {
    if (!url) {
        return "No url provided!";
    }
    try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120000);
        await page.goto(url);
        await page.waitForSelector('.addListStyling p', { timeout: 120000 });
        //console.log("Fetching paragraphs...");
        // Fetch only the paragraphs inside the scrapedContent
        const content = await page.$$eval('.addListStyling', elements => {
            return elements.map(el => {
                var _a;
                const spanText = ((_a = el.querySelector('.topicdescriptionkind')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
                // Extract paragraphs
                const pTexts = Array.from(el.querySelectorAll('p')).map(p => p.textContent).join('\n');
                // Extract lists and convert them to coherent strings
                const listTexts = Array.from(el.querySelectorAll('ul')).map(ul => {
                    return Array.from(ul.querySelectorAll('li')).map(li => {
                        var _a;
                        return `• ${(_a = li.textContent) === null || _a === void 0 ? void 0 : _a.trim()}`;
                    }).join('\n');
                }).join('\n\n'); // Separate lists with two newlines
                // Extract tables and convert them to coherent strings
                const tableTexts = Array.from(el.querySelectorAll('table')).map(table => {
                    const headerRows = Array.from(table.querySelectorAll('thead tr')).map(row => {
                        const cells = Array.from(row.querySelectorAll('td, th')).map(cell => {
                            var _a;
                            // Extract text from <p> elements inside the cell, if they exist
                            const pTexts = Array.from(cell.querySelectorAll('p')).map(p => { var _a; return (_a = p.textContent) === null || _a === void 0 ? void 0 : _a.trim(); });
                            // If there are <p> elements, join their texts, otherwise use the cell's text content
                            return pTexts.length > 0 ? pTexts.join(' ') : (_a = cell.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                        }).join(' - ');
                        return cells;
                    }).join('\n');
                    const bodyRows = Array.from(table.querySelectorAll('tbody tr')).map(row => {
                        const cells = Array.from(row.querySelectorAll('td, th')).map(cell => {
                            var _a;
                            // Extract text from <p> elements inside the cell, if they exist
                            const pTexts = Array.from(cell.querySelectorAll('p')).map(p => { var _a; return (_a = p.textContent) === null || _a === void 0 ? void 0 : _a.trim(); });
                            // If there are <p> elements, join their texts, otherwise use the cell's text content
                            return pTexts.length > 0 ? pTexts.join(' ') : (_a = cell.textContent) === null || _a === void 0 ? void 0 : _a.trim();
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
    }
    catch (error) {
        console.log("Error:", error.message);
        return "Error";
    }
};
exports.scrapeContent = scrapeContent;
