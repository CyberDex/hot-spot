import { Container } from '@pixi/display';
import { type Texture } from '@pixi/core';
import { Text } from '@pixi/text';
import { Sprite } from '@pixi/sprite';
import { Graphics } from '@pixi/graphics';
import { pixi } from './plugins/Pixi';

export class App extends Container {
    private texture: Texture;
    private viewPort = new Container();
    private spritesAmount!: Text;
    private visibleSpritesAmount!: Text;

    constructor() {
        super();

        this.texture = this.generateTexture(1000, 1000);

        this.addViewPort();
        this.addSpritesAmountText();
        this.addEvents();
    }

    private addViewPort() {
        this.addChild(this.viewPort);

        // this.viewPort.cullableChildren = true;
        // this.viewPort.CacheAsBitmap = true;
    }

    private addSpritesAmountText() {
        this.spritesAmount = new Text('Sprites: 0', {
            fill: 'white',
            fontSize: 20,
        });

        this.spritesAmount.x = 300;

        this.addChild(this.spritesAmount);

        this.visibleSpritesAmount = new Text('Visible: 0', {
            fill: 'white',
            fontSize: 20,
        });

        this.visibleSpritesAmount.x = 700;

        this.addChild(this.visibleSpritesAmount);
    }

    generateSprites(amount: { x: number; y: number }) {
        this.viewPort.removeChildren();

        let visibleAmount = 0;

        console.time('generateSprites');

        for (let i = 0; i < amount.x; i++) {
            for (let j = 0; j < amount.y; j++) {
                const sprite = this.addSprite(i * 6, j * 6, 5, 5);

                if (this.isSpriteVisible(sprite)) {
                    visibleAmount++;
                }
            }
        }

        console.timeEnd('generateSprites');

        // this.viewPort.cacheAsBitmap = true;

        this.spritesAmount.text = `Sprites: ${this.viewPort.children.length}`;
        this.visibleSpritesAmount.text = `Visible: ${visibleAmount}`;

        this.resize(window.innerWidth, window.innerHeight);
    }

    private getVisibleSprites() {
        const visibleSprites = [];

        for (let i = 0; i < this.viewPort.children.length; i++) {
            const sprite = this.viewPort.children[i];

            if (this.isSpriteVisible(sprite)) {
                visibleSprites.push(sprite);
            }
        }

        return visibleSprites;
    }

    private isSpriteVisible(sprite: any) {
        return (
            sprite.x > 0 &&
            sprite.x + sprite.width < window.innerWidth &&
            sprite.y > 0 &&
            sprite.y < window.innerHeight
        );
    }

    private addEvents() {
        this.eventMode = 'dynamic';

        this.on('wheel', ({ x, y, deltaY }) => this.zoom(x, y, deltaY));
        this.on('pointerdown', (event) => this.selectElement(event));
    }

    private selectElement(event: any) {
        console.log(`selectElement`, event.x, event.y);
    }

    private zoom(x: number, y: number, zoom: number) {
        // TODO: move the anchor point to the mouse position

        if (this.viewPort.scale.x <= 0) {
            this.viewPort.scale.x = 0;
        }

        console.log('zoom', x, y, zoom);

        this.viewPort.scale.x = this.viewPort.scale.y = this.viewPort.scale.x - zoom / 1000;

        this.visibleSpritesAmount.text = `Visible: ${this.getVisibleSprites().length}`;
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
        this.viewPort.x = width / 2 - this.viewPort.width / 2;
        this.viewPort.y = height / 2 - this.viewPort.height / 2;

        console.log('resize', width, height);
    }
}
