import ls from 'localstorage-slim';
import { Container } from '@pixi/display';
import { Rectangle, type Texture } from '@pixi/core';
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

        const storedData: any = ls.get('viewPort');

        if (storedData) {
            this.viewPort.position.set(storedData.pos);
            this.viewPort.scale.set(storedData.scale);
        }

        this.viewPort.sortableChildren = false;
        this.viewPort.cullable = true;
    }

    generateSprites({ w, h }: { w: number; h: number }) {
        this.viewPort.removeChildren();

        pixi.stop();

        (this.viewPort as any).false = true;

        const startTime = Date.now();

        const x = (-6 * w) / 2;
        const y = (-6 * h) / 2;

        const cullArea = new Rectangle(0, 0, window.innerWidth, window.innerHeight);

        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                const sprite = this.getSprite(x + i * 6, y + j * 6, 5, 5);

                sprite.cullArea = cullArea;

                if (!i && !j) {
                    (window as any).sprite = sprite;
                }

                sprite.tint = this.getRandomColor();
                this.viewPort.addChild(sprite);
            }
        }

        const endTime = Date.now();

        console.log(
            `%c ${(w * h).toLocaleString()} sprites generated in ${
                (endTime - startTime) / 1000
            } sec `,
            'font-weight: bold; color: black; background-color: white; font-size: 16px;',
        );

        (this.viewPort as any).cacheAsBitmap = true;

        pixi.start();
    }

    private addEvents() {
        window.addEventListener('wheel', (event) => {
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

        window.addEventListener('pointerdown', (event) => event.button === 0 && (dragging = true), {
            passive: true,
        });
        window.addEventListener('pointerup', () => (dragging = false), {
            passive: true,
        });
        window.addEventListener('pointerupoutside', () => (dragging = false), {
            passive: true,
        });

        window.addEventListener(
            'pointermove',
            (event) => {
                if (dragging) {
                    this.viewPort.x += event.movementX;
                    this.viewPort.y += event.movementY;

                    ls.set('viewPort', { pos: this.viewPort.position, scale: this.viewPort.scale });
                }
            },
            {
                passive: true,
            },
        );
    }

    private getRandomColor(): string {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        return `#${randomColor.padStart(6, '0')}`; // Ensure it's always 6 digits
    }

    private getSprite(x: number, y: number, w = 50, h = 50): Sprite {
        const sprite = new Sprite(this.texture);

        sprite.cullable = true;

        sprite.width = w;
        sprite.height = h;
        sprite.tint = 'white';

        sprite.x = x;
        sprite.y = y;

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
