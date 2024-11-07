import { Container } from '@pixi/display';
import type { Sprite } from '@pixi/sprite';
import { getAppSize, pixi } from 'plugins/Pixi';
import { addSpritesToViewPort, generateSprites } from 'utils/viewport';
import { runAndMeasure } from 'utils/measure';
import { config } from './conf/config';
import { Point, state } from 'plugins/State';

export class App extends Container {
    private viewPort!: Container;
    private isDragging = false;

    constructor() {
        super();

        this.addViewPort();
        this.addEvents();
        pixi.stage.addChild(this);

        state.onChange(({ width, height, size, dist }) => {
            console.log('state changed', {
                width,
                height,
                size,
                dist,
            });

            this.generateSprites();
        });

        state.onChange(({ pos, scale }) => {
            if (pos) {
                this.viewPort.x = pos.x;
                this.viewPort.y = pos.y;
            }

            if (scale) {
                this.viewPort.scale.set(scale);
            }

            console.log('state changed', {
                pos,
                scale,
                viewport: {
                    x: this.viewPort.x,
                    y: this.viewPort.y,
                    scale: this.viewPort.scale.x,
                },
            });
        });

        this.resetPosition();
    }

    private addViewPort() {
        if (this.viewPort) return;

        this.viewPort = new Container();

        this.viewPort.sortableChildren = false;
        this.viewPort.cullable = true;

        this.addChild(this.viewPort);
    }

    private addEvents() {
        const options: AddEventListenerOptions = {
            capture: true,
        };

        pixi.view.addEventListener('wheel', (event) => this.onZoom(event), options);
        pixi.view.addEventListener('pointerdown', (event) => this.onClick(event), options);
        pixi.view.addEventListener('pointerup', () => this.onDragEnd(), options);
        pixi.view.addEventListener('pointerupoutside', () => this.onDragEnd(), options);
        pixi.view.addEventListener('pointermove', (event) => this.onDrag(event), options);
    }

    private onZoom(event: WheelEvent) {
        const scaleAmount = config.scaleStep; // Adjust scale speed
        const direction = event.deltaY < 0 ? 1 : -1;

        // Scroll up or down
        this.viewPort.scale.x += scaleAmount * direction;
        this.viewPort.scale.y += scaleAmount * direction;

        const scale = Math.max(config.minScale, Math.min(this.viewPort.scale.x, config.maxScale));

        // Clamp the scale values to prevent excessive scaling
        this.viewPort.scale.x = scale;
        this.viewPort.scale.y = scale;

        state.set({ scale });
    }

    private onClick(event: PointerEvent) {
        if (event.button === 0) {
            this.isDragging = true;
        }
    }

    private onDrag(event: PointerEvent) {
        if (!this.isDragging) return;

        this.viewPort.x += event.movementX;
        this.viewPort.y += event.movementY;
    }

    private onDragEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;

        state.set({
            pos: {
                x: this.viewPort.x,
                y: this.viewPort.y,
            },
        });
    }

    private generateSprites() {
        this.addViewPort();

        this.unfreezeViewport();
        this.viewPort.removeChildren();

        const sprites: Sprite[] = runAndMeasure(generateSprites, state.data);

        pixi.stop();

        runAndMeasure(addSpritesToViewPort, {
            sprites,
            viewPort: this.viewPort,
        });

        pixi.start();

        this.freezeViewport();
    }

    private freezeViewport() {
        (this.viewPort as any).cacheAsBitmap = false;
    }

    private unfreezeViewport() {
        (this.viewPort as any).cacheAsBitmap = true;
    }

    private resetPosition() {
        // TODO: add reset position logic

        const { width, height } = getAppSize();

        state.set({
            pos: {
                x: width / 2,
                y: height / 2,
            },
        });
    }
}
