import ls from 'localstorage-slim';
import { Container } from '@pixi/display';
import type { Sprite } from '@pixi/sprite';
import { pixi } from './plugins/Pixi';
import { addSpritesToViewPort, generateSprites } from 'utils/viewport';
import type { SpritesGeneratorConfig } from 'utils/viewport';
import { runAndMeasure } from 'utils/measure';
import { config } from './conf/config';

export class App extends Container {
    private viewPort!: Container;
    private isDragging = false;

    constructor() {
        super();

        this.addEvents();
        this.addViewPort();

        pixi.stage.addChild(this);
    }

    generateSprites(config: SpritesGeneratorConfig) {
        this.addViewPort();

        this.unfreezeViewport();
        this.viewPort.removeChildren();

        const sprites: Sprite[] = runAndMeasure(generateSprites, config);

        pixi.stop();
        runAndMeasure(addSpritesToViewPort, {
            sprites,
            viewPort: this.viewPort,
        });
        pixi.start();

        this.freezeViewport();
    }

    private addViewPort() {
        if (this.viewPort) return;

        this.viewPort = new Container();

        this.viewPort.sortableChildren = false;
        this.viewPort.cullable = true;

        this.restoreState();
        this.addChild(this.viewPort);
    }

    private freezeViewport() {
        (this.viewPort as any).cacheAsBitmap = false;
    }

    private unfreezeViewport() {
        (this.viewPort as any).cacheAsBitmap = true;
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

        // Clamp the scale values to prevent excessive scaling
        this.viewPort.scale.x = Math.max(
            config.minScale,
            Math.min(this.viewPort.scale.x, config.maxScale),
        ); // Min 0.1, Max 3
        this.viewPort.scale.y = Math.max(0.1, Math.min(this.viewPort.scale.y, config.maxScale));

        this.saveState();
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

        this.saveState();
    }

    private saveState() {
        ls.set('viewPort', {
            pos: {
                x: Math.round(this.viewPort.x * 100) / 100,
                y: Math.round(this.viewPort.y * 100) / 100,
            },
            scale: {
                x: Math.round(this.viewPort.scale.x * 100) / 100,
                y: Math.round(this.viewPort.scale.y * 100) / 100,
            },
        });
    }

    private restoreState() {
        const storedData: any = ls.get('viewPort');

        if (storedData) {
            this.viewPort.x = storedData.pos.x;
            this.viewPort.y = storedData.pos.y;

            this.viewPort.scale.x = storedData.scale.x;
            this.viewPort.scale.y = storedData.scale.y;
        } else {
            this.setDefaultPosition();
        }
    }

    private setDefaultPosition() {
        const { width, height } = pixi.getAppSize();

        this.viewPort.x = width / 2;
        this.viewPort.y = height / 2;
    }
}
