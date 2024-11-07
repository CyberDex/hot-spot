import '@pixi/events';
import '@pixi/mixin-get-global-position';
import { Application } from '@pixi/app';
import { UPDATE_PRIORITY } from '@pixi/core';
import { addStats } from 'pixi-stats';

export class Pixi extends Application<HTMLCanvasElement> {
    public static resolution: number;

    constructor() {
        Pixi.resolution = getResolution();

        super({
            resolution: Pixi.resolution,
            backgroundAlpha: 0,
        });

        document.body.appendChild(this.view);

        this.onResize();
        window.addEventListener('resize', this.onResize);

        if (BUILD_TYPE === 'development') {
            (globalThis as any).__PIXI_APP__ = this;
            this.addStats();
        }
    }

    private addStats() {
        const pixiStats = addStats(document, this as any);

        this.ticker.add(pixiStats.update, pixiStats, UPDATE_PRIORITY.UTILITY);
    }

    private onResize() {
        const { width, height } = getAppSize();

        // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
        if (this.renderer?.view) {
            this.renderer.view.style.width = `${window.innerWidth}px`;
            this.renderer.view.style.height = `${window.innerHeight}px`;

            // Update renderer  and navigation screens dimensions
            this.renderer.resize(width, height);
        }

        window.scrollTo(0, 0);
    }
}

export function getAppSize() {
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

export function getResolution(): number {
    let resolution = Math.max(window.devicePixelRatio, 2);

    if (resolution % 1 !== 0) {
        resolution = 2;
    }

    return resolution;
}

export const pixi = new Pixi();
