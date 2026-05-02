# Playwright Learning App - Quick Start Guide

This project contains a learning application built to provide interactive tutorials and exercises for the Playwright automation framework. 

## How to Run the App

### Recommended (Windows)
1. **Right-click** `Start-Lab.ps1` and select **"Run with PowerShell"**.
2. This will automatically start the server on port 8080 and open the browser for you.

### Manual
1. **Open a terminal** in the project root.
2. **Run**:
   ```bash
   npx serve . -l 8080
   ```
3. **Access**: `http://localhost:8080/App/index.html`

## ⚠️ CRITICAL WARNING: DO NOT RUN BUILD.JS
The file `build.js` is for an **old, static version** of the documentation. 
**DO NOT RUN `node build.js`**.
Running it will **OVERWRITE** the Interactive Learning Lab's modern code (Monaco Editor, Quizzes, Flashcards) with a simple text-only version. If you accidentally run it, use `git restore App/` to fix the damage.

## Workflow for Updating Content

If you need to update the documentation content:
1. Edit or add new markdown files (`.md`) inside the `Lerning` directory.
2. Run `node build.js` in the root folder to regenerate the HTML, CSS, and JS files in the `App` directory.
3. Refresh your browser to see the changes.
