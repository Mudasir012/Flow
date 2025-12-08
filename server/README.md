# Media Server

Simple Express server for handling media uploads for the video editor.

Run:

```bash
cd server
npm install
npm start
```

API:
- `GET /media` — list media items
- `POST /upload` — form field `file` (multipart), optional `duration`, `type` in body
- `GET /media/:id` — serve media file
- `DELETE /media/:id` — delete media and file
