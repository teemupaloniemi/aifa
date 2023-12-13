# Research Project: LLMs for Assessing R&D Funding Instruments

## Overview

This repository houses the codebase and resources for a research project exploring the use of Large Language Models (LLMs) in evaluating Research and Development (R&D) funding instruments. The goal is to investigate whether LLMs can effectively recommend suitable funding instruments based on user-specific needs.

## Key Components

### Front End (fundai)

- Navigate to the `./aifa/fundai` folder.
- Run `npm install` to install dependencies.
- Execute `npm start` to launch the front-end server on port 3000.

### Back End (server)

- Navigate to the `./aifa/server` folder.
- Run `npm install` to install dependencies.
- Execute `npm start` to launch the back-end server on port 5000.

### Database 

- Set up a PostgreSQL database with tables named `detaileddata` and `metadata`.
```
CREATE TABLE metadata (
    id integer NOT NULL,
    identifier text,
    caname text,
    es_contenttype text,
    keywords text,
    programmeperiod text,
    esda_ingestdate text,
    type text,
    title text,
    esst_url text,
    esda_queuedate text,
    esst_filename text,
    callidentifier text,
    frameworkprogramme text,
    startdate text,
    deadlinedate text);
 
CREATE TABLE detaileddata (
    id integer NOT NULL,
    metadata_id character varying(255),
    scrapedcontent text,
    title text,
    language text,
    content text,
    score integer);
```
- Fill database by running `node savedata.js` in the `./aifa/server/src` folder. (or by using the old dump file **not recommended!**) 

### Local LLM Server

- Clone the llama.cpp library from [llama.cpp GitHub](https://github.com/ggerganov/llama.cpp) into `./aifa/llm`.
- Download a GGUF model for your purpose.
- Follow the llama.cpp repository guide to build the library.
- Start the llm server with `./server -m models/YOUR_MODEL -ngl 35` on port 8080.

### Usage

1. Input your research idea on the front-end interface.
2. The back end processes the input and communicates with the local LLM server.
3. The LLM server analyzes, translates, and extracts keywords.
4. Recommendations are generated based on the analyzed data.
5. Receive personalized funding instrument recommendations.

## How to Run

### Front End

1. Navigate to `./aifa/fundai`.
2. Run `npm install`.

### Back End

1. Navigate to `./aifa/server`.
2. Run `npm install`.
3. Start the back-end server with `npm start` on port 5000.

### Local LLM Server

1. Set up a PostgreSQL database with tables `detaileddata` and `metadata`.
2. Clone llama.cpp into `./aifa/llm`.
3. Download a suitable GGUF model.
4. Build llama.cpp following the repository guide.
5. Start the llm server with `./server -m models/YOUR_MODEL -ngl 35` on port 8080.

### Build and Start

1. In `./aifa/fundai`, run `npm run build`.
2. In `./aifa/llm`, run `npm run build`.
3. In `./aifa/server`, run `npm run build`.

4. Start the front-end server: `npm start` in `./aifa/fundai`.
5. Start the back-end server: `npm start` in `./aifa/server`.
6. Start the local LLM server: `./server -m models/YOUR_MODEL -ngl 35` in `./aifa/llm`.

After these steps, the front end is running on port 3000, the back end is running on port 5000, and the local LLM server is running on port 8080. The system is ready for user input and recommendation generation.

## Contribution

For contributions, please contact the email specified in `LICENSE.md`.

## License

This project is licensed under the MIT License. See `LICENSE.md` for details.

## Acknowledgements

Thanks to all contributors and participants in this research project for their invaluable insights and efforts in advancing R&D funding instrument assessment.
