// Timeline Manager - Handles clip management and timeline operations
export class TimelineManager {
    constructor() {
        this.clips = [];
        this.textOverlays = [];
        this.transitions = [];
        this.audioTracks = [];
        this.duration = 0;
    }

    // Add clip to timeline
    addClip(clip) {
        this.clips.push({
            ...clip,
            id: this.generateId(),
            start: clip.start || 0,
            end: clip.end || clip.duration,
            track: clip.track || 0
        });
        this.updateDuration();
        return this.clips[this.clips.length - 1];
    }

    // Remove clip
    removeClip(clipId) {
        this.clips = this.clips.filter(c => c.id !== clipId);
        this.updateDuration();
    }

    // Update clip
    updateClip(clipId, updates) {
        const index = this.clips.findIndex(c => c.id === clipId);
        if (index !== -1) {
            this.clips[index] = { ...this.clips[index], ...updates };
            this.updateDuration();
        }
    }

    // Split clip at time
    splitClip(clipId, time) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip || time <= clip.start || time >= clip.end) return null;

        const clip1 = {
            ...clip,
            id: this.generateId(),
            end: time,
            trimEnd: clip.trimStart + (time - clip.start)
        };

        const clip2 = {
            ...clip,
            id: this.generateId(),
            start: time,
            trimStart: clip.trimStart + (time - clip.start)
        };

        this.removeClip(clipId);
        this.clips.push(clip1, clip2);
        this.updateDuration();

        return { clip1, clip2 };
    }

    // Trim clip
    trimClip(clipId, newStart, newEnd) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip) return;

        const originalDuration = clip.end - clip.start;
        const newDuration = newEnd - newStart;

        clip.start = newStart;
        clip.end = newEnd;
        clip.trimStart = clip.trimStart || 0;
        clip.trimEnd = clip.trimStart + newDuration;

        this.updateDuration();
    }

    // Move clip
    moveClip(clipId, newStart) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip) return;

        const duration = clip.end - clip.start;
        clip.start = newStart;
        clip.end = newStart + duration;

        this.updateDuration();
    }

    // Duplicate clip
    duplicateClip(clipId) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip) return null;

        const newClip = {
            ...clip,
            id: this.generateId(),
            start: clip.end,
            end: clip.end + (clip.end - clip.start)
        };

        this.clips.push(newClip);
        this.updateDuration();
        return newClip;
    }

    // Get clips at time
    getClipsAtTime(time) {
        return this.clips.filter(c => time >= c.start && time <= c.end);
    }

    // Get active clip for track
    getActiveClip(time, track = 0) {
        return this.clips.find(c =>
            time >= c.start &&
            time <= c.end &&
            c.track === track
        );
    }

    // Check for overlaps
    hasOverlap(clip1, clip2) {
        return !(clip1.end <= clip2.start || clip1.start >= clip2.end) &&
            clip1.track === clip2.track;
    }

    // Resolve overlaps by moving clips
    resolveOverlaps(clipId) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip) return;

        const overlapping = this.clips.filter(c =>
            c.id !== clipId && this.hasOverlap(clip, c)
        );

        overlapping.forEach(other => {
            if (clip.start < other.start) {
                this.moveClip(other.id, clip.end);
            } else {
                this.moveClip(clipId, other.end);
            }
        });
    }

    // --- Ripple / Rolling / Slide helpers ---
    // Ripple resize: when a clip's end changes, shift subsequent clips on the same track
    rippleResizeClip(clipId, newEnd) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip) return;
        const origEnd = clip.end;
        const delta = newEnd - origEnd;

        // Update the clip end
        clip.end = newEnd;
        clip.trimEnd = (clip.trimStart || 0) + (clip.end - clip.start);

        if (delta === 0) return;

        // Shift all clips that start at or after the original end on the same track
        this.clips.forEach(c => {
            if (c.id !== clipId && c.track === clip.track && c.start >= origEnd) {
                c.start += delta;
                c.end += delta;
            }
        });

        this.updateDuration();
    }

    // Rolling resize: adjust the next clip to keep overall timeline length constant
    rollingResizeClip(clipId, newEnd, threshold = 0.001) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip) return;
        const origEnd = clip.end;
        const delta = newEnd - origEnd;

        // Update this clip
        clip.end = newEnd;
        clip.trimEnd = (clip.trimStart || 0) + (clip.end - clip.start);

        if (Math.abs(delta) < threshold) return;

        // Find a next clip that starts where this one ended (or very close to it)
        const candidates = this.clips
            .filter(c => c.id !== clipId && c.track === clip.track && c.start >= origEnd - threshold)
            .sort((a, b) => a.start - b.start);

        const next = candidates[0];
        if (next) {
            // Move next clip's start by delta to preserve timeline length
            next.start += delta;
            next.end += delta;
        }

        this.updateDuration();
    }

    // Slide: move clip while attempting to keep timeline length by adjusting neighbors
    slideMoveClip(clipId, newStart) {
        const clip = this.clips.find(c => c.id === clipId);
        if (!clip) return;
        const origStart = clip.start;
        const delta = newStart - origStart;

        // Move clip
        const duration = clip.end - clip.start;
        clip.start = newStart;
        clip.end = newStart + duration;

        if (delta === 0) return;

        if (delta > 0) {
            // moved right: try compressing / moving the next clip left by delta if possible
            const nextClips = this.clips.filter(c => c.id !== clipId && c.track === clip.track && c.start >= origStart).sort((a,b)=>a.start-b.start);
            const next = nextClips[0];
            if (next) {
                // shift next clip left by delta where possible (but not before this clip end)
                next.start = Math.max(next.start - delta, clip.end);
                next.end = next.start + (next.end - next.start);
            }
        } else {
            // moved left: try expanding previous clip's end
            const prevClips = this.clips.filter(c => c.id !== clipId && c.track === clip.track && c.end <= origStart).sort((a,b)=>b.end-a.end);
            const prev = prevClips[0];
            if (prev) {
                prev.end = Math.max(prev.end + Math.abs(delta), prev.end);
            }
        }

        this.updateDuration();
    }

    // Snap to grid
    snapToGrid(time, gridSize = 1) {
        return Math.round(time / gridSize) * gridSize;
    }

    // Add transition between clips
    addTransition(clip1Id, clip2Id, type, duration) {
        const clip1 = this.clips.find(c => c.id === clip1Id);
        const clip2 = this.clips.find(c => c.id === clip2Id);

        if (!clip1 || !clip2) return null;

        const transition = {
            id: this.generateId(),
            type,
            duration,
            startTime: Math.max(clip1.end - duration / 2, clip1.start),
            endTime: Math.min(clip2.start + duration / 2, clip2.end),
            clip1Id,
            clip2Id
        };

        this.transitions.push(transition);
        return transition;
    }

    // Add text overlay
    addTextOverlay(text, start, end, style = {}) {
        const overlay = {
            id: this.generateId(),
            text,
            start,
            end,
            x: style.x || 50,
            y: style.y || 50,
            fontSize: style.fontSize || 48,
            color: style.color || '#ffffff',
            fontFamily: style.fontFamily || 'Arial',
            fontWeight: style.fontWeight || 'normal',
            textAlign: style.textAlign || 'center',
            backgroundColor: style.backgroundColor || 'transparent',
            padding: style.padding || 10,
            borderRadius: style.borderRadius || 0,
            opacity: style.opacity || 1,
            rotation: style.rotation || 0,
            animation: style.animation || 'none'
        };

        this.textOverlays.push(overlay);
        return overlay;
    }

    // Update text overlay
    updateTextOverlay(overlayId, updates) {
        const index = this.textOverlays.findIndex(t => t.id === overlayId);
        if (index !== -1) {
            this.textOverlays[index] = { ...this.textOverlays[index], ...updates };
        }
    }

    // Remove text overlay
    removeTextOverlay(overlayId) {
        this.textOverlays = this.textOverlays.filter(t => t.id !== overlayId);
    }

    // Get text overlays at time
    getTextOverlaysAtTime(time) {
        return this.textOverlays.filter(t => time >= t.start && time <= t.end);
    }

    // Add audio track
    addAudioTrack(audioClip) {
        this.audioTracks.push({
            ...audioClip,
            id: this.generateId()
        });
        this.updateDuration();
    }

    // Update duration
    updateDuration() {
        const clipEnd = this.clips.length > 0
            ? Math.max(...this.clips.map(c => c.end))
            : 0;
        const textEnd = this.textOverlays.length > 0
            ? Math.max(...this.textOverlays.map(t => t.end))
            : 0;
        const audioEnd = this.audioTracks.length > 0
            ? Math.max(...this.audioTracks.map(a => a.end))
            : 0;

        this.duration = Math.max(clipEnd, textEnd, audioEnd, 10);
    }

    // Sort clips by start time
    sortClips() {
        this.clips.sort((a, b) => a.start - b.start);
    }

    // Get timeline data
    getTimelineData() {
        return {
            clips: this.clips,
            textOverlays: this.textOverlays,
            transitions: this.transitions,
            audioTracks: this.audioTracks,
            duration: this.duration
        };
    }

    // Load timeline data
    loadTimelineData(data) {
        this.clips = data.clips || [];
        this.textOverlays = data.textOverlays || [];
        this.transitions = data.transitions || [];
        this.audioTracks = data.audioTracks || [];
        this.duration = data.duration || 0;
    }

    // Clear timeline
    clear() {
        this.clips = [];
        this.textOverlays = [];
        this.transitions = [];
        this.audioTracks = [];
        this.duration = 0;
    }

    // Generate unique ID
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Export timeline for rendering
    exportForRendering() {
        return {
            clips: this.clips.map(c => ({
                ...c,
                actualStart: c.trimStart || 0,
                actualEnd: c.trimEnd || c.duration
            })),
            textOverlays: this.textOverlays,
            transitions: this.transitions,
            audioTracks: this.audioTracks,
            totalDuration: this.duration
        };
    }
}

export default TimelineManager;
