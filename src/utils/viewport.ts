import { Texture } from '@pixi/core';
import { Sprite } from '@pixi/sprite';

export function addSpritesToViewPort(params: { sprites: Sprite[]; viewPort: any }) {
    for (const sprite of params.sprites) {
        params.viewPort.addChild(sprite);
    }
}

export function generateSprites({ width, height, size, dist }: SpritesGeneratorConfig): Sprite[] {
    const sizeWithDist = size + dist;

    const x = (-sizeWithDist * width) / 2;
    const y = (-sizeWithDist * height) / 2;
    const sprites: Sprite[] = [];

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const sprite = getSprite(x + i * sizeWithDist, y + j * sizeWithDist, size, size);

            sprite.tint = getRandomColor();
            sprites.push(sprite);
        }
    }

    return sprites;
}

function getSprite(x: number, y: number, w = 5, h = 5): Sprite {
    const sprite = new Sprite(Texture.WHITE);

    sprite.cullable = true;

    sprite.x = x;
    sprite.y = y;

    sprite.width = w;
    sprite.height = h;

    return sprite;
}

function getRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    return `#${randomColor.padStart(6, '0')}`; // Ensure it's always 6 digits
}

export type SpritesGeneratorConfig = {
    width: number;
    height: number;
    size: number;
    dist: number;
};
