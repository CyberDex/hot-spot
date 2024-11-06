import { Application } from '@pixi/app';
import '@pixi/events';
import '@pixi/mixin-get-global-position';

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
    }

    private onResize() {
        const { width, height } = this.getAppSize();

        // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
        this.renderer.view.style.width = `${window.innerWidth}px`;
        this.renderer.view.style.height = `${window.innerHeight}px`;
        window.scrollTo(0, 0);

        // Update renderer  and navigation screens dimensions
        this.renderer.resize(width, height);
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

export const pixi = new Pixi();
