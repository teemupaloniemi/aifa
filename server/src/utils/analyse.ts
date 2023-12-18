import { compareResearchDescriptions } from './suitability';  // Adjust the path based on your directory structure

export async function processBatch(items: any[], start: number, end: number, keywords: string): Promise<any[]> {
    const batch = items.slice(start, end);
    return await Promise.all(batch.map(async (item: any) => {
        const score = compareResearchDescriptions(keywords, item.scrapedContent);
        return {
            ...item,
            score
        };
    }));
}

export async function analyse(allItems: any[], keywords: string): Promise<any[]> {

    const updatedItems: any[] = [];

    // Define batch size
    const batchSize = 50;
    console.log("All items length:, ", allItems.length)
    for (let i = 0; i < allItems.length; i += batchSize) {
        console.log(`\nAnalyzing batch: ${i}-${Math.min(i + batchSize, allItems.length)}`)
        const endIndex = Math.min(i + batchSize, allItems.length);
        const batchResult = await processBatch(allItems, i, endIndex, keywords);
        updatedItems.push(...batchResult);
    }

    return updatedItems;
}
