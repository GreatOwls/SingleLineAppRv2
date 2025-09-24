<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10v7XSrDwus6guIEzHrSgZcRlTcdn6o5T

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Start the JSON backend (new terminal):
   `npm run server`
4. Run the Vite dev server:
   `npm run dev`

## Autosave & Persistence

- A lightweight Node.js backend (`npm run server`) stores data in `server/data/diagram.json` for manual saves and autosave.
- Autosave runs ~1s after changes while in edit mode; status appears in the header.
- Manual Save forces an immediate write to the backend, while Load uploads a JSON file and persists it.
