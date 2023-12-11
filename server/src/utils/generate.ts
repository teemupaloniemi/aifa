function tokenize(transcription: string): string {
        const system = "system\nYou are an assistant called helping with EU funding opportunities. Help answer my questions. Give a short answer, please. Try to answer strictly to the question and with given xml tag like symbols.";
        const user = "user\n" + transcription;
        const assistant = "assistant\n";
        const prompt = system + user + assistant;
        return prompt;
}



async function generate(prompt: string): Promise<any> {
    const url = 'http://localhost:8080/completion'; 

    try {
        let final_prompt = tokenize(prompt);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                n_predict: 256
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data['content'];
        } else {
            console.error('Response error:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export { generate };
