// Video Canvas Processor - Handles real-time video rendering with effects
export class VideoProcessor {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { willReadFrequently: true });
        this.videoElement = null;
        this.videoElement2 = null;
        this.transitionManager = null;
        this.currentTransition = null;
        this.filters = {};
        this.effects = [];
        this.animationFrameId = null;
    }

    setVideo(videoElement) {
        this.videoElement = videoElement;
        this.canvas.width = videoElement.videoWidth || 1920;
        this.canvas.height = videoElement.videoHeight || 1080;
    }

    setSecondVideo(videoElement) {
        this.videoElement2 = videoElement;
    }

    setTransitionManager(manager) {
        this.transitionManager = manager;
    }

    setCurrentTransition(transition) {
        this.currentTransition = transition;
    }

    applyFilters(filters) {
        this.filters = filters;
    }

    applyEffect(effect) {
        this.effects.push(effect);
    }

    clearEffects() {
        this.effects = [];
    }

    // Main rendering loop
    render() {
        if ((!this.videoElement || this.videoElement.paused || this.videoElement.ended) && !this.currentTransition) {
            return;
        }

        // Clear and draw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.currentTransition && this.videoElement2 && this.transitionManager) {
            // HANDLE TRANSITION RENDER
            this.transitionManager.applyTransition(
                this.currentTransition.type,
                this.videoElement,  // From Frame (Video 1)
                this.videoElement2, // To Frame (Video 2)
                this.currentTransition.duration,
                {
                    progress: this.currentTransition.progress,
                    ...this.currentTransition.options
                }
            );
        } else {
            // STANDARD RENDER
            this.ctx.filter = this.buildFilterString();
            this.ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);

            // Only apply pixel effects if there are any (expensive operation)
            if (this.effects.length > 0) {
                this.applyPixelEffects();
            }
        }

        // Continue rendering
        this.animationFrameId = requestAnimationFrame(() => this.render());
    }

    buildFilterString() {
        const f = this.filters;
        return `
      brightness(${f.brightness || 100}%)
      contrast(${f.contrast || 100}%)
      saturate(${f.saturation || 100}%)
      hue-rotate(${f.hue || 0}deg)
      blur(${f.blur || 0}px)
      grayscale(${f.grayscale || 0}%)
      sepia(${f.sepia || 0}%)
      invert(${f.invert || 0}%)
      opacity(${f.opacity || 100}%)
    `.trim();
    }

    applyPixelEffects() {
        if (this.effects.length === 0) return;

        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        this.effects.forEach(effect => {
            switch (effect.type) {
                case 'chromakey':
                    this.applyChromaKey(data, effect.color, effect.threshold);
                    break;
                case 'pixelate':
                    this.applyPixelate(imageData, effect.size);
                    break;
                case 'vignette':
                    this.applyVignette(data, effect.intensity);
                    break;
                case 'colorGrade':
                    this.applyColorGrade(data, effect.preset);
                    break;
                case 'noise':
                    this.applyNoise(data, effect.intensity);
                    break;
            }
        });

        this.ctx.putImageData(imageData, 0, 0);
    }

    // Chroma Key (Green Screen)
    applyChromaKey(data, targetColor = { r: 0, g: 255, b: 0 }, threshold = 100) {
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const distance = Math.sqrt(
                Math.pow(r - targetColor.r, 2) +
                Math.pow(g - targetColor.g, 2) +
                Math.pow(b - targetColor.b, 2)
            );

            if (distance < threshold) {
                data[i + 3] = 0; // Make transparent
            }
        }
    }

    // Pixelate Effect
    applyPixelate(imageData, blockSize = 10) {
        const { width, height, data } = imageData;

        for (let y = 0; y < height; y += blockSize) {
            for (let x = 0; x < width; x += blockSize) {
                const pixelIndex = (y * width + x) * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];

                for (let dy = 0; dy < blockSize; dy++) {
                    for (let dx = 0; dx < blockSize; dx++) {
                        const index = ((y + dy) * width + (x + dx)) * 4;
                        if (index < data.length) {
                            data[index] = r;
                            data[index + 1] = g;
                            data[index + 2] = b;
                        }
                    }
                }
            }
        }
    }

    // Vignette Effect
    applyVignette(data, intensity = 0.5) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                const vignette = 1 - (dist / maxDist) * intensity;

                data[index] *= vignette;
                data[index + 1] *= vignette;
                data[index + 2] *= vignette;
            }
        }
    }

    // Color Grading
    applyColorGrade(data, preset) {
        const presets = {
            warm: { r: 1.1, g: 1.0, b: 0.9 },
            cool: { r: 0.9, g: 1.0, b: 1.1 },
            vintage: { r: 1.2, g: 1.0, b: 0.8 },
            cinematic: { r: 1.1, g: 0.95, b: 0.85 }
        };

        const grade = presets[preset] || { r: 1, g: 1, b: 1 };

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * grade.r);
            data[i + 1] = Math.min(255, data[i + 1] * grade.g);
            data[i + 2] = Math.min(255, data[i + 2] * grade.b);
        }
    }

    // Film Noise
    applyNoise(data, intensity = 0.1) {
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * intensity * 255;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
    }

    startRendering() {
        this.render();
    }

    stopRendering() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    // Crop video
    cropVideo(x, y, width, height) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.videoElement,
            x, y, width, height,
            0, 0, this.canvas.width, this.canvas.height
        );
    }

    // Rotate video
    rotateVideo(angle) {
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate((angle * Math.PI) / 180);
        this.ctx.drawImage(
            this.videoElement,
            -this.canvas.width / 2,
            -this.canvas.height / 2,
            this.canvas.width,
            this.canvas.height
        );
        this.ctx.restore();
    }

    // Flip video
    flipVideo(horizontal = false, vertical = false) {
        this.ctx.save();
        this.ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
        this.ctx.drawImage(
            this.videoElement,
            horizontal ? -this.canvas.width : 0,
            vertical ? -this.canvas.height : 0,
            this.canvas.width,
            this.canvas.height
        );
        this.ctx.restore();
    }

    // Get current frame as image
    captureFrame() {
        return this.canvas.toDataURL('image/png');
    }

    // Export video frames
    async exportFrames(startTime, endTime, fps = 30) {
        const frames = [];
        const frameInterval = 1 / fps;

        for (let time = startTime; time <= endTime; time += frameInterval) {
            this.videoElement.currentTime = time;
            await new Promise(resolve => {
                this.videoElement.onseeked = resolve;
            });
            frames.push(this.captureFrame());
        }

        return frames;
    }
}

export default VideoProcessor;
