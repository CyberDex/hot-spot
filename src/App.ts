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

        this.resize(window.innerWidth, window.innerHeight);
    }

    generateSprites(config: SpritesGeneratorConfig) {
        this.addViewPort();

        (this.viewPort as any).cacheAsBitmap = false;

        this.viewPort.removeChildren();

        pixi.stop();

        const sprites: Sprite[] = runAndMeasure(generateSprites, config);

        runAndMeasure(addSpritesToViewPort, {
            sprites,
            viewPort: this.viewPort,
        });

        (this.viewPort as any).cacheAsBitmap = true;

        pixi.start();
    }

    private addViewPort() {
        if (this.viewPort) return;

        this.viewPort = new Container();

        this.addChild(this.viewPort);

        const storedData: any = ls.get('viewPort');

        if (storedData) {
            this.viewPort.position.set(storedData.pos);
            this.viewPort.scale.set(storedData.scale);
        }

        this.viewPort.sortableChildren = false;
        this.viewPort.cullable = true;
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
        const scaleAmount = 0.1; // Adjust scale speed
        const direction = event.deltaY < 0 ? 1 : -1;
        const container = this.viewPort;

        // Scroll up or down
        container.scale.x += scaleAmount * direction;
        container.scale.y += scaleAmount * direction;

        // Clamp the scale values to prevent excessive scaling
        container.scale.x = Math.max(config.minScale, Math.min(container.scale.x, 3)); // Min 0.1, Max 3
        container.scale.y = Math.max(0.1, Math.min(container.scale.y, 3));

        console.log(`onZoom`, {
            scaleAmount,
            direction,
            scale: container.scale.x,
        });
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

        console.log(`onDrag`);
    }

    private onDragEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;

        console.log(`onDragEnd`, { pos: this.viewPort.position, scale: this.viewPort.scale });

        ls.set('viewPort', { pos: this.viewPort.position, scale: this.viewPort.scale });
    }

    resize(width: number, height: number) {
        this.addViewPort();

        this.viewPort.x = width / 2;
        this.viewPort.y = height / 2;
    }
}
