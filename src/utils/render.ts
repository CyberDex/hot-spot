import { type State } from 'App';
import { type Graphics, Texture } from 'pixi.js';

export function renderViewport({
    viewport,
    width,
    height,
    size,
    dist,
}: State & { viewport: Graphics }) {
    console.info(
        `Rendering viewport ${width}x${height}, ${(width * height).toLocaleString()} cells`,
    );

    viewport.clear();

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const sizeWithDist = size + dist;
            const x = sizeWithDist * i;
            const y = sizeWithDist * j;

            viewport.texture(Texture.WHITE, getRandomColor(), x, y, size, size);
        }
    }
}

function getRandomColor(): string {
    let randomColor;

    do {
        randomColor = Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0');
    } while (parseInt(randomColor, 16) < 0x333333); // Threshold to exclude dark colors

    return `#${randomColor}`;
}
