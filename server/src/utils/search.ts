import axios from 'axios';
import FormData from 'form-data';
import puppeteer, { Browser } from 'puppeteer';

export async function searchFromFrameworks(fitting_frameworks: string[] = ["43108390"]): Promise<any[]> {
    const allItems: any[] = [];

    // Loop through each framework in fitting_frameworks
    for (const framework of fitting_frameworks) {
        await new Promise(resolve => setTimeout(resolve, 5000));  // Delay for 5 seconds
        const formData = new FormData();
        formData.append('query', Buffer.from(JSON.stringify({
            "bool": {
                "must": [
                    { "terms": { "type": ["1", "2", "8"] } },
                    { "terms": { "status": ["31094501", "31094502"] } }, // "31094501" forthcoming, "31094502" open, "31094503" closed
                    { "term": { "programmePeriod": "2021 - 2027" } },
                    { "terms": { "frameworkProgramme": [framework.trim()] } }  // Set the frameworkProgramme field
                ]
            }
        }), 'utf-8'), { contentType: 'application/json' });

        formData.append('languages', Buffer.from(JSON.stringify(["en"]), 'utf-8'), { contentType: 'application/json' });
        formData.append('sort', Buffer.from(JSON.stringify({ "field": "sortStatus", "order": "DESC" }), 'utf-8'), { contentType: 'application/json' });

        console.log('\nsearchTenders: Sending request to API:', framework.trim());

        const response = await axios.post(
            'https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=SEDIA&text=*&pageSize=500&pageNumber=1',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 300000
            }
        );
        const items = response.data.results;
        console.log("Results found from this framework:", items.length);
        allItems.push(...items);  // Combine the results with the allItems list
    }

    return allItems;
}
