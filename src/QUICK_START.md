# Quick Start Guide - Premiere Pro Video Editor

## Getting Started

### 1. Launch the Application
```bash
npm run dev
```
The editor will open at `http://localhost:5173`

### 2. Import Media
- Click **PROJECT** tab in left panel
- Click "Add Media" or drag video/audio file
- Your media appears in the list
- Click to import into timeline

### 3. Basic Editing

#### Play/Pause
- Click the **Play/Pause button** in toolbar (blue button)
- Or use **Stop** to jump to start

#### Split Clips (Razor Tool)
- Position playhead at desired point
- Click **Razor icon** in toolbar
- Clip splits at current time

#### Delete Clips
- Select clip in timeline
- Click **Delete icon** in toolbar

### 4. Working with Effects

#### Apply an Effect
1. **Select a clip** in the timeline (it highlights)
2. Go to **EFFECTS** tab in left panel
3. **Click any effect** to apply:
   - Gaussian Blur
   - Lumetri Color
   - Drop Shadow
   - Sepia
   - Grayscale
   - And 6 more!

#### Adjust Effect Parameters
1. Select the effect layer in **Layers panel** (right side)
2. Use the **sliders** to adjust parameters
3. Changes apply **instantly** to preview

#### Remove Effect
1. Select effect in Layers panel
2. Click **✕ button** or use toolbar **🗑 icon**

### 5. Text Overlays

#### Add Text
1. Click **Text tool** in toolbar (📝 icon)
2. **Click in preview** to add text
3. Text layer appears in Layers panel

#### Edit Text
1. Select text layer
2. Modify text, font size, color in Properties panel
3. **Drag text** in preview to reposition

### 6. Layer Management

#### View All Layers
- Look at **Layers panel** on the right
- Shows: Video, Audio, Text, Effects, Transitions

#### Change Z-Order (Stacking)
- Select layer
- Click **↑ arrow** to bring forward
- Click **↓ arrow** to send backward

#### Delete Any Layer
- Select in Layers panel
- Click **✕ button**

### 7. Transitions (Future Feature)
Transitions will appear as a separate category in Effects panel once implemented.

## Toolbar Buttons

| Button | Function | When Available |
|--------|----------|----------------|
| Select | Choose tool mode | Always |
| Razor | Split clips | Always |
| 📝 Text | Add text layer | Always |
| ▶/⏸ | Play/Pause video | Always |
| ⏹ | Stop playhead | Always |
| Split | Cut at playhead | Clip selected |
| Delete | Remove clip | Clip selected |
| ✕ | Delete text layer | Text selected |
| 🗑 | Remove effect | Effect selected |
| Export | Save project | Always |

## Effects Available

### Blur & Sharpen
- **Gaussian Blur**: 0-20px, adjustable
- **Motion Blur**: 0-30px, adjustable

### Color Correction
- **Lumetri Color**: Brightness, Contrast, Saturation
- **Color Correction**: Hue, Saturation

### Distortion
- **Warp Stabilizer**: 0-100% intensity
- **Scale**: 0.5x - 3x zoom

### Perspective
- **Drop Shadow**: X/Y offset, blur, spread, opacity

### Transform
- **Opacity**: 0-100% transparency

### Style
- **Sepia**: Black & white + brown tone
- **Grayscale**: Full color to B&W
- **Invert**: Color inversion

## Keyboard Shortcuts (Coming Soon)
- `Space`: Play/Pause
- `Delete`: Delete selected layer
- `Ctrl+Z`: Undo (not yet implemented)
- `Ctrl+Y`: Redo (not yet implemented)

## Tips & Tricks

### ✨ Live Effect Preview
Effects are applied in **real-time** as you adjust sliders. No render time!

### 📹 Multi-Effect Stacking
You can apply **multiple effects** to the same clip. They combine automatically:
- Blur + Color Correction + Drop Shadow = Professional look

### 🎬 Timeline Organization
Keep your timeline clean:
1. Label clips meaningfully
2. Lock final layers so you don't accidentally move them
3. Use z-order to organize overlays

### ⚡ Performance Tips
- Effects use GPU acceleration (very fast)
- Works smoothly even with 4-5 effects active
- Disable visibility on unused layers if needed

## Common Issues & Solutions

### ❓ "I can't hear audio"
- Check volume in browser
- Make sure audio track is selected
- Audio layer might be muted (toggle visibility)

### ❓ "Effect not showing"
- Make sure clip is **selected** before applying effect
- Check that effect layer is **visible** (eye icon)
- Try adjusting parameters (range might be small)

### ❓ "Text disappeared"
- Check z-order (might be behind video)
- Use ↑ button to bring forward
- Make sure text layer is visible

### ❓ "Playback is choppy"
- Reduce number of active effects
- Lower preview quality
- Close other applications

## Features Overview

### ✅ What's Working
- Video/audio import and playback
- Real-time effects with parameters
- Text overlays with positioning
- Layer management with z-ordering
- Clip splitting and deletion
- Multi-effect stacking
- Live preview

### 🔄 In Development
- Transitions system (UI ready, needs preview)
- Undo/Redo history
- Export to MP4/WebM
- Keyframe animation

### 🚀 Future Features
- Audio effects (EQ, Reverb, Compression)
- Color grading
- Audio sync detection
- Multi-camera editing
- Batch processing
- Templates and presets

## Support

For bugs or feature requests, check the console (F12) for error messages and report them with:
1. Steps to reproduce
2. Error message from console
3. Browser/OS information

Enjoy editing! 🎥✨
