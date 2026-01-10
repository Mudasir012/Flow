// Advanced Transition Effects
export class AdvancedTransitions {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    // Glitch transition
    async glitch(fromFrame, toFrame, duration = 1000) {
        const steps = 30;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Random glitch offset
            const glitchAmount = Math.sin(progress * Math.PI) * 50;
            const offset = Math.random() * glitchAmount;

            if (progress < 0.5) {
                this.ctx.drawImage(fromFrame, offset, 0, this.canvas.width, this.canvas.height);
                // Add RGB split
                this.ctx.globalCompositeOperation = 'screen';
                this.ctx.globalAlpha = 0.5;
                this.ctx.drawImage(fromFrame, offset + 5, 0, this.canvas.width, this.canvas.height);
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.globalAlpha = 1;
            } else {
                this.ctx.drawImage(toFrame, -offset, 0, this.canvas.width, this.canvas.height);
            }

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Page turn transition
    async pageTurn(fromFrame, toFrame, duration = 1500) {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw from frame
            this.ctx.drawImage(fromFrame, 0, 0, this.canvas.width, this.canvas.height);

            // Create page turn effect
            this.ctx.save();
            const turnWidth = this.canvas.width * progress;

            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width - turnWidth, 0);
            this.ctx.lineTo(this.canvas.width, 0);
            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.lineTo(this.canvas.width - turnWidth, this.canvas.height);
            this.ctx.closePath();
            this.ctx.clip();

            this.ctx.drawImage(toFrame, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();

            // Add shadow
            const gradient = this.ctx.createLinearGradient(
                this.canvas.width - turnWidth - 20,
                0,
                this.canvas.width - turnWidth,
                0
            );
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                this.canvas.width - turnWidth - 20,
                0,
                20,
                this.canvas.height
            );

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Cube rotation transition
    async cubeRotate(fromFrame, toFrame, duration = 1500) {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const angle = progress * Math.PI / 2;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save();

            // Calculate perspective
            const scale = Math.cos(angle);
            const width = this.canvas.width * Math.abs(scale);
            const x = (this.canvas.width - width) / 2;

            if (progress < 0.5) {
                this.ctx.drawImage(fromFrame, x, 0, width, this.canvas.height);
            } else {
                this.ctx.drawImage(toFrame, x, 0, width, this.canvas.height);
            }

            this.ctx.restore();
            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Ripple transition
    async ripple(fromFrame, toFrame, duration = 1500) {
        const steps = 60;
        const stepDuration = duration / steps;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.drawImage(fromFrame, 0, 0, this.canvas.width, this.canvas.height);

            // Create ripple effect
            for (let r = 0; r < 5; r++) {
                const radius = maxRadius * progress + r * 30;
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.arc(centerX, centerY, radius - 15, 0, Math.PI * 2, true);
                this.ctx.clip();
                this.ctx.drawImage(toFrame, 0, 0, this.canvas.width, this.canvas.height);
                this.ctx.restore();
            }

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Mosaic transition
    async mosaic(fromFrame, toFrame, duration = 1500) {
        const steps = 40;
        const stepDuration = duration / steps;
        const tileSize = 20;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let y = 0; y < this.canvas.height; y += tileSize) {
                for (let x = 0; x < this.canvas.width; x += tileSize) {
                    const showNew = Math.random() < progress;
                    const frame = showNew ? toFrame : fromFrame;
                    this.ctx.drawImage(
                        frame,
                        x, y, tileSize, tileSize,
                        x, y, tileSize, tileSize
                    );
                }
            }

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Swirl transition
    async swirl(fromFrame, toFrame, duration = 1500) {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const angle = progress * Math.PI * 4;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.rotate(angle);
            this.ctx.scale(1 - progress, 1 - progress);
            this.ctx.globalAlpha = 1 - progress;
            this.ctx.drawImage(
                fromFrame,
                -this.canvas.width / 2,
                -this.canvas.height / 2,
                this.canvas.width,
                this.canvas.height
            );
            this.ctx.restore();

            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.rotate(-angle);
            this.ctx.scale(progress, progress);
            this.ctx.globalAlpha = progress;
            this.ctx.drawImage(
                toFrame,
                -this.canvas.width / 2,
                -this.canvas.height / 2,
                this.canvas.width,
                this.canvas.height
            );
            this.ctx.restore();

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Blinds transition
    async blinds(fromFrame, toFrame, duration = 1000, vertical = true) {
        const steps = 40;
        const stepDuration = duration / steps;
        const blindCount = 10;
        const blindSize = vertical
            ? this.canvas.width / blindCount
            : this.canvas.height / blindCount;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.drawImage(fromFrame, 0, 0, this.canvas.width, this.canvas.height);

            for (let b = 0; b < blindCount; b++) {
                const offset = vertical ? b * blindSize : b * blindSize;
                const size = blindSize * progress;

                this.ctx.save();
                if (vertical) {
                    this.ctx.rect(offset, 0, size, this.canvas.height);
                } else {
                    this.ctx.rect(0, offset, this.canvas.width, size);
                }
                this.ctx.clip();
                this.ctx.drawImage(toFrame, 0, 0, this.canvas.width, this.canvas.height);
                this.ctx.restore();
            }

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Checkerboard transition
    async checkerboard(fromFrame, toFrame, duration = 1000) {
        const steps = 30;
        const stepDuration = duration / steps;
        const size = 40;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.drawImage(fromFrame, 0, 0, this.canvas.width, this.canvas.height);

            for (let y = 0; y < this.canvas.height; y += size) {
                for (let x = 0; x < this.canvas.width; x += size) {
                    const isEven = ((x / size) + (y / size)) % 2 === 0;
                    const showNew = isEven ? progress > 0.5 : progress > 0;

                    if (showNew) {
                        this.ctx.drawImage(
                            toFrame,
                            x, y, size, size,
                            x, y, size, size
                        );
                    }
                }
            }

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Crossfade with zoom
    async crossfadeZoom(fromFrame, toFrame, duration = 1500) {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Zoom out from frame
            const fromScale = 1 + progress * 0.5;
            const fromWidth = this.canvas.width * fromScale;
            const fromHeight = this.canvas.height * fromScale;
            const fromX = (this.canvas.width - fromWidth) / 2;
            const fromY = (this.canvas.height - fromHeight) / 2;

            this.ctx.globalAlpha = 1 - progress;
            this.ctx.drawImage(fromFrame, fromX, fromY, fromWidth, fromHeight);

            // Zoom in to frame
            const toScale = 1.5 - progress * 0.5;
            const toWidth = this.canvas.width * toScale;
            const toHeight = this.canvas.height * toScale;
            const toX = (this.canvas.width - toWidth) / 2;
            const toY = (this.canvas.height - toHeight) / 2;

            this.ctx.globalAlpha = progress;
            this.ctx.drawImage(toFrame, toX, toY, toWidth, toHeight);

            this.ctx.globalAlpha = 1;
            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Directional blur transition
    async directionalBlur(fromFrame, toFrame, duration = 1000, direction = 'horizontal') {
        const steps = 40;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const blurAmount = Math.sin(progress * Math.PI) * 20;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Apply directional blur effect
            const filter = direction === 'horizontal'
                ? `blur(${blurAmount}px) saturate(${100 - progress * 50}%)`
                : `blur(${blurAmount}px) saturate(${100 - progress * 50}%)`;

            this.ctx.filter = filter;

            if (progress < 0.5) {
                this.ctx.drawImage(fromFrame, 0, 0, this.canvas.width, this.canvas.height);
            } else {
                this.ctx.drawImage(toFrame, 0, 0, this.canvas.width, this.canvas.height);
            }

            this.ctx.filter = 'none';
            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }
}

export default AdvancedTransitions;
