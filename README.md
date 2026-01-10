# Flow 🎬

**Flow** is a full-stack web platform for video sharing and editing. It combines a social feed with a multi-track video editor, focusing on performance and a premium user experience.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Install & Run (Development)](#install--run-development)
- [Available Scripts](#available-scripts)
- [Uploads & Media](#uploads--media)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

---

## Demo

Include screenshots or a demo link here (optional).

> Tip: Add GitHub Pages, Netlify, or Vercel links if you host a demo build.

---

## Features ✅

- Social feed with posts, comments, and likes
- Multi-track video editor (timeline, layers, transitions)
- Authentication (JWT + OAuth integrations)
- File uploads and thumbnail generation
- Responsive UI built with React & Vite

---

## Tech Stack 🔧

- Frontend: **React** + **Vite**, (components in `frontend/src/components/`)
- Backend: **Node.js** + **Express** (`backend/server.js`) and an additional server entry in `server/index.js`
- Storage: local `backend/uploads/` (images, profiles, thumbnails, videos)
- Linting: **ESLint** (frontend config present)

---

## Project Structure 📁

Root layout (top-level folders):

```
/ (repo root)
├─ backend/            # Express server, uploads, env config
├─ frontend/           # React + Vite app
├─ server/             # alternative server entry (production)
├─ QUICKSTART.md
├─ README.md
└─ test_register.json
```

Important backend folders/files:
- `backend/server.js` — main backend server file
- `backend/uploads/` — stores uploaded media

Frontend highlights:
- `frontend/src/` — React app source
- `frontend/src/pages/` — pages like `Signup.jsx`, `VideoEditor.jsx`
- `frontend/src/components/` — UI components

---

## Getting Started 🚀

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Optional: Cloudinary account (recommended for production media hosting)

### Environment Variables

Create a `.env` in `backend/` with:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

> Note: If you don't use Cloudinary, the project will default to local uploads in `backend/uploads/`.

### Install & Run (Development)

```bash
# From repo root
npm install

# Start backend
cd backend
npm install
npm run dev    # typically nodemon or node server.js

# Start frontend (in another terminal)
cd ../frontend
npm install
npm run dev    # Vite dev server
```

Open the frontend (usually `http://localhost:5173`) and backend API (`http://localhost:5000`) as configured.

---

## Available Scripts 📜

Common scripts (check each package.json for exact names):

- Root: `npm install`
- `backend`:
  - `npm run dev` — start dev server (nodemon)
  - `npm start` — start production server
- `frontend`:
  - `npm run dev` — start Vite dev server
  - `npm run build` — build for production
  - `npm run lint` — run ESLint

---

## Uploads & Media 📦

Uploaded files are stored under `backend/uploads/` with subfolders:
- `images/`, `profiles/`, `thumbnails/`, `videos/`

In production, consider configuring Cloudinary or another media CDN and updating the Cloudinary env vars.

---

## Contributing 🤝

Contributions are welcome! Please follow these guidelines:

1. Fork the repo and create a feature branch: `feature/your-feature`
2. Keep changes focused and small; include tests if possible
3. Follow existing code style (ESLint in frontend)
4. Open a Pull Request describing the change and link any related issues

Add a `CONTRIBUTING.md` for more detailed workflows if needed.

---

## Troubleshooting ⚠️

- Backend fails to connect to MongoDB: verify `MONGODB_URI` and that your DB is reachable.
- File uploads fail: ensure `backend/uploads/` is writable and your storage solution (local or Cloudinary) is configured.
- Frontend build issues: run `npm run lint` and fix reported issues.


---

## Contact ✉️

If you'd like help maintaining or improving this README further, tell me which sections you want expanded (setup, deployment, CI, or sample envs) and I’ll update it.

