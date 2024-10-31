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