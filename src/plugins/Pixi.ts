import { Application, UPDATE_PRIORITY, AbstractRenderer } from 'pixi.js';
import { addStats } from 'pixi-stats';

export class Pixi extends Application {
    public static resolution: number;

    async initiate(): Promise<Pixi> {
        AbstractRenderer.defaultOptions.resolution = getResolution();

        await super.init();

        document.body.appendChild(this.canvas);

        this.onResize();
        window.addEventListener('resize', () => this.onResize());

        if (BUILD_TYPE === 'development') {
            (globalThis as any).__PIXI_APP__ = this;
            this.addStats();
        }

        return this;
    }

    private addStats() {
        const pixiStats = addStats(document, this as any);

        this.ticker.add(pixiStats.update, pixiStats, UPDATE_PRIORITY.UTILITY);
    }

    private onResize() {
        const { width, height } = this.getAppSize();

        this.renderer.resize(width, height);
        window.scrollTo(0, 0);
    }

    getAppSize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const minWidth = 375;
        const minHeight = windowWidth > windowHeight ? 700 : 790;

        // Calculate renderer and canvas sizes based on current dimensions
        const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
        const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;

        const scale = scaleX > scaleY ? scaleX : scaleY;

        const width = windowWidth * scale;
        const height = windowHeight * scale;

        return { width, height };
    }
}

export function getResolution(): number {
    let resolution = Math.max(window.devicePixelRatio, 2);

    if (resolution % 1 !== 0) {
        resolution = 2;
    }

    return resolution;
}
