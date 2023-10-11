"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const app = (0, express_1.default)();
const port = 8000;
// Middleware to parse JSON requests
app.use(express_1.default.json());
function generate(prompt) {
    return new Promise((resolve, reject) => {
        if (!prompt) {
            reject("Invalid prompt provided.");
            return;
        }
        const cmd = ['./llama.cpp/main', '-c', '8192', '-m', './llama.cpp/models/llama-2-7b-32k-instruct.Q8_0.gguf', '-p', `"${prompt}"`, '-n', '400', '-e'];
        const mainCommand = cmd.shift();
        console.log("\n\nRunning command:", cmd.join(" "));
        console.log("\n\n\n");
        if (!mainCommand) {
            reject("Main command not found.");
            return;
        }
        const process = (0, child_process_1.spawn)(mainCommand, cmd);
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
            //  if (code !== 0) {
            //    console.error(`Process exited with code: ${code}`);
            //console.error("Stderr output:", stderrData);
            // reject(`Process exited with code: ${code}. Stderr: ${stderrData}`);
            //  return;
            //}
            //if (stderrData) {
            //    console.warn("Stderr output (non-fatal):", stderrData);
            //}
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
    }
    catch (error) {
        console.error("Error during query processing:", error);
        res.status(500).send(`Error: ${error}`);
    }
});
app.listen(port, () => {
    console.log(`API server started at http://localhost:${port}`);
});
