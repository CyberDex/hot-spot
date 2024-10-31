import { Container } from '@pixi/display';
import { type Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import { Graphics } from '@pixi/graphics';
import { pixi } from './plugins/Pixi';

export class App extends Container {
    private texture: Texture;
    private viewPort = new Container();

    constructor() {
        super();

        this.texture = this.generateTexture(1000, 1000);

        this.addViewPort();
        this.addEvents();

        this.resize(window.innerWidth, window.innerHeight);
    }

    private addViewPort() {
        this.addChild(this.viewPort);

        // this.viewPort.cullableChildren = true;
        // this.viewPort.CacheAsBitmap = true;
    }

    generateSprites({ w, h }: { w: number; h: number }) {
        this.viewPort.removeChildren();

        pixi.stop();

        const startTime = Date.now();

        const x = (w / 2) * 6 * -1;
        const y = (h / 2) * 6 * -1;

        for (let i = x; i < w; i++) {
            for (let j = y; j < h; j++) {
                this.addSprite(x + i * 6, y + j * 6, 5, 5);
            }
        }

        const endTime = Date.now();

        console.error(
            `${(w * h).toLocaleString()} sprites generated in ${(endTime - startTime) / 1000} sec`,
        );

        (this.viewPort as any).cacheAsBitmap = true;

        pixi.start();
    }

    private addEvents() {
        this.eventMode = 'dynamic';

        window.addEventListener('wheel', (event) => {
            event.preventDefault(); // Prevent the default scroll behavior

            const scaleAmount = 0.1; // Adjust scale speed
            const direction = event.deltaY < 0 ? 1 : -1;
            const container = this.viewPort;

            // Scroll up or down
            container.scale.x += scaleAmount * direction;
            container.scale.y += scaleAmount * direction;

            // Clamp the scale values to prevent excessive scaling
            container.scale.x = Math.max(0.1, Math.min(container.scale.x, 3)); // Min 0.1, Max 3
            container.scale.y = Math.max(0.1, Math.min(container.scale.y, 3));
        });

        let dragging = false;

        this.viewPort.on('pointerdown', () => (dragging = true));
        this.viewPort.on('pointerup', () => (dragging = false));
        this.viewPort.on('pointerupoutside', () => (dragging = false));

        this.viewPort.on('pointermove', (event) => {
            if (dragging) {
                this.viewPort.x += event.movementX;
                this.viewPort.y += event.movementY;
            }
        });
    }

    private addSprite(x: number, y: number, w: number, h: number): Sprite {
        const sprite = this.getSprite(w, h);

        sprite.cullable = true;

        sprite.x = x;
        sprite.y = y;

        this.viewPort.addChild(sprite);

        return sprite;
    }

    private getSprite(w = 50, h = 50, color = 'gray'): Sprite {
        const sprite = new Sprite(this.texture);

        sprite.width = w;
        sprite.height = h;
        sprite.tint = color;

        return sprite;
    }

    private generateTexture(w = 50, h = 50): Texture {
        const templateShape = new Graphics().beginFill(0xffffff).drawRect(50, 50, w, h);

        return pixi.renderer.generateTexture(templateShape);
    }

    resize(width: number, height: number) {
        this.viewPort.x = width / 2;
        this.viewPort.y = height / 2;
    }
}
