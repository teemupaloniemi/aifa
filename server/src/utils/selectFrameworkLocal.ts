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
    const ip = process.env.LLM_IP;
    // Use axios to send a POST request to our LLM API endpoint
    const response = await axios.post(`http://${ip}/query`, {
        prompt: `For the following idea <idea>${researchIdea}</idea>, which European Commission funds from <frameworks>${condensedFrameworks}</frameworks> are propably best suitable? Reply with tags like this <ids>suitable ids here</ids>. Best fitting fund ids are: <ids> `
    }, {
        timeout: 300000 // 5 minutes timeout
    });

    const result = response.data.response.replace(`For the following idea <idea>${researchIdea}</idea>, which European Commission funds from <frameworks>${condensedFrameworks}</frameworks> are propably best suitable? Reply with tags like this <ids>suitable ids here</ids>. Best fitting fund ids are:`, "");

    console.log("\n\x1B[34m", result, "\x1B[0m\n");

    // Parse the response
    const matches = [...result.matchAll(/<ids>(.*?)<\/ids>/g)];

    const match  = matches.map(match => match[1]).join(', ');  
    
    const selectedIds = match 
    ? match.split(',')
           .map((id: string) => id.replace(/[^0-9]/g, '').trim())
           .flatMap((id: string) => {
               let specialIdMatch = id.match(/111111/);
               let otherIds = id.replace(/111111/g, '').match(/\d{1,8}/g) || [];

               if (specialIdMatch) {
                   return [specialIdMatch[0], ...otherIds];
               } else {
                   return otherIds;
               }
           })
    : ["43108390"];

    console.log("Frameworks selected:\n");
    for (const id of selectedIds) {
        const framework = frameworks.find(f => f.id === id);
        if (framework) {
            console.log("\u001b[35m" + `ID: ${framework.id}, Name: ${framework.name}` + "\x1B[0m");
        }
    }
    

    return selectedIds;
}
