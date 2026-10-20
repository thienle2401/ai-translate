# AI Translate

A structured, generic, and modular browser-based automation and translation injection library using Puppeteer-core. Designed to run translation jobs directly on an active browser page.

## Prerequisites

1. **Google Chrome running with Remote Debugging enabled**:
   To allow this tool (and your AI coding agent) to connect to your active browser session:
   - Close all Google Chrome windows completely.
   - Start Google Chrome from your terminal with remote debugging enabled on port `9222`:
     ```bash
     /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
     ```
2. **Target Web Application (e.g. XTM Workbench)**:
   Ensure the translation editor tab is loaded and active in the debugging Chrome browser window.

---

## Agent Usage (The Automated Workflow)

When paired with a pairing AI assistant (like Antigravity), you do **not** need to run individual extraction, translation, or injection scripts. Instead, issue a single, high-level prompt, and the agent will orchestrate the entire process automatically.

### Example Agent Prompt:
> **User**: *"Translate segments 300 to 450 to Vietnamese on the active tab."*

### Autocomplete Pipeline:
1. **Extract**: The agent automatically executes the extractor tool to pull the source text/tags for segments 300 to 450.
2. **Translate**: The agent reads the extracted text, translates the content in its context window, and saves the translations block.
3. **Inject**: The agent runs the injector tool to write the translations back, safely preserving tags and completing each segment in the grid.

---

## Developer / Manual Usage (CLI Tools)

If you prefer to run the tools manually, follow these CLI steps:

### 1. Installation
Clone the repository, navigate into the directory, and install dependencies:
```bash
npm install
```

### 2. Extract Segments
Extract English source text segments from the workbench view:
```bash
node src/run-extract.js --start 300 --end 450 --output data/source_segments.json
```

### 3. Translate (Mock / Manual Edit)
Create your translation mapping file at `data/translations.json` containing pairs of `"id": "translation"`:
```json
{
  "300": "Tuổi được đánh giá...",
  "301": "10..."
}
```

### 4. Inject Translations
Inject and save the translations back to XTM Workbench:
```bash
node src/run-inject.js --dict data/translations.json --metadata data/source_segments.json
```

---

## Project Structure

```
├── .agents/
│   └── skills/
│       └── browser-translation/
│           └── SKILL.md             # AI Agent Instructions for automation
├── src/
│   ├── utils/
│   │   └── browser.js               # Puppeteer page connections and keyboard utils
│   ├── xtm/
│   │   ├── extractor.js             # Segment scraper
│   │   └── injector.js              # Segment writer and hotkey saver
│   ├── run-extract.js               # CLI Entrypoint for extraction
│   └── run-inject.js                # CLI Entrypoint for injection
├── package.json
└── README.md
```
