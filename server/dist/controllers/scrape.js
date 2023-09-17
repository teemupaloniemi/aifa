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
        // Fetch only the paragraphs inside the scrapedContent
        const content = await page.$$eval('.addListStyling', elements => {
            return elements.map(el => {
                var _a, _b;
                // Extract the label from the ux-panel attribute
                const label = ((_a = el.closest('ux-panel')) === null || _a === void 0 ? void 0 : _a.getAttribute('label')) || 'Unknown';
                const spanText = ((_b = el.querySelector('.topicdescriptionkind')) === null || _b === void 0 ? void 0 : _b.textContent) || '';
                let combinedText = `${label} - ${spanText}:\n\n`;
                // Process child nodes in order
                el.childNodes.forEach(node => {
                    if (node instanceof Element) {
                        if (node.nodeName === 'P') {
                            combinedText += node.textContent + '\n\n';
                        }
                        else if (node.nodeName === 'UL') {
                            combinedText += Array.from(node.querySelectorAll('li')).map(li => { var _a; return `• ${(_a = li.textContent) === null || _a === void 0 ? void 0 : _a.trim()}`; }).join('\n') + '\n\n';
                        }
                        else if (node.nodeName === 'TABLE') {
                            const headerRows = Array.from(node.querySelectorAll('thead tr')).map(row => {
                                return Array.from(row.querySelectorAll('td, th')).map(cell => {
                                    var _a;
                                    const pTexts = Array.from(cell.querySelectorAll('p')).map(p => { var _a; return (_a = p.textContent) === null || _a === void 0 ? void 0 : _a.trim(); });
                                    return pTexts.length > 0 ? pTexts.join(' ') : (_a = cell.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                                }).join(' - ');
                            }).join('\n');
                            const bodyRows = Array.from(node.querySelectorAll('tbody tr')).map(row => {
                                return Array.from(row.querySelectorAll('td, th')).map(cell => {
                                    var _a;
                                    const pTexts = Array.from(cell.querySelectorAll('p')).map(p => { var _a; return (_a = p.textContent) === null || _a === void 0 ? void 0 : _a.trim(); });
                                    return pTexts.length > 0 ? pTexts.join(' ') : (_a = cell.textContent) === null || _a === void 0 ? void 0 : _a.trim();
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
    }
    catch (error) {
        console.log("Error:", error.message);
        return "Error";
    }
};
exports.scrapeContent = scrapeContent;
