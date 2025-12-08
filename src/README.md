Project: Simple Premiere-like Video Editor (React)

This README documents the purpose of each file and top-level folder inside the `src` directory so you can quickly find where features live.

**Project Structure (src)**

- `App.jsx` : The root React component that renders the application shell (if present). Typically bootstraps top-level layout and routes into `VideoEditor`.
- `main.jsx` : App entry point used by the bundler (Vite/webpack/etc.). It mounts the React app into the DOM.
- `index.css` / `App.css` : Global CSS files providing base styles and app-level styles. `App.css` contains styles tied to the top-level app shell.

- `VideoEditor.jsx` : The main editor component. Holds core state (tracks, selected clip, zoom level, current editing tool) and composes the editor UI: `Preview`, `Timeline`, left/right panels, and `Toolbar`. Also implements helper actions (split/razor, ripple-delete) and passes handlers down to timeline components.

- `Preview.jsx` (sometimes `preview.jsx`) : The video playback preview area. Receives `currentTime`, `isPlaying`, `duration`, `media`, and a `mediaRef` from `useVideoPlayer`. Displays the HTMLMediaElement or a placeholder preview.

- `Toolbar.jsx` : The bottom toolbar containing editing tools (Select, Razor, Hand, Text, Trim, Ripple Delete, etc.), undo/redo buttons and a small zoom display. The toolbar now accepts `activeTool` and `onChangeActiveTool` props so the active editing tool lives in `VideoEditor`.

- `hooks/useVideoPlayer.jsx` : A custom hook that abstracts a simple video player API. It exposes `currentTime`, `duration`, `isPlaying`, `play`, `pause`, `stop`, and `seek`. It optionally syncs to an HTMLMediaElement via a `mediaRef`.

- `icons/index.jsx` : Central SVG React icon components used throughout the UI (play, pause, razor, select, zoom, etc.). Exports named icon components and also a default export object.

- `styles/constants.jsx` : Centralized style objects used inline across the app. This keeps styles consistent and local to the component tree (used instead of separate CSS modules in this project).

- `assets/` : Static assets (images, thumbnails, sample media) used by the project. Use the `MediaBrowser` to import / preview these assets into the timeline.

- `Svgs/` : A folder for larger or raw SVG assets (if any) used by the UI. Not the same as `icons/index.jsx` which contains inline icon components.

- `panels/` : Left/right panel components and other UI panels.
  - `panels/MediaBrowser.jsx` : Media library / project panel that lists available media items and allows selection/import.
  - `panels/EffectsPanel.jsx` : A placeholder panel that lists available video/audio effects (UI only).
  - `panels/PropertiesPanel.jsx` : Shows properties for the currently selected clip (motion, opacity, audio level, speed/time remapping UI). Useful place to expose tool-specific options later.

- `Timeline/` : Timeline area and related components.
  - `Timeline/Timeline.jsx` : Top-level timeline component. Displays ruler, playhead, zoom controls and a list of `Track` components. Handles playhead dragging and clicking to seek.
  - `Timeline/Track.jsx` : Represents a track (video or audio). Renders track header (visibility/lock controls) and the track content area containing multiple `Clip` components.
  - `Timeline/Clip.jsx` : Visual clip element positioned according to `start`/`end`. Handles click interactions. This file was augmented to react to the active editing tool: clicking a clip will either select it (Select tool), split it at playhead (Razor), or perform a simplified ripple-delete (Ripple Delete).

Notes, behavior & limitations

- Editing tools implemented so far: Select (default UI selection), Razor (split clip at the current playhead time), Ripple Delete (remove clip and shift following clips left by removed duration). The toolbar contains buttons for additional tools (Trim, Slip/Slide, Rate-Stretch) but those are not fully implemented yet.

- The current `razor` split implementation splits at the playhead time (`useVideoPlayer`'s `currentTime`) when you click a clip while the Razor tool is active. This is a deliberate, minimal UX; we can extend to split at precise click position on the clip.

- `ripple-delete` currently only shifts clips on the same track. It does not ripple across all tracks (this can be added later).

- The project stores clip timing in `start`/`end` seconds and uses `duration` as the timeline's reference length.

- Styling is inline via `styles/constants.jsx`. If you want a CSS-based approach later we can extract these styles into CSS/SCSS modules.

How to run (typical)

- Install dependencies and start the dev server (example with npm):

```powershell
npm install
npm run dev
```

(If your project uses `yarn` or a different bundler, run the appropriate commands.)

Next steps you might ask me to do

- Expand README with architecture diagrams and example data.
- Implement Trim / Slip / Slide / Rate-Stretch tools and expose options in `PropertiesPanel.jsx`.
- Add Undo/Redo and non-destructive history for edits.
- Improve split UX to split at clip click position instead of playhead.

If you want, I can update the README to include file contents summaries or add a small diagram showing data flow between `VideoEditor -> Timeline -> Track -> Clip` and `useVideoPlayer`.
