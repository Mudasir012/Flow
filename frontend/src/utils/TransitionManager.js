// Transition Effects Handler
export class TransitionManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    // Fade transition
    async fade(fromFrame, toFrame, duration = 1000, type = 'in') {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const alpha = type === 'in' ? progress : 1 - progress;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (fromFrame) {
                this.ctx.globalAlpha = 1 - alpha;
                this.ctx.drawImage(fromFrame, 0, 0, this.canvas.width, this.canvas.height);
            }

            this.ctx.globalAlpha = alpha;
            this.ctx.drawImage(toFrame, 0, 0, this.canvas.width, this.canvas.height);

            this.ctx.globalAlpha = 1;

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Dissolve transition
    async dissolve(fromFrame, toFrame, duration = 1000) {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (fromFrame) {
                this.ctx.globalAlpha = 1 - progress;
                this.ctx.drawImage(fromFrame, 0, 0, this.canvas.width, this.canvas.height);
            }

            this.ctx.globalAlpha = progress;
            this.ctx.drawImage(toFrame, 0, 0, this.canvas.width, this.canvas.height);

            this.ctx.globalAlpha = 1;

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Wipe transition
    async wipe(fromFrame, toFrame, duration = 1000, direction = 'left') {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (fromFrame) {
                this.ctx.drawImage(fromFrame, 0, 0, this.canvas.width, this.canvas.height);
            }

            this.ctx.save();

            switch (direction) {
                case 'left':
                    this.ctx.rect(0, 0, this.canvas.width * progress, this.canvas.height);
                    break;
                case 'right':
                    this.ctx.rect(this.canvas.width * (1 - progress), 0, this.canvas.width * progress, this.canvas.height);
                    break;
                case 'top':
                    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height * progress);
                    break;
                case 'bottom':
                    this.ctx.rect(0, this.canvas.height * (1 - progress), this.canvas.width, this.canvas.height * progress);
                    break;
            }

            this.ctx.clip();
            this.ctx.drawImage(toFrame, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Slide transition
    async slide(fromFrame, toFrame, duration = 1000, direction = 'left') {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            let fromX = 0, fromY = 0, toX = 0, toY = 0;

            switch (direction) {
                case 'left':
                    fromX = -this.canvas.width * progress;
                    toX = this.canvas.width * (1 - progress);
                    break;
                case 'right':
                    fromX = this.canvas.width * progress;
                    toX = -this.canvas.width * (1 - progress);
                    break;
                case 'up':
                    fromY = -this.canvas.height * progress;
                    toY = this.canvas.height * (1 - progress);
                    break;
                case 'down':
                    fromY = this.canvas.height * progress;
                    toY = -this.canvas.height * (1 - progress);
                    break;
            }

            if (fromFrame) {
                this.ctx.drawImage(fromFrame, fromX, fromY, this.canvas.width, this.canvas.height);
            }
            this.ctx.drawImage(toFrame, toX, toY, this.canvas.width, this.canvas.height);

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Zoom transition
    async zoom(fromFrame, toFrame, duration = 1000, type = 'in') {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (fromFrame) {
                const scale = type === 'in' ? 1 + progress : 1 - progress;
                const width = this.canvas.width * scale;
                const height = this.canvas.height * scale;
                const x = (this.canvas.width - width) / 2;
                const y = (this.canvas.height - height) / 2;

                this.ctx.globalAlpha = 1 - progress;
                this.ctx.drawImage(fromFrame, x, y, width, height);
            }

            const scale = type === 'in' ? progress : 1 - progress;
            const width = this.canvas.width * scale;
            const height = this.canvas.height * scale;
            const x = (this.canvas.width - width) / 2;
            const y = (this.canvas.height - height) / 2;

            this.ctx.globalAlpha = progress;
            this.ctx.drawImage(toFrame, x, y, width, height);

            this.ctx.globalAlpha = 1;

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Rotate transition
    async rotate(fromFrame, toFrame, duration = 1000) {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const angle = progress * Math.PI * 2;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.rotate(angle);
            this.ctx.globalAlpha = 1 - progress;

            if (fromFrame) {
                this.ctx.drawImage(
                    fromFrame,
                    -this.canvas.width / 2,
                    -this.canvas.height / 2,
                    this.canvas.width,
                    this.canvas.height
                );
            }

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

    // Blur transition
    async blur(fromFrame, toFrame, duration = 1000) {
        const steps = 60;
        const stepDuration = duration / steps;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const blurAmount = Math.sin(progress * Math.PI) * 20;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.filter = `blur(${blurAmount}px)`;

            if (progress < 0.5) {
                this.ctx.drawImage(fromFrame, 0, 0, this.canvas.width, this.canvas.height);
            } else {
                this.ctx.drawImage(toFrame, 0, 0, this.canvas.width, this.canvas.height);
            }

            this.ctx.filter = 'none';

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Circle wipe transition
    async circleWipe(fromFrame, toFrame, duration = 1000) {
        const steps = 60;
        const stepDuration = duration / steps;
        const maxRadius = Math.sqrt(
            Math.pow(this.canvas.width / 2, 2) + Math.pow(this.canvas.height / 2, 2)
        );

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const radius = maxRadius * progress;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (fromFrame) {
                this.ctx.drawImage(fromFrame, 0, 0, this.canvas.width, this.canvas.height);
            }

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(
                this.canvas.width / 2,
                this.canvas.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            this.ctx.clip();
            this.ctx.drawImage(toFrame, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();

            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Apply transition by name
    async applyTransition(type, fromFrame, toFrame, duration, options = {}) {
        switch (type) {
            case 'fade':
                await this.fade(fromFrame, toFrame, duration, options.fadeType);
                break;
            case 'dissolve':
                await this.dissolve(fromFrame, toFrame, duration);
                break;
            case 'wipe':
                await this.wipe(fromFrame, toFrame, duration, options.direction);
                break;
            case 'slide':
                await this.slide(fromFrame, toFrame, duration, options.direction);
                break;
            case 'zoom':
                await this.zoom(fromFrame, toFrame, duration, options.zoomType);
                break;
            case 'rotate':
                await this.rotate(fromFrame, toFrame, duration);
                break;
            case 'blur':
                await this.blur(fromFrame, toFrame, duration);
                break;
            case 'circleWipe':
                await this.circleWipe(fromFrame, toFrame, duration);
                break;
            default:
                this.ctx.drawImage(toFrame, 0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

export default TransitionManager;
