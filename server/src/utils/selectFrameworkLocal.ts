import axios from 'axios'; // We'll use axios to make HTTP requests
import dotenv from 'dotenv';

dotenv.config();

interface Framework {
    id: string;
    name: string;
    keywords?: string;
}

export async function selectFramework(researchIdea: string, frameworks: Framework[]): Promise<string[]> {
    console.log("\nSelecting frameworks...");

    // Convert frameworks to condensed id-name pairs
    const condensedFrameworks = frameworks.map(f => `${f.id}:${f.name}`).join(',');

    // Use axios to send a POST request to our LLM API endpoint
    const response = await axios.post('http://localhost:8000/query', {
        prompt: `For idea ${researchIdea}, which European Commission funds from [${condensedFrameworks}] are best suitable? Reply with tags like this <ids>suitable ids here</ids>. Best fitting fund ids are: <ids>`
    });

    const result = response.data.response.replace(`For idea ${researchIdea}, which European Commission funds from [${condensedFrameworks}] are best suitable? Reply with tags like this <ids>suitable ids here</ids>. Best fitting fund ids are:`, "");

    console.log("\n\x1B[34m", result, "\x1B[0m\n");

    // Parse the response
    const matches = [...result.matchAll(/<ids>(.*?)<\/ids>/g)];

    const match  = matches.map(match => match[1]).join(', ');  
    
    const selectedIds = match ? match.split(',').map((id: string) => id.replace(/[^0-9]/g, '').trim()) : ["43108390"];

    console.log("Frameworks selected:");
    for (const id of selectedIds) {
        const framework = frameworks.find(f => f.id === id);
        if (framework) {
            console.log(`ID: ${framework.id}, Name: ${framework.name}`);
        }
    }

    return selectedIds;
}