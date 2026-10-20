---
name: browser-translation
description: Automates browser-based translation extraction and injection in editors like XTM Workbench.
---

# Browser Translation Skill

Use this skill when the user requests translation tasks in a browser-based translation editor (such as XTM Workbench).

## Agent Guidelines

When a user prompts you to translate a range of segments (e.g., *"Translate segments 300 to 450 to Vietnamese on the active tab"*), execute the following pipeline:

### 1. Extraction Phase
Run the project's extractor tool to collect the source content and segment structure:
```bash
node src/run-extract.js --start <START_ID> --end <END_ID> --output data/source_segments.json
```
- Verify the output JSON was created.
- The output contains the `sourceHTML` showing tag boundaries and `sourceText`.

### 2. Translation Phase
- Read `data/source_segments.json`.
- For each segment ID, generate the translated text.
- Save the translation key-value map (`id`: `translationText`) in a JSON file at `data/translations.json`.

### 3. Injection Phase
Run the project's injector tool to fill and save the translations back into XTM Workbench:
```bash
node src/run-inject.js --dict data/translations.json --metadata data/source_segments.json
```
- The injector handles target cell focus, formatting tags preservation, Space+Backspace dirty flags, and completing saves via `Alt + ;`.

### 4. Verification
Take screenshots of the first and last processed pages using Puppeteer or browser tools, verify the presence of completed checkmarks, and present them in the walkthrough report.
