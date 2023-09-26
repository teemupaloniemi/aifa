import express from 'express';
import { spawn } from 'child_process';
import { text } from 'body-parser';

const app = express();
const port = 8000;

// Middleware to parse JSON requests
app.use(express.json());

function generate(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!prompt) {
            reject("Invalid prompt provided.");
            return;
        }

        const cmd = ['./llama.cpp/main', '-c', '2048', '-m', './llama.cpp/models/llama-2-7b-chat.Q4_K_M.gguf', '-p', `${prompt}`, '-e'];
        const mainCommand = cmd.shift();
        
        console.log("Running command:", mainCommand + " " + cmd);

        if (!mainCommand) {
            reject("Main command not found.");
            return;
        }
        
        const process = spawn(mainCommand, cmd);
        
        let result = '';
        let stderrData = '';

        process.stdout.on('data', (data) => {
            result += data;
        });

        process.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        process.on('error', (error) => {
            reject(error.message);
        });

        process.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Process exited with code: ${code}`);
                //console.error("Stderr output:", stderrData);
                reject(`Process exited with code: ${code}. Stderr: ${stderrData}`);
                return;
            }

            if (stderrData) {
                console.warn("Stderr output (non-fatal):", stderrData);
            }

            console.log("Process completed. Final result:", result);
            resolve(result);
        });
    });
}

app.post('/query', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        console.log("\n\n\n\n\n\n\nReceived prompt:", prompt);
        
        const response = await generate(prompt);
        console.log("Generated response:", response);
        
        res.json({ response });
    } catch (error) {
        console.error("Error during query processing:", error);
        res.status(500).send(`Error: ${error}`);
    }
});

app.listen(port, () => {
    console.log(`API server started at http://localhost:${port}`);
});
