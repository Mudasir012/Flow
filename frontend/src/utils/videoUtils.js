// Video processing utilities
export const processVideo = async (videoElement, filters) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      hue-rotate(${filters.hue}deg)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      invert(${filters.invert}%)
      opacity(${filters.opacity}%)
    `;

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
    });
};

// Format time helper
export const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00.00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

// Generate unique ID
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Calculate clip position on timeline
export const calculateClipPosition = (clip, pixelPerSecond, zoom) => {
    return {
        left: clip.start * pixelPerSecond * zoom,
        width: (clip.end - clip.start) * pixelPerSecond * zoom
    };
};

// Merge video clips (simplified - in production use FFmpeg)
export const mergeClips = async (clips) => {
    // This is a placeholder - real implementation would use FFmpeg.js or server-side processing
    console.log('Merging clips:', clips);
    return clips;
};

// Apply effect to video
export const applyEffect = (videoElement, effect) => {
    const effects = {
        vintage: 'sepia(80%) contrast(120%) brightness(90%)',
        cinematic: 'contrast(110%) brightness(90%) saturate(120%)',
        neon: 'saturate(200%) brightness(120%) contrast(120%)',
        glitch: 'hue-rotate(90deg) saturate(150%)',
        vhs: 'sepia(40%) contrast(120%) brightness(90%)',
        bokeh: 'blur(2px) brightness(110%)',
        chromatic: 'hue-rotate(180deg) saturate(150%)',
        pixelate: 'contrast(150%) brightness(90%)'
    };

    return effects[effect.id] || '';
};

// Export video settings
export const getExportSettings = (preset) => {
    const presets = {
        '4k': { width: 3840, height: 2160, bitrate: '20M', fps: 30 },
        '1080p': { width: 1920, height: 1080, bitrate: '8M', fps: 30 },
        '720p': { width: 1280, height: 720, bitrate: '5M', fps: 30 },
        '480p': { width: 854, height: 480, bitrate: '2.5M', fps: 30 },
        'instagram': { width: 1080, height: 1080, bitrate: '5M', fps: 30 },
        'youtube': { width: 1920, height: 1080, bitrate: '8M', fps: 30 },
        'tiktok': { width: 1080, height: 1920, bitrate: '5M', fps: 30 }
    };

    return presets[preset] || presets['1080p'];
};

// Validate video file
export const validateVideoFile = (file) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload MP4, WebM, OGG, or MOV files.');
    }

    if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 500MB.');
    }

    return true;
};

// Get video metadata
export const getVideoMetadata = (file) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve({
                duration: video.duration,
                width: video.videoWidth,
                height: video.videoHeight,
                aspectRatio: video.videoWidth / video.videoHeight
            });
        };

        video.onerror = () => {
            reject(new Error('Failed to load video metadata'));
        };

        video.src = URL.createObjectURL(file);
    });
};

// Snap to grid helper
export const snapToGrid = (value, gridSize = 1) => {
    return Math.round(value / gridSize) * gridSize;
};

// Check clip overlap
export const checkClipOverlap = (clip1, clip2) => {
    return !(clip1.end <= clip2.start || clip1.start >= clip2.end);
};

// Sort clips by start time
export const sortClipsByTime = (clips) => {
    return [...clips].sort((a, b) => a.start - b.start);
};

// Calculate total timeline duration
export const calculateTimelineDuration = (clips) => {
    if (clips.length === 0) return 0;
    return Math.max(...clips.map(clip => clip.end));
};

// Create thumbnail from video
export const createThumbnail = (videoElement, time = 0) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 160;
        canvas.height = 90;

        videoElement.currentTime = time;
        videoElement.onseeked = () => {
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL());
        };
    });
};

// Audio waveform generator (simplified)
export const generateWaveform = (audioBuffer) => {
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / 1000);
    const waveform = [];

    for (let i = 0; i < 1000; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
            sum += Math.abs(data[i * step + j] || 0);
        }
        waveform.push(sum / step);
    }

    return waveform;
};

// Keyboard shortcuts handler
export const handleKeyboardShortcut = (event, callbacks) => {
    const { key, ctrlKey, metaKey, shiftKey } = event;
    const modifier = ctrlKey || metaKey;

    const shortcuts = {
        'Space': callbacks.playPause,
        'ArrowLeft': callbacks.seekBackward,
        'ArrowRight': callbacks.seekForward,
        'Delete': callbacks.deleteClip,
        'Backspace': callbacks.deleteClip,
        's_ctrl': callbacks.save,
        'z_ctrl': callbacks.undo,
        'y_ctrl': callbacks.redo,
        'c_ctrl': callbacks.copy,
        'v_ctrl': callbacks.paste,
        'x_ctrl': callbacks.cut,
        'a_ctrl': callbacks.selectAll
    };

    const shortcutKey = modifier ? `${key}_ctrl` : key;
    const handler = shortcuts[shortcutKey];

    if (handler) {
        event.preventDefault();
        handler();
    }
};

// Export utilities
export default {
    processVideo,
    formatTime,
    generateId,
    calculateClipPosition,
    mergeClips,
    applyEffect,
    getExportSettings,
    validateVideoFile,
    getVideoMetadata,
    snapToGrid,
    checkClipOverlap,
    sortClipsByTime,
    calculateTimelineDuration,
    createThumbnail,
    generateWaveform,
    handleKeyboardShortcut
};
