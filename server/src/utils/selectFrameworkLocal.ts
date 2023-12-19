import { generate } from './generate'

interface Framework {
    id: string;
    name: string;
    keywords?: string;
}

export async function selectFramework(researchIdea: string, frameworks: Framework[], useFalcon: boolean): Promise<string[]> {
    console.log("\nSelecting frameworks...");

    // Convert frameworks to condensed id-name pairs
    const condensedFrameworks = frameworks.map(f => `${f.id}:${f.name}: keywords${f.keywords}`).join(',\n');
    let prompt = `For the following idea \n<idea>${researchIdea}</idea>\n, which European Commission funds (IDs) from <frameworks>${condensedFrameworks}</frameworks> are propably best suitable? Reply with tags like this <ids>suitable IDs here like 12345</ids>. Best fitting fund ids are: <ids> `

    let result = await generate(prompt, useFalcon);
    result = "<ids>" + result.replace("<ids>", "") // make sure the start tag is there
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
