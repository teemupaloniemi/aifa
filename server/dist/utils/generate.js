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
function tokenizef(transcription) {
    const user = "\nUser: " + "You are an assistant called helping with EU funding opportunities. Help answer my questions. Give a short answer, please. Try to answer strictly to the question and with given xml tag like symbols. This is my context: " + transcription;
    const assistant = "\nAssistant: Based on your information this is my best answer: ";
    const prompt = user + assistant;
    return prompt;
}
async function generate(prompt, useFalcon) {
    let url = 'http://localhost:8080/completion';
    if (useFalcon) {
        url = 'http://147.189.194.185/completion';
    }
    console.log("Using local model at: ", url);
    try {
        let final_prompt = "";
        if (useFalcon) {
            final_prompt = tokenizef(prompt);
        }
        else {
            final_prompt = tokenize(prompt);
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: final_prompt,
                n_predict: 128
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
