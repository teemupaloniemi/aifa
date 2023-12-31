"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
function tokenize(transcription) {
    const start = "<|im_start|>";
    const end = "<|im_end|>";
    const system = start + "system\nYou are an assistant called helping with EU funding opportunities. Help answer my questions. Give a short answer, please. Try to answer strictly to the question and with given xml tag like symbols." + end;
    const user = start + "user\n" + transcription + end;
    const assistant = start + "assistant\n";
    const prompt = system + user + assistant;
    return prompt;
}
async function generate(prompt) {
    const url = 'http://localhost:8080/completion';
    try {
        let final_prompt = tokenize(prompt);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: final_prompt,
                n_predict: 256
            })
        });
        if (response.ok) {
            const data = await response.json();
            return data['content'];
        }
        else {
            console.error('Response error:', response.status);
            return null;
        }
    }
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}
exports.generate = generate;
