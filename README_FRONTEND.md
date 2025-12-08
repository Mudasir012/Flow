# Video Editor (Frontend + Backend)

This workspace contains a simple React-based video editor UI and a minimal Express backend for local media uploads.

Run backend:

```powershell
cd server
npm install
npm start
```

Run frontend (project root - follow your usual dev command, e.g. Vite/CRA):

```powershell
npm install
npm run dev
```

Notes:
- Backend runs by default at `http://localhost:4000` and exposes `/media` and `/upload` endpoints.
- The frontend will attempt to fetch `http://localhost:4000/media` on load and upload files to `/upload` when importing media.

Next steps you can ask for:
- Syncing real playback between the HTML5 media element and the timeline playhead.
- Material Design aesthetic refresh across the UI.
- Cleaning up server object URLs and adding thumbnails.
