from flask import Flask, request, jsonify
import subprocess
from termcolor import colored

app = Flask(__name__)

def generate(prompt):
    cmd = ['./main', '-c', '2048', '-m', 'models/llama-2-7b-chat.Q4_K_M.gguf', '-p', f'"{prompt}"', '-e']

    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)

    # Skip the first line (prompt echo)
    next(process.stdout)

    lines = [colored(line, 'cyan') for line in process.stdout]
    lines.append(colored('-' * 50, 'green'))

    return ''.join(lines)

@app.route('/query', methods=['POST'])
def query_model():
    data = request.json
    prompt = data.get('researchIdea', '')
    print(prompt)
    result = generate(prompt)

    return jsonify({"response": result})

if __name__ == '__main__':
    app.run(debug=True, port=8000)

